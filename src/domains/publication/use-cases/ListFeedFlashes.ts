import { flashRepository } from "../repositories/FlashRepository";
import type { Flash } from "../entities/Flash";

/** Use case — public neighbourhood feed (cache first, then network). */
export async function listFeedFlashes(limit = 20): Promise<Flash[]> {
  return flashRepository.feed(limit);
}

/** Use case — instant local read while the network call is in flight. */
export async function listCachedFlashes(limit = 20): Promise<Flash[]> {
  return flashRepository.cached({ limit });
}
