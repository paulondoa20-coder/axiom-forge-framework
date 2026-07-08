import { conversationRepository } from "../repositories/ConversationRepository";
import { enqueue } from "@/packages/offline";
import type { Message } from "../entities/Message";
import { ME_ID } from "../entities/Message";

export interface SendMessageInput {
  conversationId: string;
  text: string;
  timestamp?: string;
}

/**
 * Use case — send a message. Local write is immediate (offline-first);
 * the outbox queues it for future remote sync.
 */
export async function sendMessage(input: SendMessageInput): Promise<Message> {
  const conv = await conversationRepository.get(input.conversationId);
  if (!conv) throw new Error(`Conversation ${input.conversationId} not found`);

  const msg: Message = {
    id: `m-${Date.now()}`,
    senderId: ME_ID,
    text: input.text,
    timestamp: input.timestamp ?? new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    status: "sent",
  };

  const updated = {
    ...conv,
    messages: [...conv.messages, msg],
    lastMessage: msg.text,
    lastTs: msg.timestamp,
  };
  await conversationRepository.upsert(updated);
  await enqueue({ domain: "messaging", operation: "send_message", payload: { conversationId: conv.id, message: msg } });
  return msg;
}
