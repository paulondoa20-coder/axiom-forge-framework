import { useEffect, useState } from "react";
import { CONVERSATION_SEED } from "../data/seed";
import { listConversations } from "../use-cases/ListConversations";
import type { Conversation } from "../entities/Conversation";

/**
 * useConversations — SSR-safe. Returns seed synchronously, then hydrates
 * from Dexie on the client. No component-level Supabase or Dexie access.
 */
export function useConversations(): Conversation[] {
  const [conversations, setConversations] = useState<Conversation[]>(CONVERSATION_SEED);

  useEffect(() => {
    let cancelled = false;
    void listConversations().then((data) => {
      if (!cancelled) setConversations(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return conversations;
}
