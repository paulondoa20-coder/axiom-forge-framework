import { getDb, type OutboxRecord } from "../dexie/db";

/**
 * Outbox pattern — every mutation is enqueued locally, then drained
 * to the network by the sync engine. Guarantees offline-first writes.
 */
export interface OutboxEntry {
  domain: string;
  operation: string;
  payload: unknown;
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export async function enqueue(entry: OutboxEntry): Promise<string> {
  const db = getDb();
  const id = makeId();
  const record: OutboxRecord = {
    id,
    domain: entry.domain,
    operation: entry.operation,
    payload: entry.payload,
    createdAt: Date.now(),
    attempts: 0,
    status: "pending",
  };
  if (db) await db.outbox.put(record);
  return id;
}

export async function pending(): Promise<OutboxRecord[]> {
  const db = getDb();
  if (!db) return [];
  return db.outbox.where("status").equals("pending").sortBy("createdAt");
}

export async function markInFlight(id: string) {
  const db = getDb();
  if (!db) return;
  await db.outbox.update(id, { status: "in_flight" });
}

export async function markDone(id: string) {
  const db = getDb();
  if (!db) return;
  await db.outbox.delete(id);
}

export async function markFailed(id: string, error: string) {
  const db = getDb();
  if (!db) return;
  const rec = await db.outbox.get(id);
  if (!rec) return;
  await db.outbox.update(id, {
    status: "failed",
    attempts: rec.attempts + 1,
    lastError: error,
  });
}
