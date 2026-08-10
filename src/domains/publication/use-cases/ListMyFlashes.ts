import { flashRepository } from "../repositories/FlashRepository";
import type { Flash } from "../entities/Flash";

/** Use case — the signed-in user's own flashes. */
export async function listMyFlashesUseCase(): Promise<Flash[]> {
  return flashRepository.mine();
}

/** Use case — local mirror of the user's flashes (offline read). */
export async function listMyCachedFlashes(): Promise<Flash[]> {
  return flashRepository.cached({ mineOnly: true });
}
