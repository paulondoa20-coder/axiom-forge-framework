import { pending, markInFlight, markDone, markFailed } from "../outbox/outbox";

/**
 * Sync engine — drains the outbox by delegating each entry to a
 * domain-registered handler. Handlers own the actual network call.
 */
export type OutboxHandler = (payload: unknown) => Promise<void>;

const handlers = new Map<string, OutboxHandler>();

export function registerHandler(domain: string, operation: string, handler: OutboxHandler) {
  handlers.set(`${domain}:${operation}`, handler);
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
      await markFailed(entry.id, err instanceof Error ? err.message : String(err));
    }
  }
}

let started = false;
export function startAutoSync(intervalMs = 15_000) {
  if (started || typeof window === "undefined") return;
  started = true;
  const tick = () => { void drain(); };
  window.addEventListener("online", tick);
  window.setInterval(tick, intervalMs);
  tick();
}
