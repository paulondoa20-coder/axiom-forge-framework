import { getMyProfile, updateMyProfile } from "@/lib/identity.functions";
import type { Profile, ProfileUpdateInput } from "../entities/Profile";

/**
 * Repository — orchestrates remote reads/writes for Profile.
 * Never imported by components (only use-cases go through here).
 */
type Row = {
  id: string;
  display_name: string | null;
  handle: string | null;
  avatar_url: string | null;
  headline: string | null;
  bio: string | null;
  country: string | null;
  city: string | null;
  icv_score: number | null;
  created_at: string | null;
};

function toDto(row: Row | null | undefined): Profile | null {
  if (!row) return null;
  return {
    id: row.id,
    displayName: row.display_name,
    handle: row.handle,
    avatarUrl: row.avatar_url,
    headline: row.headline,
    bio: row.bio,
    country: row.country,
    city: row.city,
    icvScore: row.icv_score,
    createdAt: row.created_at,
  };
}

function toRow(input: ProfileUpdateInput): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (input.displayName !== undefined) out.display_name = input.displayName;
  if (input.handle !== undefined) out.handle = input.handle;
  if (input.avatarUrl !== undefined) out.avatar_url = input.avatarUrl;
  if (input.headline !== undefined) out.headline = input.headline;
  if (input.bio !== undefined) out.bio = input.bio;
  if (input.country !== undefined) out.country = input.country;
  if (input.city !== undefined) out.city = input.city;
  return out;
}

export class ProfileRepository {
  async me(): Promise<Profile | null> {
    const row = (await getMyProfile()) as Row | null;
    return toDto(row);
  }

  async updateMe(input: ProfileUpdateInput): Promise<Profile | null> {
    const row = (await updateMyProfile({ data: toRow(input) as never })) as Row | null;
    return toDto(row);
  }
}

export const profileRepository = new ProfileRepository();
