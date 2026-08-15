import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Messaging server functions — offline-first send path.
 *
 * Idempotency contract: (conversation_id, client_message_id) is UNIQUE on
 * `public.messages`. The outbox can safely replay `sendMessage` after a
 * failed sync; conflicting inserts are absorbed as no-ops.
 */

const sendSchema = z
  .object({
    conversation_id: z.string().uuid(),
    client_message_id: z.string().uuid(),
    content: z.string().min(1).max(4000),
  })
  .strict();

export const sendMessageRemote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => sendSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Idempotent read first — if the client_message_id already landed, return it.
    const existing = await supabase
      .from("messages")
      .select("id, status, created_at")
      .eq("conversation_id", data.conversation_id)
      .eq("client_message_id", data.client_message_id)
      .maybeSingle();
    if (existing.error) throw new Error(existing.error.message);
    if (existing.data) {
      return { success: true, data: { message_id: existing.data.id, deduped: true } };
    }

    const { data: row, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: data.conversation_id,
        client_message_id: data.client_message_id,
        sender_id: userId,
        content: data.content,
        status: "SENT",
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    const { audit } = await import("@/packages/core/audit.server");
    await audit.log(userId, "create", "message", row.id, {
      conversation_id: data.conversation_id,
    });

    return { success: true, data: { message_id: row.id, deduped: false } };
  });

const listMessagesSchema = z.object({ conversation_id: z.string().uuid() }).strict();

/** Conversations the signed-in user belongs to, with members and last message. */
export const listMyConversations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const memberships = await supabase
      .from("conversation_members")
      .select("conversation_id")
      .eq("user_id", userId);
    if (memberships.error) throw new Error(memberships.error.message);
    const ids = (memberships.data ?? []).map((m) => m.conversation_id);
    if (ids.length === 0) return { success: true, data: [] };

    const convs = await supabase
      .from("conversations")
      .select("id, title, context_type, context_id, conversation_type, created_by, updated_at, created_at")
      .in("id", ids)
      .order("updated_at", { ascending: false });
    if (convs.error) throw new Error(convs.error.message);

    const members = await supabase
      .from("conversation_members")
      .select("conversation_id, user_id, role")
      .in("conversation_id", ids);
    if (members.error) throw new Error(members.error.message);

    const otherIds = [...new Set((members.data ?? []).map((m) => m.user_id).filter((id) => id !== userId))];
    const profiles = otherIds.length
      ? await supabase.from("profiles").select("id, display_name, avatar_url, city").in("id", otherIds)
      : { data: [], error: null as null };
    if (profiles.error) throw new Error(profiles.error.message);

    const lastMessages = await supabase
      .from("messages")
      .select("id, conversation_id, sender_id, content, created_at, status")
      .in("conversation_id", ids)
      .order("created_at", { ascending: false })
      .limit(200);
    if (lastMessages.error) throw new Error(lastMessages.error.message);

    return {
      success: true,
      data: (convs.data ?? []).map((c) => {
        const convMembers = (members.data ?? []).filter((m) => m.conversation_id === c.id);
        const other = convMembers.find((m) => m.user_id !== userId);
        const profile = (profiles.data ?? []).find((p) => p.id === other?.user_id) ?? null;
        const last = (lastMessages.data ?? []).find((m) => m.conversation_id === c.id) ?? null;
        return { conversation: c, other: profile, last };
      }),
    };
  });

/** Full message list of one conversation (RLS restricts to members). */
export const listConversationMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => listMessagesSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("messages")
      .select("id, conversation_id, sender_id, content, created_at, status, client_message_id")
      .eq("conversation_id", data.conversation_id)
      .order("created_at", { ascending: true })
      .limit(500);
    if (error) throw new Error(error.message);
    return { success: true, data: rows ?? [], me: context.userId };
  });
