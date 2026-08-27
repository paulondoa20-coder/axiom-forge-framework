import { useEffect, useState } from "react";
import { getTrustProfile } from "../use-cases/GetTrustProfile";
import { listTrustFeedbacks } from "../use-cases/ListFeedbacks";
import { DEFAULT_TRUST_PROFILE } from "../data/seed";
import type { TrustFeedback, TrustProfile } from "../entities/TrustProfile";

interface UseTrustProfileState {
  profile: TrustProfile;
  feedbacks: TrustFeedback[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useTrustProfile(profileId?: string): UseTrustProfileState {
  const [profile, setProfile] = useState<TrustProfile>(DEFAULT_TRUST_PROFILE);
  const [feedbacks, setFeedbacks] = useState<TrustFeedback[]>(DEFAULT_TRUST_PROFILE.feedbacks);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const p = await getTrustProfile(profileId);
      setProfile(p);
      const fb = await listTrustFeedbacks(p.id);
      setFeedbacks(fb);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, [profileId]);

  return { profile, feedbacks, loading, error, refresh };
}
