import { getMyProfile, getPublicProfile, updateMyProfile } from "@/lib/identity.functions";
import type { Profile, ProfileUpdateInput } from "../entities/Profile";

type Row = {
  id: string;
  display_name: string | null;
  handle: string | null;
  headline: string | null;
  avatar_url: string | null;
  bio: string | null;
  neighborhood: string | null;
  city: string | null;
  country: string | null;
  icv_score: number;
  created_at: string | null;
  updated_at: string | null;
};

function toDto(row: Row | null | undefined): Profile | null {
  if (!row) return null;
  return {
    id: row.id,
    displayName: row.display_name,
    handle: row.handle,
    headline: row.headline,
    avatarUrl: row.avatar_url,
    bio: row.bio,
    neighborhood: row.neighborhood,
    city: row.city,
    country: row.country,
    icvScore: row.icv_score ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toRow(input: ProfileUpdateInput) {
  const out: Record<string, string | null> = {};
  if (input.displayName !== undefined) out.display_name = input.displayName;
  if (input.handle !== undefined) out.handle = input.handle;
  if (input.headline !== undefined) out.headline = input.headline;
  if (input.avatarUrl !== undefined) out.avatar_url = input.avatarUrl;
  if (input.bio !== undefined) out.bio = input.bio;
  if (input.neighborhood !== undefined) out.neighborhood = input.neighborhood;
  if (input.city !== undefined) out.city = input.city;
  if (input.country !== undefined) out.country = input.country;
  return out;
}

export class ProfileRepository {
  async me(): Promise<Profile | null> {
    const row = (await getMyProfile()) as Row | null;
    return toDto(row);
  }

  async getById(id: string): Promise<Profile | null> {
    const row = (await getPublicProfile({ userId: id })) as Row | null;
    return toDto(row);
  }

  async updateMe(input: ProfileUpdateInput): Promise<Profile | null> {
    const row = (await updateMyProfile({ data: toRow(input) })) as Row | null;
    return toDto(row);
  }
}

export const profileRepository = new ProfileRepository();
