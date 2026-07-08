import { getDb, type ConversationRecord } from "@/packages/offline";
import type { Conversation } from "../entities/Conversation";
import { CONVERSATION_SEED } from "../data/seed";

const TABLE = "conversations";

export class ConversationRepository {
  async list(): Promise<Conversation[]> {
    const db = getDb();
    if (!db) return CONVERSATION_SEED;
    const rows = await db.conversations.toArray();
    if (rows.length === 0) {
      await db.conversations.bulkPut(
        CONVERSATION_SEED.map((c) => ({ id: c.id, data: c, updatedAt: Date.now() })),
      );
      return CONVERSATION_SEED;
    }
    return rows.map((r) => r.data as Conversation);
  }

  async get(id: string): Promise<Conversation | undefined> {
    const db = getDb();
    if (!db) return CONVERSATION_SEED.find((c) => c.id === id);
    const rec = await db.conversations.get(id);
    return rec ? (rec.data as Conversation) : undefined;
  }

  async upsert(conv: Conversation): Promise<void> {
    const db = getDb();
    if (!db) return;
    const rec: ConversationRecord = { id: conv.id, data: conv, updatedAt: Date.now() };
    await db.conversations.put(rec);
  }
}

export const conversationRepository = new ConversationRepository();
export { TABLE as CONVERSATION_TABLE };
