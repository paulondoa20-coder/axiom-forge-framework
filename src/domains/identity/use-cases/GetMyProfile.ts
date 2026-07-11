import { profileRepository } from "../repositories/ProfileRepository";
import type { Profile } from "../entities/Profile";

/** Use case — fetch the signed-in user's profile. */
export async function getMyProfile(): Promise<Profile | null> {
  return profileRepository.me();
}
