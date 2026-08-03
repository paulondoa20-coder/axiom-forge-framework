import { renderNotification, type NotificationPayload, type RenderedNotification } from "./templates";
import { FEATURES } from "@/packages/config";

/**
 * Canaux de notification (P2-03). Push/email sont des stubs tant que les
 * providers ne sont pas branchés : ils loguent et retournent `skipped`.
 */
export type Channel = "in_app" | "push" | "email";

export interface DispatchResult {
  channel: Channel;
  status: "sent" | "skipped";
}

export async function dispatch(
  channel: Channel,
  payload: NotificationPayload,
): Promise<DispatchResult> {
  const rendered: RenderedNotification = renderNotification(payload);

  if (channel === "push" && !FEATURES.pushNotifications) return { channel, status: "skipped" };
  if (channel === "email" && !FEATURES.emailNotifications) return { channel, status: "skipped" };

  console.info(`[notifications:${channel}]`, rendered.title);
  return { channel, status: "sent" };
}
