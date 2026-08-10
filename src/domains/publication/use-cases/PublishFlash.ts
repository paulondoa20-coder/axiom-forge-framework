import { flashRepository } from "../repositories/FlashRepository";
import type { Flash, FlashDraft } from "../entities/Flash";

/**
 * Use case — publish a flash. Offline-first: the row lands in Dexie
 * immediately and the outbox pushes it to the server on the next drain.
 */
export async function publishFlash(
  draft: FlashDraft,
  author: { id: string; displayName: string; avatarUrl: string | null },
): Promise<Flash> {
  return flashRepository.create(draft, author);
}

/** Use case — remove one of the user's own flashes. */
export async function deleteFlash(id: string): Promise<void> {
  return flashRepository.remove(id);
}
