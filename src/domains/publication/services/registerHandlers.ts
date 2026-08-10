import { registerHandler, startAutoSync } from "@/packages/offline";
import { createFlashRemote } from "@/lib/publication.functions";
import { flashRepository } from "../repositories/FlashRepository";

/**
 * Publication outbox handlers. Client-only, idempotent.
 * Conflict policy: server-wins on `id` (the create is deduped server-side).
 */
export interface CreateFlashPayload {
  id: string;
  content: string;
  category: string | null;
  neighborhood: string | null;
  city: string | null;
  image_url: string | null;
}

export function registerPublicationSync() {
  registerHandler<CreateFlashPayload>("publication", "create_flash", async (payload) => {
    await createFlashRemote({ data: payload });
    await flashRepository.markSynced(payload.id);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("vitala:flashes-updated"));
    }
  });

  startAutoSync();
}
