import { registerHandler, startAutoSync } from "@/packages/offline";
import { sendMessageRemote } from "@/lib/messaging.functions";
import type { SendMessagePayload } from "../use-cases/SendMessage";

/**
 * Register messaging outbox handlers and start the sync loop.
 * Safe to call multiple times — both `registerHandler` and `startAutoSync`
 * are idempotent. Client-only (guarded by `startAutoSync`).
 *
 * UUID-only: seed conversations use short ids ("c1") — the handler will
 * throw on those, the outbox will mark them failed and stop retrying (no
 * infinite loop). Real DB-backed conversations (uuid) sync normally.
 */
export function registerMessagingSync() {
  registerHandler<SendMessagePayload>("messaging", "send_message", async (payload) => {
    // Skip non-uuid seed ids silently — nothing to sync remotely.
    const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRe.test(payload.conversationId)) return;
    await sendMessageRemote({
      data: {
        conversation_id: payload.conversationId,
        client_message_id: payload.clientMessageId,
        content: payload.content,
      },
    });
  });
  startAutoSync();
}
