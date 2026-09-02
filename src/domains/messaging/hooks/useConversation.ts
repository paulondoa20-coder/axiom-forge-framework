import { useCallback, useEffect, useState } from "react";
import { conversationRepository } from "../repositories/ConversationRepository";
import { loadConversation, acknowledgeConversation } from "../use-cases/LoadConversation";
import { sendMessage as sendMessageUseCase } from "../use-cases/SendMessage";
import type { Conversation } from "../entities/Conversation";

interface UseConversationState {
  conversation: Conversation | undefined;
  loading: boolean;
  send: (text: string) => Promise<void>;
  update: (patch: Partial<Conversation>) => Promise<void>;
  acknowledge: () => Promise<void>;
}

/**
 * useConversation — SSR-safe. Reads the local mirror immediately, refreshes
 * from the server, sends through the offline outbox and acknowledges reading.
 */
export function useConversation(id: string | null): UseConversationState {
  const [conversation, setConversation] = useState<Conversation | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);

    void (async () => {
      const cached = await conversationRepository.get(id);
      if (!cancelled && cached) setConversation(cached);
      const fresh = await loadConversation(id);
      if (!cancelled) {
        if (fresh) setConversation(fresh);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const send = useCallback(
    async (text: string) => {
      if (!id || !text.trim()) return;
      await sendMessageUseCase({ conversationId: id, text: text.trim() });
      const updated = await conversationRepository.get(id);
      if (updated) setConversation(updated);
    },
    [id],
  );

  const update = useCallback(
    async (patch: Partial<Conversation>) => {
      if (!id) return;
      const current = await conversationRepository.get(id);
      if (!current) return;
      const next = { ...current, ...patch };
      await conversationRepository.upsert(next);
      setConversation(next);
    },
    [id],
  );

  const acknowledge = useCallback(async () => {
    if (!id) return;
    const updated = await acknowledgeConversation(id);
    if (updated) setConversation(updated);
  }, [id]);

  return { conversation, loading, send, update, acknowledge };
}
