import { conversationRepository } from "../repositories/ConversationRepository";
import type { Conversation } from "../entities/Conversation";

/** Use case — list all conversations (offline-first). */
export async function listConversations(): Promise<Conversation[]> {
  return conversationRepository.list();
}
