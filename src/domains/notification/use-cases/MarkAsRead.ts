import { notificationRepository } from "../repositories/NotificationRepository";
import { enqueue } from "@/packages/offline";

export async function markAsRead(id: string): Promise<void> {
  await notificationRepository.markRead(id);
  await enqueue({ domain: "notification", operation: "mark_read", payload: { id } });
}
