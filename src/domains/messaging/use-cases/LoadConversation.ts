import { conversationRepository } from "../repositories/ConversationRepository";
import type { Conversation } from "../entities/Conversation";

/**
 * Use case — load a single conversation with its messages (offline-first:
 * Dexie mirror first, then remote refresh) and acknowledge reading it.
 */
export async function loadConversation(id: string): Promise<Conversation | undefined> {
  const withMessages = await conversationRepository.loadMessages(id);
  if (!withMessages) return undefined;
  return (await conversationRepository.markRead(id)) ?? withMessages;
}

/** Use case — acknowledge reception/reading of a conversation. */
export async function acknowledgeConversation(id: string): Promise<Conversation | undefined> {
  return conversationRepository.markRead(id);
}
