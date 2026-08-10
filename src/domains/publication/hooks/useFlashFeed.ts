import { useCallback, useEffect, useState } from "react";
import { listFeedFlashes, listCachedFlashes } from "../use-cases/ListFeedFlashes";
import { listMyFlashesUseCase, listMyCachedFlashes } from "../use-cases/ListMyFlashes";
import { publishFlash, deleteFlash } from "../use-cases/PublishFlash";
import type { Flash, FlashDraft } from "../entities/Flash";

interface UseFlashFeedState {
  flashes: Flash[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * useFlashFeed — SSR-safe. Paints the Dexie mirror first, then refreshes
 * from the public server function. No Supabase access in components.
 */
export function useFlashFeed(limit = 20): UseFlashFeedState {
  const [flashes, setFlashes] = useState<Flash[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const remote = await listFeedFlashes(limit);
      setFlashes(remote);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    let cancelled = false;
    void listCachedFlashes(limit).then((cached) => {
      if (!cancelled && cached.length > 0) {
        setFlashes(cached);
        setLoading(false);
      }
    });
    void refresh();

    const onUpdate = () => void refresh();
    window.addEventListener("vitala:flashes-updated", onUpdate);
    return () => {
      cancelled = true;
      window.removeEventListener("vitala:flashes-updated", onUpdate);
    };
  }, [limit, refresh]);

  return { flashes, loading, error, refresh };
}

interface UseMyFlashesState {
  flashes: Flash[];
  loading: boolean;
  /** Publish a flash offline-first; returns the optimistic row. */
  publish: (
    draft: FlashDraft,
    author: { id: string; displayName: string; avatarUrl: string | null },
  ) => Promise<Flash>;
  remove: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useMyFlashes(): UseMyFlashesState {
  const [flashes, setFlashes] = useState<Flash[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setFlashes(await listMyFlashesUseCase());
    } catch {
      // Unauthenticated or offline — keep whatever the local mirror holds.
      setFlashes(await listMyCachedFlashes());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void listMyCachedFlashes().then((cached) => {
      if (!cancelled && cached.length > 0) {
        setFlashes(cached);
        setLoading(false);
      }
    });
    void refresh();

    const onUpdate = () => void refresh();
    window.addEventListener("vitala:flashes-updated", onUpdate);
    return () => {
      cancelled = true;
      window.removeEventListener("vitala:flashes-updated", onUpdate);
    };
  }, [refresh]);

  const publish = useCallback<UseMyFlashesState["publish"]>(async (draft, author) => {
    const flash = await publishFlash(draft, author);
    setFlashes((prev) => [flash, ...prev]);
    return flash;
  }, []);

  const remove = useCallback(async (id: string) => {
    setFlashes((prev) => prev.filter((f) => f.id !== id));
    await deleteFlash(id);
  }, []);

  return { flashes, loading, publish, remove, refresh };
}
