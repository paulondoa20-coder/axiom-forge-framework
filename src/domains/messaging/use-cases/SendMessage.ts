import { conversationRepository } from "../repositories/ConversationRepository";
import { enqueue } from "@/packages/offline";
import type { Message } from "../entities/Message";
import { ME_ID } from "../entities/Message";

export interface SendMessageInput {
  conversationId: string;
  text: string;
  timestamp?: string;
}

export interface SendMessagePayload {
  conversationId: string;
  clientMessageId: string;
  content: string;
}

function makeUuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  // Fallback (SSR / older runtimes) — RFC4122 v4-ish, sufficient for outbox keys.
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/**
 * Use case — send a message. Local write is immediate (offline-first);
 * the outbox queues it for future remote sync.
 *
 * Idempotency: `clientMessageId` is a stable UUID used as the dedup key
 * remotely. The outbox handler in `services/registerHandlers` calls
 * `sendMessageRemote({ conversation_id, client_message_id, content })`.
 */
export async function sendMessage(input: SendMessageInput): Promise<Message> {
  const conv = await conversationRepository.get(input.conversationId);
  if (!conv) throw new Error(`Conversation ${input.conversationId} not found`);

  const clientMessageId = makeUuid();
  const msg: Message = {
    id: clientMessageId,
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

  const payload: SendMessagePayload = {
    conversationId: conv.id,
    clientMessageId,
    content: input.text,
  };
  await enqueue({ domain: "messaging", operation: "send_message", payload });
  return msg;
}
