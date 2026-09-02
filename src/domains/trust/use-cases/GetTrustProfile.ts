import { trustRepository } from "../repositories/TrustRepository";
import type { TrustProfile } from "../entities/TrustProfile";

/** Use case — fetch one trust profile (defaults to the current user's). */
export async function getTrustProfile(id?: string): Promise<TrustProfile> {
  return trustRepository.get(id);
}

/** Use case — list known trust profiles. */
export async function listTrustProfiles(): Promise<TrustProfile[]> {
  return trustRepository.list();
}
