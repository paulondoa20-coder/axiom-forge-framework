import { useEffect, useState, useCallback } from "react";
import { NOTIFICATION_SEED } from "../data/seed";
import { listNotifications } from "../use-cases/ListNotifications";
import { markAsRead } from "../use-cases/MarkAsRead";
import type { Notification } from "../entities/Notification";

export function useNotifications() {
  const [items, setItems] = useState<Notification[]>(NOTIFICATION_SEED);

  useEffect(() => {
    let cancelled = false;
    void listNotifications().then((data) => {
      if (!cancelled) setItems(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const markRead = useCallback(async (id: string) => {
    await markAsRead(id);
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  return { notifications: items, markRead };
}
