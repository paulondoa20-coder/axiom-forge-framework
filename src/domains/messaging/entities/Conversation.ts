import type { HubContext } from "./HubContext";
import type { Message } from "./Message";

export type ConvStatus = "new" | "active" | "resolved" | "unread";

export interface Conversation {
  id: string;
  contact: {
    id: string;
    name: string;
    handle: string;
    trustScore: number;
    verified: boolean;
    avatarInitials: string;
  };
  context: HubContext;
  contextTitle: string;
  contextSummary: string;
  status: ConvStatus;
  lastMessage: string;
  lastTs: string;
  unread: number;
  messages: Message[];
}
