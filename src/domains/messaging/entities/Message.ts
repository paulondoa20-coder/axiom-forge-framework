export type MsgStatus = "sent" | "delivered" | "read";

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: MsgStatus;
  type?: "text" | "action" | "system";
  actionLabel?: string;
}

export const ME_ID = "me";
