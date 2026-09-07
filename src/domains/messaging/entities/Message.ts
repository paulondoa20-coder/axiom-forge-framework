/**
 * Message delivery lifecycle:
 *  pending   — written locally, queued in the outbox, not yet on the server
 *  failed    — outbox sync failed, user can retry
 *  sent      — accepted by the server
 *  delivered — reached the recipient device
 *  read      — acknowledged (read receipt)
 */
export type MsgStatus = "pending" | "failed" | "sent" | "delivered" | "read";

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: MsgStatus;
  /** Outbox entry id while the message is queued (pending/failed). */
  outboxId?: string;
  type?: "text" | "action" | "system";
  actionLabel?: string;
}

export const ME_ID = "me";
