/**
 * Rôles applicatifs — miroir de l'enum Postgres `public.app_role`.
 * Source de vérité : la base. Ne jamais stocker un rôle sur `profiles`.
 */
export const APP_ROLES = ["admin", "moderator", "user"] as const;

export type AppRole = (typeof APP_ROLES)[number];

/** Hiérarchie : un rôle englobe les rôles de rang inférieur. */
const RANK: Record<AppRole, number> = {
  user: 0,
  moderator: 1,
  admin: 2,
};

export function isAppRole(value: unknown): value is AppRole {
  return typeof value === "string" && (APP_ROLES as readonly string[]).includes(value);
}

export function satisfies(held: readonly AppRole[], required: AppRole): boolean {
  const needed = RANK[required];
  return held.some((role) => RANK[role] >= needed);
}
