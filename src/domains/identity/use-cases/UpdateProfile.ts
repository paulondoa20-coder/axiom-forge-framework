import { profileRepository } from "../repositories/ProfileRepository";
import type { Profile, ProfileUpdateInput } from "../entities/Profile";

/** Use case — patch the signed-in user's profile. */
export async function updateProfile(input: ProfileUpdateInput): Promise<Profile | null> {
  return profileRepository.updateMe(input);
}
