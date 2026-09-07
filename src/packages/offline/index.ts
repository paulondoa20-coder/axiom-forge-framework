export { getDb } from "./dexie/db";
export type {
  OutboxRecord,
  ConversationRecord,
  NotificationRecord,
  FlashRecord,
  PreferenceRecord,
  MetaRecord,
} from "./dexie/db";

export {
  enqueue,
  pending,
  markDone,
  markFailed,
  markInFlight,
  entriesByDomain,
  failed,
  requeue,
  requeueFailed,
} from "./outbox/outbox";
export type { OutboxEntry } from "./outbox/outbox";
export { drain, startAutoSync, registerHandler } from "./sync/sync";
export type { OutboxHandler } from "./sync/sync";
export { BaseRepository } from "./repositories/BaseRepository";
