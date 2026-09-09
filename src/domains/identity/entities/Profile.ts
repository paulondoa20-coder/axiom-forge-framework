/**
 * Profile — projection of `public.profiles`.
 * Pure DTO: zero dependency on Supabase, Dexie or React.
 */
export interface Profile {
  id: string;
  displayName: string | null;
  handle: string | null;
  headline: string | null;
  avatarUrl: string | null;
  bio: string | null;
  neighborhood: string | null;
  city: string | null;
  country: string | null;
  icvScore: number;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ProfileUpdateInput {
  displayName?: string | null;
  handle?: string | null;
  headline?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  country?: string | null;
}
