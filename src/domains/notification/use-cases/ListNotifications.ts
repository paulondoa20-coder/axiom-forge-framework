import { notificationRepository } from "../repositories/NotificationRepository";
import type { Notification } from "../entities/Notification";

export async function listNotifications(): Promise<Notification[]> {
  return notificationRepository.list();
}
