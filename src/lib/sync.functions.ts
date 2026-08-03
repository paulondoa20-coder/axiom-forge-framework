import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { LIMITS } from "@/packages/config";

/**
 * Endpoints de synchronisation offline (P2-02).
 *
 * Contrat :
 * - `syncPush` : idempotent par `(device_id, client_op_id)` — rejouer un lot
 *   ne crée jamais de doublon (upsert sur la contrainte unique).
 * - `syncPull` : renvoie les opérations serveur depuis un curseur temporel.
 * - `syncAck`  : marque les opérations comme appliquées côté client.
 *
 * Ici on persiste la file d'opérations ; l'application métier réelle est
 * réalisée par les handlers de domaine (P4-01).
 */

const opSchema = z.object({
  client_op_id: z.string().min(1).max(120),
  entity_type: z.string().min(1).max(64),
  entity_id: z.string().max(120).nullish(),
  action: z.enum(["create", "update", "delete"]),
  payload: z.record(z.string(), z.unknown()).default({}),
});

const pushSchema = z
  .object({
    device_id: z.string().min(1).max(120),
    operations: z.array(opSchema).min(1).max(LIMITS.syncPushBatchMax),
  })
  .strict();

const pullSchema = z
  .object({
    device_id: z.string().min(1).max(120),
    entity_type: z.string().min(1).max(64).optional(),
    since: z.string().datetime().optional(),
    limit: z.number().int().min(1).max(LIMITS.pageSizeMax).default(LIMITS.pageSizeDefault),
  })
  .strict();

const ackSchema = z
  .object({
    operation_ids: z.array(z.string().uuid()).min(1).max(LIMITS.syncPushBatchMax),
  })
  .strict();

export const syncPush = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => pushSchema.parse(input))
  .handler(async ({ data, context }) => {
    const rows = data.operations.map((op) => ({
      user_id: context.userId,
      device_id: data.device_id,
      client_op_id: op.client_op_id,
      entity_type: op.entity_type,
      entity_id: op.entity_id ?? null,
      action: op.action,
      payload: op.payload as never,
    }));

    const { data: inserted, error } = await context.supabase
      .from("sync_operations")
      .upsert(rows, { onConflict: "user_id,device_id,client_op_id", ignoreDuplicates: false })
      .select("id, client_op_id, status");

    if (error) throw new Error(error.message);
    return { accepted: inserted ?? [] };
  });

export const syncPull = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => pullSchema.parse(input))
  .handler(async ({ data, context }) => {
    let query = context.supabase
      .from("sync_operations")
      .select("*")
      .eq("user_id", context.userId)
      .order("updated_at", { ascending: true })
      .limit(data.limit);

    if (data.entity_type) query = query.eq("entity_type", data.entity_type);
    if (data.since) query = query.gt("updated_at", data.since);

    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);

    const cursor = rows?.length ? rows[rows.length - 1]!.updated_at : (data.since ?? null);

    if (cursor) {
      await context.supabase.from("sync_checkpoints").upsert(
        {
          user_id: context.userId,
          device_id: data.device_id,
          entity_type: data.entity_type ?? "*",
          last_synced_at: cursor,
          cursor,
        },
        { onConflict: "user_id,device_id,entity_type" },
      );
    }

    return { operations: rows ?? [], cursor };
  });

export const syncAck = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => ackSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("sync_operations")
      .update({ status: "applied", applied_at: new Date().toISOString() })
      .eq("user_id", context.userId)
      .in("id", data.operation_ids);
    if (error) throw new Error(error.message);
    return { acknowledged: data.operation_ids.length };
  });

const resolveSchema = z
  .object({
    conflict_id: z.string().uuid(),
    strategy: z.enum(["local", "server", "merge"]),
  })
  .strict();

export const resolveSyncConflict = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => resolveSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("sync_conflicts")
      .update({
        strategy: data.strategy,
        resolved_at: new Date().toISOString(),
        resolved_by: context.userId,
      })
      .eq("id", data.conflict_id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { success: true };
  });
