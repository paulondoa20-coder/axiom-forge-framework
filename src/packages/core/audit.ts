/**
 * Types du journal d'audit (P2-01) — client-safe.
 * L'écriture réelle vit dans `audit.server.ts` (service_role, RLS bypass).
 */

export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "read_sensitive"
  | "login"
  | "logout"
  | "role_grant"
  | "role_revoke"
  | "verify_submit"
  | "verify_review"
  | "sync_push"
  | "sync_conflict";

export interface AuditEvent {
  actorId: string | null;
  action: AuditAction | (string & {});
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
}
