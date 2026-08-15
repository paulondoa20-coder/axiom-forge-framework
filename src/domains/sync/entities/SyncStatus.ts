/** Sync domain — pure DTO describing the offline queue state. */
export type SyncState = "offline" | "pending" | "synced";

export interface SyncStatus {
  state: SyncState;
  /** Number of mutations still waiting in the outbox. */
  pending: number;
  online: boolean;
}

export const SYNC_LABEL: Record<SyncState, string> = {
  offline: "Hors ligne",
  pending: "En attente",
  synced: "Synchronisé",
};

export const SYNC_COLOR: Record<SyncState, string> = {
  offline: "var(--muted-foreground)",
  pending: "var(--warning)",
  synced: "var(--success)",
};

export function toSyncState(online: boolean, pending: number): SyncState {
  if (!online) return "offline";
  return pending > 0 ? "pending" : "synced";
}
