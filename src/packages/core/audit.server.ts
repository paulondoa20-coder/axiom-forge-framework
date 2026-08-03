import type { AuditEvent } from "./audit";

/**
 * Service d'audit (P2-01) — SERVEUR UNIQUEMENT.
 *
 * `audit_logs` n'a aucune policy d'écriture : seuls les chemins serveur
 * (service_role) peuvent journaliser. Un échec d'audit ne doit jamais
 * casser le use-case appelant : on log l'erreur et on continue.
 */
export async function logAudit(event: AuditEvent): Promise<void> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("audit_logs").insert({
      actor_id: event.actorId,
      action: event.action,
      entity_type: event.entityType,
      entity_id: event.entityId ?? null,
      metadata: (event.metadata ?? {}) as never,
    });
    if (error) console.error("[audit] insert failed:", error.message);
  } catch (err) {
    console.error("[audit] unavailable:", err instanceof Error ? err.message : err);
  }
}

/** Sucre : `audit.log(actorId, "update", "profile", id, { fields })`. */
export const audit = {
  log: (
    actorId: string | null,
    action: AuditEvent["action"],
    entityType: string,
    entityId?: string | null,
    metadata?: Record<string, unknown>,
  ) => logAudit({ actorId, action, entityType, entityId, metadata }),
};
