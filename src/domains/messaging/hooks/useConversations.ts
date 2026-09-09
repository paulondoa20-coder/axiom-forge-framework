import { useEffect, useState } from "react";
import { onIdentityChange } from "@/packages/auth";
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
    const load = () => {
      void listConversations().then((data) => {
        if (!cancelled) setConversations(data);
      });
    };
    load();
    // Reload from the server as soon as a session appears (or disappears).
    const unsubscribe = onIdentityChange(load);
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return conversations;
}
