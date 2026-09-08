import { getDb, entriesByDomain, requeueFailed, drain, type ConversationRecord } from "@/packages/offline";
import { supabase } from "@/integrations/supabase/client";
import { listMyConversations, listConversationMessages } from "@/lib/messaging.functions";
import type { Conversation } from "../entities/Conversation";
import type { Message } from "../entities/Message";
import type { HubContext } from "../entities/HubContext";
import { CONVERSATION_SEED } from "../data/seed";

const TABLE = "conversations";

/** Protected server fns 401 without a session: only call them when signed in. */
async function hasSession(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    const { data } = await supabase.auth.getSession();
    return Boolean(data.session?.access_token);
  } catch {
    return false;
  }
}

/** Remote row shapes (kept local — the DTO is the public contract). */
type RemoteConv = {
  conversation: {
    id: string;
    title: string | null;
    context_type: string | null;
    context_id: string | null;
    conversation_type: string;
    created_by: string;
    updated_at: string;
    created_at: string;
  };
  other: { id: string; display_name: string | null; avatar_url: string | null; city: string | null } | null;
  last: { id: string; sender_id: string; content: string; created_at: string; status: string } | null;
};

type RemoteMessage = {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
  status: string;
  client_message_id: string | null;
};

const CONTEXTS: HubContext[] = ["flash", "radar", "scan", "trust"];

function toContext(value: string | null): HubContext {
  const v = (value ?? "").toLowerCase();
  return (CONTEXTS.find((c) => c === v) ?? "scan") as HubContext;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("") || "??";
}

function formatTs(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  if (sameDay) return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const yesterday = new Date(today.getTime() - 86_400_000);
  if (d.toDateString() === yesterday.toDateString()) return "Hier";
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
}

function toMessageDto(row: RemoteMessage, meId: string): Message {
  return {
    id: row.client_message_id ?? row.id,
    senderId: row.sender_id === meId ? "me" : row.sender_id,
    text: row.content,
    timestamp: formatTs(row.created_at),
    createdAt: row.created_at,
    status: row.status === "READ" ? "read" : row.status === "DELIVERED" ? "delivered" : "sent",
  };
}

/** Merge two message lists, de-duplicated by id and ordered oldest → newest. */
function mergeMessages(a: Message[], b: Message[]): Message[] {
  const byId = new Map<string, Message>();
  for (const m of [...a, ...b]) {
    const prev = byId.get(m.id);
    byId.set(m.id, prev ? { ...prev, ...m } : m);
  }
  return [...byId.values()].sort((x, y) => (x.createdAt ?? "").localeCompare(y.createdAt ?? ""));
}

function toConversationDto(row: RemoteConv, existing?: Conversation): Conversation {
  const name = row.other?.display_name?.trim() || "Membre VITALA";
  const context = toContext(row.conversation.context_type);
  return {
    id: row.conversation.id,
    contact: {
      id: row.other?.id ?? "unknown",
      name,
      handle: `@${name.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.|\.$/g, "")}`,
      trustScore: existing?.contact.trustScore ?? 70,
      verified: existing?.contact.verified ?? false,
      avatarInitials: initials(name),
    },
    context,
    contextTitle: row.conversation.title ?? "Conversation",
    contextSummary: row.other?.city ? `Échange · ${row.other.city}` : "Échange VITALA",
    status: existing?.status ?? "active",
    lastMessage: row.last?.content ?? "Nouvelle conversation",
    lastTs: formatTs(row.last?.created_at ?? row.conversation.updated_at),
    unread: existing?.unread ?? 0,
    messages: existing?.messages ?? [],
  };
}

export class ConversationRepository {
  /** Local mirror only (Dexie), with seed fallback for SSR / first run. */
  private async local(): Promise<Conversation[] | null> {
    const db = getDb();
    if (!db) return null;
    const rows = await db.conversations.toArray();
    return rows.map((r) => r.data as Conversation);
  }

  private async putAll(convs: Conversation[]): Promise<void> {
    const db = getDb();
    if (!db) return;
    await db.conversations.bulkPut(
      convs.map((c) => ({ id: c.id, data: c, updatedAt: Date.now() }) as ConversationRecord),
    );
  }

  /**
   * Pull the real conversations from the server and mirror them into Dexie.
   * Returns `null` when the remote is unreachable / unauthenticated so the
   * caller can fall back on the local mirror.
   */
  async syncFromRemote(): Promise<Conversation[] | null> {
    if (!(await hasSession())) return null;
    try {
      const res = (await listMyConversations()) as { success: boolean; data: RemoteConv[] };
      if (!res?.success) return null;
      const cached = (await this.local()) ?? [];
      const merged = res.data.map((row) =>
        toConversationDto(row, cached.find((c) => c.id === row.conversation.id)),
      );
      await this.putAll(merged);
      return merged;
    } catch {
      return null;
    }
  }

  async list(): Promise<Conversation[]> {
    const remote = await this.syncFromRemote();
    if (remote && remote.length > 0) return remote;

    const local = await this.local();
    if (local === null) return CONVERSATION_SEED;
    if (local.length === 0) {
      if (remote) return [];
      await this.putAll(CONVERSATION_SEED);
      return CONVERSATION_SEED;
    }
    return local;
  }

  async get(id: string): Promise<Conversation | undefined> {
    const db = getDb();
    if (!db) return CONVERSATION_SEED.find((c) => c.id === id);
    const rec = await db.conversations.get(id);
    if (rec) return rec.data as Conversation;
    return CONVERSATION_SEED.find((c) => c.id === id);
  }

  /**
   * Fetch one page of remote messages and mirror it locally.
   * `before` loads older history (progressive pagination); locally queued
   * messages (pending/failed) are always preserved.
   */
  async loadMessages(
    id: string,
    opts: { before?: string; limit?: number } = {},
  ): Promise<{ conversation: Conversation | undefined; hasMore: boolean }> {
    const current = await this.get(id);
    try {
      const res = (await listConversationMessages({
        data: { conversation_id: id, ...(opts.before ? { before: opts.before } : {}), limit: opts.limit ?? 30 },
      })) as { success: boolean; data: RemoteMessage[]; hasMore: boolean; me: string };
      if (!res?.success || !current) return { conversation: current, hasMore: false };

      const remote = res.data.map((m) => toMessageDto(m, res.me));
      const queued = current.messages.filter(
        (m) => (m.status === "pending" || m.status === "failed") && !remote.some((r) => r.id === m.id),
      );
      const base = opts.before ? current.messages : queued;
      const messages = mergeMessages(base, remote);
      const last = messages[messages.length - 1];
      const updated: Conversation = {
        ...current,
        messages,
        lastMessage: last?.text ?? current.lastMessage,
        lastTs: last?.timestamp ?? current.lastTs,
      };
      await this.upsert(updated);
      return { conversation: updated, hasMore: Boolean(res.hasMore) };
    } catch {
      return { conversation: current, hasMore: false };
    }
  }

  /** Reconcile local delivery statuses with the outbox (pending/failed/sent). */
  async syncOutboxStatuses(id: string): Promise<Conversation | undefined> {
    const conv = await this.get(id);
    if (!conv) return undefined;
    const entries = await entriesByDomain("messaging");
    const byOutboxId = new Map(entries.map((e) => [e.id, e]));
    let changed = false;
    const messages = conv.messages.map((m) => {
      if (!m.outboxId) return m;
      const entry = byOutboxId.get(m.outboxId);
      const next: Message["status"] = !entry
        ? m.status === "pending" || m.status === "failed"
          ? "sent"
          : m.status
        : entry.status === "failed"
          ? "failed"
          : "pending";
      if (next === m.status) return m;
      changed = true;
      return { ...m, status: next };
    });
    if (!changed) return conv;
    const updated = { ...conv, messages };
    await this.upsert(updated);
    return updated;
  }

  /** Requeue every failed messaging entry and drain the outbox now. */
  async retryFailed(): Promise<number> {
    const count = await requeueFailed("messaging");
    await drain();
    return count;
  }

  /**
   * Realtime — new messages of one conversation, pushed by the server.
   * Returns an unsubscribe function; no-op on the server.
   */
  subscribe(id: string, onChange: () => void): () => void {
    if (typeof window === "undefined") return () => {};
    const channel = supabase
      .channel(`conversation:${id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages", filter: `conversation_id=eq.${id}` },
        () => onChange(),
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }

  async upsert(conv: Conversation): Promise<void> {
    const db = getDb();
    if (!db) return;
    const rec: ConversationRecord = { id: conv.id, data: conv, updatedAt: Date.now() };
    await db.conversations.put(rec);
  }

  /** Local read-receipt: clears the unread counter and marks messages read. */
  async markRead(id: string): Promise<Conversation | undefined> {
    const conv = await this.get(id);
    if (!conv) return undefined;
    const updated: Conversation = {
      ...conv,
      unread: 0,
      status: conv.status === "unread" || conv.status === "new" ? "active" : conv.status,
      messages: conv.messages.map((m) => (m.senderId === "me" ? m : { ...m, status: "read" as const })),
    };
    await this.upsert(updated);
    return updated;
  }
}

export const conversationRepository = new ConversationRepository();
export { TABLE as CONVERSATION_TABLE };
