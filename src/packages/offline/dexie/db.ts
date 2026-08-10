import Dexie, { type Table } from "dexie";

// Records stored in IndexedDB. Kept as plain snapshots — DTOs live in their
// domain entities and are (de)serialised at the repository boundary.
export interface OutboxRecord {
  id: string;
  domain: string;
  operation: string;
  payload: unknown;
  createdAt: number;
  attempts: number;
  status: "pending" | "in_flight" | "failed";
  lastError?: string;
}

export interface OutboxConflictRecord {
  id: string;
  outboxId: string;
  domain: string;
  operation: string;
  local: unknown;
  remote: unknown;
  strategy?: "lww" | "auto" | "user" | "server";
  createdAt: number;
  resolved: 0 | 1;
}

export interface SyncMetaRecord {
  key: string; // e.g. `<domain>:cursor` or `<domain>:last_pull`
  value: unknown;
  updatedAt: number;
}

export interface ConversationRecord {
  id: string;
  data: unknown;
  updatedAt: number;
}

export interface NotificationRecord {
  id: string;
  data: unknown;
  read: 0 | 1;
  updatedAt: number;
}

export interface FlashRecord {
  id: string;
  data: unknown;
  /** 1 when the row belongs to the signed-in user. */
  mine: 0 | 1;
  /** 1 while the row is queued in the outbox and not yet on the server. */
  pending: 0 | 1;
  createdAt: number;
  updatedAt: number;
}


export interface PreferenceRecord {
  key: string;
  value: unknown;
}

export interface MetaRecord {
  key: string;
  value: unknown;
}

class VitalaDatabase extends Dexie {
  outbox!: Table<OutboxRecord, string>;
  outbox_conflicts!: Table<OutboxConflictRecord, string>;
  sync_meta!: Table<SyncMetaRecord, string>;
  conversations!: Table<ConversationRecord, string>;
  notifications!: Table<NotificationRecord, string>;
  flashes!: Table<FlashRecord, string>;
  preferences!: Table<PreferenceRecord, string>;
  meta!: Table<MetaRecord, string>;

  constructor() {
    super("vitala");
    this.version(1).stores({
      outbox: "id, domain, status, createdAt",
      conversations: "id, updatedAt",
      notifications: "id, read, updatedAt",
      preferences: "key",
      meta: "key",
    });
    // v2 (P1-04) — outbox conflict log + per-domain sync cursors.
    this.version(2).stores({
      outbox: "id, domain, status, createdAt",
      outbox_conflicts: "id, outboxId, domain, resolved, createdAt",
      sync_meta: "key, updatedAt",
      conversations: "id, updatedAt",
      notifications: "id, read, updatedAt",
      preferences: "key",
      meta: "key",
    });
    // v3 (L1-1) — local mirror of the Flash feed (offline-first publication).
    this.version(3).stores({
      outbox: "id, domain, status, createdAt",
      outbox_conflicts: "id, outboxId, domain, resolved, createdAt",
      sync_meta: "key, updatedAt",
      conversations: "id, updatedAt",
      notifications: "id, read, updatedAt",
      flashes: "id, mine, pending, createdAt, updatedAt",
      preferences: "key",
      meta: "key",
    });
  }
}


let _db: VitalaDatabase | null = null;

/**
 * SSR-safe Dexie accessor. Returns `null` on the server (no IndexedDB).
 * Callers MUST handle the null case and fall back to seed data.
 */
export function getDb(): VitalaDatabase | null {
  if (typeof window === "undefined" || typeof indexedDB === "undefined") return null;
  if (!_db) _db = new VitalaDatabase();
  return _db;
}
