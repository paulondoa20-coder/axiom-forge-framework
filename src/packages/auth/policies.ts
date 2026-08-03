import type { AppRole } from "./roles";

/**
 * Politiques d'autorisation transverses (P2-04).
 * Règles pures, testables, sans dépendance réseau. Les policies RLS restent
 * la barrière ultime ; ceci évite juste des appels serveur inutiles.
 */

export interface Actor {
  userId: string;
  roles: readonly AppRole[];
}

export const policies = {
  canModerate: (actor: Actor) => actor.roles.includes("moderator") || actor.roles.includes("admin"),
  canAdminister: (actor: Actor) => actor.roles.includes("admin"),
  ownsResource: (actor: Actor, ownerId: string | null | undefined) =>
    Boolean(ownerId) && ownerId === actor.userId,
  canEditResource: (actor: Actor, ownerId: string | null | undefined) =>
    policies.ownsResource(actor, ownerId) || policies.canAdminister(actor),
} as const;

export class ForbiddenError extends Error {
  readonly code = "FORBIDDEN";
  constructor(message = "Action non autorisée") {
    super(message);
    this.name = "ForbiddenError";
  }
}
