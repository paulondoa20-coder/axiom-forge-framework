import { pending, markInFlight, markDone, markFailed } from "../outbox/outbox";
import { getDb } from "../dexie/db";

/**
 * Sync engine — drains the outbox by delegating each entry to a
 * domain-registered handler. Handlers own the actual network call.
 *
 * Handlers are typed per-domain via `registerHandler<TPayload>(...)`.
 * A handler that throws `ConflictError` records the conflict in
 * `outbox_conflicts` instead of retrying blindly.
 */
export type OutboxHandler<TPayload = unknown> = (payload: TPayload) => Promise<void>;

export class ConflictError extends Error {
  constructor(
    public readonly local: unknown,
    public readonly remote: unknown,
    public readonly strategy: "lww" | "auto" | "user" | "server" = "user",
  ) {
    super("Sync conflict");
    this.name = "ConflictError";
  }
}

const handlers = new Map<string, OutboxHandler>();

export function registerHandler<TPayload = unknown>(
  domain: string,
  operation: string,
  handler: OutboxHandler<TPayload>,
) {
  handlers.set(`${domain}:${operation}`, handler as OutboxHandler);
}

async function recordConflict(
  entry: { id: string; domain: string; operation: string; payload: unknown },
  err: ConflictError,
) {
  const db = getDb();
  if (!db) return;
  await db.outbox_conflicts.put({
    id: `${entry.id}-${Date.now()}`,
    outboxId: entry.id,
    domain: entry.domain,
    operation: entry.operation,
    local: entry.payload,
    remote: err.remote,
    strategy: err.strategy,
    createdAt: Date.now(),
    resolved: 0,
  });
}

export async function drain() {
  if (typeof window === "undefined") return;
  const entries = await pending();
  for (const entry of entries) {
    const key = `${entry.domain}:${entry.operation}`;
    const handler = handlers.get(key);
    if (!handler) continue; // no remote sync configured yet — keep pending
    try {
      await markInFlight(entry.id);
      await handler(entry.payload);
      await markDone(entry.id);
    } catch (err) {
      if (err instanceof ConflictError) {
        await recordConflict(entry, err);
        await markFailed(entry.id, err.message);
        continue;
      }
      await markFailed(entry.id, err instanceof Error ? err.message : String(err));
    }
  }
}

let started = false;
export function startAutoSync(intervalMs = 15_000) {
  if (started || typeof window === "undefined") return;
  started = true;
  const tick = () => {
    void drain();
  };
  window.addEventListener("online", tick);
  window.setInterval(tick, intervalMs);
  tick();
}
