/**
 * Package: config (P2-05) — constantes centralisées.
 *
 * Aucune valeur magique en dur ailleurs dans le code : limites, timeouts,
 * feature flags et version d'API vivent ici. Client-safe (aucun secret).
 */

export const API_VERSION = "v1" as const;
export const API_BASE_PATH = `/api/${API_VERSION}` as const;

/** Limites d'entrée partagées (validation Zod côté serveur). */
export const LIMITS = {
  displayNameMax: 80,
  bioMax: 2000,
  neighborhoodMax: 120,
  flashContentMax: 2000,
  messageBodyMax: 4000,
  pageSizeDefault: 20,
  pageSizeMax: 100,
  syncPushBatchMax: 100,
  outboxMaxAttempts: 5,
} as const;

/** Fenêtres temporelles (ms). */
export const TIMINGS = {
  syncIntervalMs: 15_000,
  realtimeRetryMs: 5_000,
  auditFlushMs: 1_000,
} as const;

/** Feature flags — un seul endroit pour activer/désactiver un chantier. */
export const FEATURES = {
  offlineSync: true,
  auditLog: true,
  aiAssistant: true,
  pushNotifications: false,
  emailNotifications: false,
} as const;

export type FeatureFlag = keyof typeof FEATURES;

export function isEnabled(flag: FeatureFlag): boolean {
  return FEATURES[flag];
}
