import { getMyProfile, updateMyProfile } from "@/lib/identity.functions";
import type { Profile, ProfileUpdateInput } from "../entities/Profile";

/**
 * Repository — orchestrates remote reads/writes for Profile.
 * Never imported by components (only use-cases go through here).
 */
type Row = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  neighborhood: string | null;
  created_at: string | null;
  updated_at: string | null;
};

function toDto(row: Row | null | undefined): Profile | null {
  if (!row) return null;
  return {
    id: row.id,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    bio: row.bio,
    neighborhood: row.neighborhood,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toRow(input: ProfileUpdateInput) {
  const out: {
    display_name?: string | null;
    avatar_url?: string | null;
    bio?: string | null;
    neighborhood?: string | null;
  } = {};
  if (input.displayName !== undefined) out.display_name = input.displayName;
  if (input.avatarUrl !== undefined) out.avatar_url = input.avatarUrl;
  if (input.bio !== undefined) out.bio = input.bio;
  if (input.neighborhood !== undefined) out.neighborhood = input.neighborhood;
  return out;
}

export class ProfileRepository {
  async me(): Promise<Profile | null> {
    const row = (await getMyProfile()) as Row | null;
    return toDto(row);
  }

  async updateMe(input: ProfileUpdateInput): Promise<Profile | null> {
    const row = (await updateMyProfile({ data: toRow(input) })) as Row | null;
    return toDto(row);
  }
}

export const profileRepository = new ProfileRepository();
