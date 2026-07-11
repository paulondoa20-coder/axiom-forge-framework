import { useCallback, useEffect, useState } from "react";
import { getMyProfile } from "../use-cases/GetMyProfile";
import { updateProfile } from "../use-cases/UpdateProfile";
import type { Profile, ProfileUpdateInput } from "../entities/Profile";

interface UseProfileState {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  save: (input: ProfileUpdateInput) => Promise<Profile | null>;
}

/**
 * useProfile — SSR-safe. Fetches the signed-in user's profile from the
 * remote (server fn). Returns null when unauthenticated (401) — the caller
 * decides whether to redirect.
 */
export function useProfile(): UseProfileState {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const p = await getMyProfile();
      setProfile(p);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const save = useCallback(async (input: ProfileUpdateInput) => {
    const p = await updateProfile(input);
    setProfile(p);
    return p;
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { profile, loading, error, refresh, save };
}
