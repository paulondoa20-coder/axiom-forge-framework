import { trustRepository } from "../repositories/TrustRepository";
import type { TrustFeedback } from "../entities/TrustProfile";

/** Use case — list feedbacks attached to a trust profile. */
export async function listTrustFeedbacks(profileId?: string): Promise<TrustFeedback[]> {
  return trustRepository.feedbacks(profileId);
}
