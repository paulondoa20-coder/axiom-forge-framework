import { profileRepository } from "../repositories/ProfileRepository";
import type { Profile } from "../entities/Profile";

/** Use case — fetch any user's public profile by id. */
export async function getPublicProfile(userId: string): Promise<Profile | null> {
  return profileRepository.getById(userId);
}
