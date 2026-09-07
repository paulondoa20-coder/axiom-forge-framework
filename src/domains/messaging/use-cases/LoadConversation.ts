import { conversationRepository } from "../repositories/ConversationRepository";
import type { Conversation } from "../entities/Conversation";

export interface LoadConversationResult {
  conversation: Conversation | undefined;
  hasMore: boolean;
}

/**
 * Use case — load the latest page of a conversation (offline-first: Dexie
 * mirror first, then remote refresh) and acknowledge reading it.
 */
export async function loadConversation(id: string, limit = 30): Promise<LoadConversationResult> {
  const { conversation, hasMore } = await conversationRepository.loadMessages(id, { limit });
  if (!conversation) return { conversation: undefined, hasMore: false };
  const read = await conversationRepository.markRead(id);
  return { conversation: read ?? conversation, hasMore };
}

/** Use case — load older history above the current page. */
export async function loadOlderMessages(id: string, before: string, limit = 30) {
  return conversationRepository.loadMessages(id, { before, limit });
}

/** Use case — acknowledge reception/reading of a conversation. */
export async function acknowledgeConversation(id: string): Promise<Conversation | undefined> {
  return conversationRepository.markRead(id);
}

/** Use case — retry every message that failed to sync. */
export async function retryFailedMessages(id: string): Promise<Conversation | undefined> {
  await conversationRepository.retryFailed();
  return conversationRepository.syncOutboxStatuses(id);
}
