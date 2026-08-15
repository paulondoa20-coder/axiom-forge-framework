import { pending as pendingEntries } from "@/packages/offline";
import { toSyncState, type SyncStatus } from "../entities/SyncStatus";

/** Reads the outbox depth and derives the user-facing sync state. */
export async function getSyncStatus(): Promise<SyncStatus> {
  const online = typeof navigator === "undefined" ? true : navigator.onLine;
  let count = 0;
  try {
    count = (await pendingEntries()).length;
  } catch {
    count = 0;
  }
  return { state: toSyncState(online, count), pending: count, online };
}
