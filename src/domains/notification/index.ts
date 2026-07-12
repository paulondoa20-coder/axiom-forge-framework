export * from "./entities/Notification";
export { NOTIFICATION_SEED as NOTIFICATIONS } from "./data/seed";
export { notificationRepository, NotificationRepository } from "./repositories/NotificationRepository";
export { listNotifications } from "./use-cases/ListNotifications";
export { markAsRead } from "./use-cases/MarkAsRead";
export { useNotifications } from "./hooks/useNotifications";
export { registerNotificationSync } from "./services/registerHandlers";

// Legacy alias — existing components import `HubContext` from the notifications module.
export type { NotificationHubContext as HubContext } from "./entities/Notification";
