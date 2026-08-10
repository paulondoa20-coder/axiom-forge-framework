import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { LIMITS } from "@/packages/config";

/**
 * Publication (Flash) server functions.
 *
 * Client-safe module: no top-level server-only import. The public feed uses a
 * publishable-key client (anon SELECT policy on `public.flashes`); owner reads
 * and writes go through `requireSupabaseAuth`.
 */

const listSchema = z
  .object({
    limit: z.number().int().min(1).max(LIMITS.pageSizeMax).optional(),
    before: z.string().datetime().optional(),
  })
  .strict();

const createSchema = z
  .object({
    id: z.string().uuid(),
    content: z.string().min(1).max(LIMITS.flashContentMax),
    category: z.string().max(60).nullish(),
    neighborhood: z.string().max(LIMITS.neighborhoodMax).nullish(),
    city: z.string().max(LIMITS.neighborhoodMax).nullish(),
    image_url: z.string().url().nullish(),
  })
  .strict();

const deleteSchema = z.object({ id: z.string().uuid() }).strict();

type FlashRow = Database["public"]["Tables"]["flashes"]["Row"];
type AuthorRow = { id: string; display_name: string | null; avatar_url: string | null };

function publicClient() {
  return createClient<Database>(
    process.env["SUPABASE_URL"]!,
    process.env["SUPABASE_PUBLISHABLE_KEY"]!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

/** Attach author display data — `flashes.user_id` references auth.users, so the join is manual. */
async function withAuthors(
  client: ReturnType<typeof publicClient>,
  rows: FlashRow[],
): Promise<Array<FlashRow & { author: AuthorRow | null }>> {
  const ids = [...new Set(rows.map((r) => r.user_id))];
  if (ids.length === 0) return [];
  const { data } = await client
    .from("profiles")
    .select("id, display_name, avatar_url")
    .in("id", ids);
  const byId = new Map((data ?? []).map((p) => [p.id, p as AuthorRow]));
  return rows.map((r) => ({ ...r, author: byId.get(r.user_id) ?? null }));
}

/** Public feed — readable without a session (SSR/prerender safe). */
export const listPublicFlashes = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => listSchema.parse(input ?? {}))
  .handler(async ({ data }) => {
    const client = publicClient();
    let query = client
      .from("flashes")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(data.limit ?? LIMITS.pageSizeDefault);
    if (data.before) query = query.lt("created_at", data.before);

    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return withAuthors(client, rows ?? []);
  });

/** Owner feed — the signed-in user's own flashes, including drafts/hidden states. */
export const listMyFlashes = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("flashes")
      .select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(LIMITS.pageSizeMax);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

/**
 * Create a flash. The client supplies the `id`, so an outbox replay after a
 * network failure is absorbed as a no-op instead of duplicating the row.
 */
export const createFlashRemote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => createSchema.parse(input))
  .handler(async ({ data, context }) => {
    const existing = await context.supabase
      .from("flashes")
      .select("id")
      .eq("id", data.id)
      .maybeSingle();
    if (existing.error) throw new Error(existing.error.message);
    if (existing.data) return { success: true, deduped: true, id: data.id };

    const { error } = await context.supabase.from("flashes").insert({
      id: data.id,
      user_id: context.userId,
      content: data.content,
      category: data.category ?? null,
      neighborhood: data.neighborhood ?? null,
      city: data.city ?? null,
      image_url: data.image_url ?? null,
    });
    if (error) throw new Error(error.message);

    const { audit } = await import("@/packages/core/audit.server");
    await audit.log(context.userId, "create", "flash", data.id, {
      category: data.category ?? null,
    });

    return { success: true, deduped: false, id: data.id };
  });

export const deleteFlashRemote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => deleteSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("flashes")
      .delete()
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { success: true };
  });
