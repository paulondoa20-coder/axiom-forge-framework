/**
 * Profile — public/self projection of `public.profiles`.
 * Kept as a pure DTO: zero dependency on Supabase, Dexie or React.
 */
export interface Profile {
  id: string;
  displayName: string | null;
  handle: string | null;
  avatarUrl: string | null;
  headline: string | null;
  bio: string | null;
  country: string | null;
  city: string | null;
  icvScore: number | null;
  createdAt: string | null;
}

export interface ProfileUpdateInput {
  displayName?: string | null;
  handle?: string | null;
  avatarUrl?: string | null;
  headline?: string | null;
  bio?: string | null;
  country?: string | null;
  city?: string | null;
}
