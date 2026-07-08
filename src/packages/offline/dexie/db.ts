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

export interface ConversationRecord {
  id: string;
  data: unknown; // full Conversation DTO snapshot
  updatedAt: number;
}

export interface NotificationRecord {
  id: string;
  data: unknown; // full Notification DTO snapshot
  read: 0 | 1;
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
  conversations!: Table<ConversationRecord, string>;
  notifications!: Table<NotificationRecord, string>;
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
