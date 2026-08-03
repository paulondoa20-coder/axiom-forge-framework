import { createMiddleware } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { satisfies, isAppRole, type AppRole } from "./roles";
import { ForbiddenError } from "./policies";

/**
 * Guard de rôle pour server functions (P2-04).
 *
 * Usage :
 *   createServerFn({ method: "POST" })
 *     .middleware([requireRole("admin")])
 *     .handler(async ({ context }) => { context.roles; context.userId });
 *
 * Le rôle est lu via le client RLS de l'appelant (jamais via service_role),
 * conformément aux AI-Security-Rules : on ne décide pas d'un privilège
 * avec une clé qui contourne RLS.
 */
export function requireRole(required: AppRole) {
  return createMiddleware({ type: "function" })
    .middleware([requireSupabaseAuth])
    .server(async ({ next, context }) => {
      const { data, error } = await context.supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", context.userId);

      if (error) throw new ForbiddenError("Impossible de vérifier les rôles");

      const roles = (data ?? [])
        .map((row) => row.role as unknown)
        .filter(isAppRole) as AppRole[];

      if (!satisfies(roles, required)) {
        throw new ForbiddenError(`Rôle requis : ${required}`);
      }

      return next({ context: { roles } });
    });
}
