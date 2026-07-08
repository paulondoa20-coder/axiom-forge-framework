export type NotificationType =
  | "message"
  | "radar_response"
  | "flash_new"
  | "scan_discovery"
  | "trust_verification"
  | "trust_activity";
export type NotificationPriority = "urgent" | "important" | "normal" | "info";
export type NotificationHubContext = "flash" | "radar" | "scan" | "trust" | "message";

export interface Notification {
  id: string;
  type: NotificationType;
  context: NotificationHubContext;
  title: string;
  description: string;
  timestamp: string;
  date: "today" | "yesterday" | "this_week";
  priority: NotificationPriority;
  read: boolean;
  avatar?: string;
  avatarInitials?: string;
  actionUrl?: string;
  actions?: Array<{ id: string; label: string; type: "primary" | "secondary" }>;
}

export const PRIORITY_META: Record<NotificationPriority, { label: string; color: string; bgColor: string }> = {
  urgent: { label: "Urgent", color: "var(--destructive)", bgColor: "color-mix(in oklch, var(--destructive) 14%, transparent)" },
  important: { label: "Important", color: "var(--live)", bgColor: "color-mix(in oklch, var(--live) 14%, transparent)" },
  normal: { label: "Normal", color: "var(--foreground)", bgColor: "transparent" },
  info: { label: "Info", color: "var(--muted-foreground)", bgColor: "transparent" },
};

export const CONTEXT_META: Record<NotificationHubContext, { label: string; color: string }> = {
  flash: { label: "Flash", color: "var(--flash)" },
  radar: { label: "Radar", color: "var(--radar)" },
  scan: { label: "Scan", color: "var(--scan)" },
  trust: { label: "Trust", color: "var(--trust)" },
  message: { label: "Message", color: "var(--scan)" },
};
