import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Identity server functions.
 *
 * IMPORTANT — client-safe module. NO top-level import of `client.server`;
 * NO business logic imported from a domain (avoid client-graph leaks).
 * All Supabase access happens inside `.handler()` via the auth-scoped
 * client injected by `requireSupabaseAuth`.
 */

const updateSchema = z
  .object({
    display_name: z.string().min(1).max(80).nullish(),
    handle: z
      .string()
      .min(2)
      .max(40)
      .regex(/^[a-z0-9._-]+$/i)
      .nullish(),
    avatar_url: z.string().url().nullish(),
    headline: z.string().max(160).nullish(),
    bio: z.string().max(2000).nullish(),
    country: z.string().max(80).nullish(),
    city: z.string().max(120).nullish(),
  })
  .strict();

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("profiles")
      .select("*")
      .eq("id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => updateSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: row, error } = await context.supabase
      .from("profiles")
      .update(data)
      .eq("id", context.userId)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });
