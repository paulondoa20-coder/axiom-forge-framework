import { TRUST_SEED, DEFAULT_TRUST_PROFILE, TRUST_FEEDBACK_SEED } from "../data/seed";
import type { TrustFeedback, TrustProfile } from "../entities/TrustProfile";

/**
 * Repository — trust profiles. Reads are seed-backed for now (no remote
 * trust projection yet); verification submissions go through the outbox-free
 * direct path once the Trust API lands.
 */
export class TrustRepository {
  async list(): Promise<TrustProfile[]> {
    return TRUST_SEED;
  }

  async get(id?: string): Promise<TrustProfile> {
    if (!id) return DEFAULT_TRUST_PROFILE;
    return TRUST_SEED.find((p) => p.id === id) ?? DEFAULT_TRUST_PROFILE;
  }

  async feedbacks(profileId?: string): Promise<TrustFeedback[]> {
    const profile = await this.get(profileId);
    return profile.feedbacks.length ? profile.feedbacks : TRUST_FEEDBACK_SEED;
  }
}

export const trustRepository = new TrustRepository();
