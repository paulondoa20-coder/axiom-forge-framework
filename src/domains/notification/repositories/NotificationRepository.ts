import { getDb } from "@/packages/offline";
import type { Notification } from "../entities/Notification";
import { NOTIFICATION_SEED } from "../data/seed";

export class NotificationRepository {
  async list(): Promise<Notification[]> {
    const db = getDb();
    if (!db) return NOTIFICATION_SEED;
    const rows = await db.notifications.toArray();
    if (rows.length === 0) {
      await db.notifications.bulkPut(
        NOTIFICATION_SEED.map((n) => ({ id: n.id, data: n, read: n.read ? 1 : 0, updatedAt: Date.now() })),
      );
      return NOTIFICATION_SEED;
    }
    return rows.map((r) => r.data as Notification);
  }

  async markRead(id: string): Promise<void> {
    const db = getDb();
    if (!db) return;
    const rec = await db.notifications.get(id);
    if (!rec) return;
    const data = { ...(rec.data as Notification), read: true };
    await db.notifications.put({ id, data, read: 1, updatedAt: Date.now() });
  }
}

export const notificationRepository = new NotificationRepository();
