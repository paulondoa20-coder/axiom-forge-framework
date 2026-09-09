import { profileRepository } from "../repositories/ProfileRepository";
import type { Profile, ProfileUpdateInput } from "../entities/Profile";

/**
 * UpsertProfile — insert or update the signed-in user's profile.
 * Delegates to updateMe which patches only provided fields.
 */
export async function upsertProfile(input: ProfileUpdateInput): Promise<Profile | null> {
  return profileRepository.updateMe(input);
}
