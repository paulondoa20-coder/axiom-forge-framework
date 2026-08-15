import { useCallback, useEffect, useState } from "react";
import { getSyncStatus } from "../use-cases/GetSyncStatus";
import type { SyncStatus } from "../entities/SyncStatus";

const INITIAL: SyncStatus = { state: "synced", pending: 0, online: true };

/** SSR-safe: starts optimistic, then polls the outbox on the client. */
export function useSyncStatus(intervalMs = 5000): SyncStatus {
  const [status, setStatus] = useState<SyncStatus>(INITIAL);

  const refresh = useCallback(() => {
    void getSyncStatus().then(setStatus);
  }, []);

  useEffect(() => {
    refresh();
    const id = window.setInterval(refresh, intervalMs);
    window.addEventListener("online", refresh);
    window.addEventListener("offline", refresh);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("online", refresh);
      window.removeEventListener("offline", refresh);
    };
  }, [refresh, intervalMs]);

  return status;
}
