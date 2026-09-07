import { useCallback, useEffect, useRef, useState } from "react";
import { conversationRepository } from "../repositories/ConversationRepository";
import {
  loadConversation,
  loadOlderMessages,
  acknowledgeConversation,
  retryFailedMessages,
} from "../use-cases/LoadConversation";
import { sendMessage as sendMessageUseCase } from "../use-cases/SendMessage";
import type { Conversation } from "../entities/Conversation";

const PAGE_SIZE = 30;
const STATUS_POLL_MS = 3_000;

interface UseConversationState {
  conversation: Conversation | undefined;
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  hasFailed: boolean;
  loadOlder: () => Promise<void>;
  retry: () => Promise<void>;
  send: (text: string) => Promise<void>;
  update: (patch: Partial<Conversation>) => Promise<void>;
  acknowledge: () => Promise<void>;
}

/**
 * useConversation — SSR-safe. Local mirror first, remote refresh, realtime
 * updates, progressive history, outbox-backed delivery statuses and retry.
 */
export function useConversation(id: string | null): UseConversationState {
  const [conversation, setConversation] = useState<Conversation | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const mounted = useRef(true);

  const apply = useCallback((next: Conversation | undefined) => {
    if (mounted.current && next) setConversation(next);
  }, []);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    if (!id) return;
    const { conversation: fresh, hasMore: more } = await loadConversation(id, PAGE_SIZE);
    apply(fresh);
    if (mounted.current) setHasMore(more);
    apply(await conversationRepository.syncOutboxStatuses(id));
  }, [id, apply]);

  // Initial load (cache → remote) + realtime subscription.
  useEffect(() => {
    if (!id) return;
    setLoading(true);

    void (async () => {
      const cached = await conversationRepository.get(id);
      apply(cached);
      await refresh();
      if (mounted.current) setLoading(false);
    })();

    const unsubscribe = conversationRepository.subscribe(id, () => {
      void refresh();
    });
    return unsubscribe;
  }, [id, refresh, apply]);

  // Delivery statuses follow the outbox (pending → sent, or failed).
  useEffect(() => {
    if (!id) return;
    const timer = window.setInterval(() => {
      void conversationRepository.syncOutboxStatuses(id).then(apply);
    }, STATUS_POLL_MS);
    return () => window.clearInterval(timer);
  }, [id, apply]);

  const loadOlder = useCallback(async () => {
    if (!id || !conversation || loadingMore) return;
    const oldest = conversation.messages.find((m) => m.createdAt)?.createdAt;
    if (!oldest) return;
    setLoadingMore(true);
    const res = await loadOlderMessages(id, oldest, PAGE_SIZE);
    apply(res.conversation);
    if (mounted.current) {
      setHasMore(res.hasMore);
      setLoadingMore(false);
    }
  }, [id, conversation, loadingMore, apply]);

  const retry = useCallback(async () => {
    if (!id) return;
    apply(await retryFailedMessages(id));
  }, [id, apply]);

  const send = useCallback(
    async (text: string) => {
      if (!id || !text.trim()) return;
      await sendMessageUseCase({ conversationId: id, text: text.trim() });
      apply(await conversationRepository.get(id));
      apply(await conversationRepository.syncOutboxStatuses(id));
    },
    [id, apply],
  );

  const update = useCallback(
    async (patch: Partial<Conversation>) => {
      if (!id) return;
      const current = await conversationRepository.get(id);
      if (!current) return;
      const next = { ...current, ...patch };
      await conversationRepository.upsert(next);
      apply(next);
    },
    [id, apply],
  );

  const acknowledge = useCallback(async () => {
    if (!id) return;
    apply(await acknowledgeConversation(id));
  }, [id, apply]);

  const hasFailed = Boolean(conversation?.messages.some((m) => m.status === "failed"));

  return {
    conversation,
    loading,
    loadingMore,
    hasMore,
    hasFailed,
    loadOlder,
    retry,
    send,
    update,
    acknowledge,
  };
}
