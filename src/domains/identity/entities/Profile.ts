/**
 * Profile — projection of `public.profiles`.
 * Kept as a pure DTO: zero dependency on Supabase, Dexie or React.
 *
 * NOTE — schema alignment (P3A-01): fields `handle`, `headline`, `country`,
 * `city`, `icv_score` are planned but not yet in the DB. They will be added
 * as nullable columns; the entity is forward-compatible.
 */
export interface Profile {
  id: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  neighborhood: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ProfileUpdateInput {
  displayName?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  neighborhood?: string | null;
}
