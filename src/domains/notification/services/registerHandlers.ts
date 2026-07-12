import { registerHandler, startAutoSync } from "@/packages/offline";
import { markNotificationAsRead } from "@/lib/notifications.functions";
import { supabase } from "@/integrations/supabase/client";
import { notificationRepository } from "../repositories/NotificationRepository";

/**
 * Register notification outbox handlers + open the realtime channel for
 * server-pushed notifications. Client-only, idempotent.
 *
 * Seed notifications use short ids ("n1") — the handler skips those so
 * the outbox does not loop.
 */
const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
let realtimeStarted = false;

export function registerNotificationSync() {
  registerHandler<{ id: string }>("notification", "mark_read", async (payload) => {
    if (!uuidRe.test(payload.id)) return;
    await markNotificationAsRead({ data: { id: payload.id } });
  });

  if (typeof window !== "undefined" && !realtimeStarted) {
    realtimeStarted = true;
    // Realtime: mirror server-side inserts into the local Dexie cache so
    // the UI reacts instantly without an extra fetch.
    void supabase.auth.getUser().then(({ data }) => {
      const userId = data.user?.id;
      if (!userId) return;
      supabase
        .channel(`notifications:${userId}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
          async () => {
            // Trigger a re-list; consumers subscribed via useNotifications will re-hydrate.
            await notificationRepository.list();
            window.dispatchEvent(new CustomEvent("vitala:notifications-updated"));
          },
        )
        .subscribe();
    });
  }

  startAutoSync();
}
