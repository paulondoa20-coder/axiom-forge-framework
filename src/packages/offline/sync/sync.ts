import { pending, markInFlight, markDone, markFailed, failed, requeue } from "../outbox/outbox";
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

/** Max automatic retries before an entry waits for an explicit user retry. */
export const MAX_AUTO_ATTEMPTS = 5;

/** Exponential backoff (capped at 5 min) before auto-retrying a failed entry. */
function backoffMs(attempts: number): number {
  return Math.min(5 * 60_000, 5_000 * 2 ** Math.max(0, attempts - 1));
}

/**
 * Automatic recovery — puts failed entries back in the queue once their
 * backoff window has elapsed and they are still under the attempt cap.
 */
export async function recoverFailed(): Promise<number> {
  const rows = await failed();
  const now = Date.now();
  let requeued = 0;
  for (const row of rows) {
    if (row.attempts >= MAX_AUTO_ATTEMPTS) continue;
    const lastTry = row.createdAt + row.attempts * 1_000;
    if (now - lastTry < backoffMs(row.attempts)) continue;
    await requeue(row.id);
    requeued += 1;
  }
  return requeued;
}

export async function drain() {
  if (typeof window === "undefined") return;
  await recoverFailed();
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
