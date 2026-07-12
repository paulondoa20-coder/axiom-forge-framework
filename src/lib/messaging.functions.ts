import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Messaging server functions — offline-first send path.
 *
 * Idempotency contract: (conversation_id, client_message_id) is UNIQUE on
 * `public.messages`. The outbox can safely replay `sendMessage` after a
 * failed sync; conflicting inserts are absorbed as no-ops.
 */

const sendSchema = z
  .object({
    conversation_id: z.string().uuid(),
    client_message_id: z.string().uuid(),
    content: z.string().min(1).max(4000),
  })
  .strict();

export const sendMessageRemote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => sendSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Idempotent read first — if the client_message_id already landed, return it.
    const existing = await supabase
      .from("messages")
      .select("id, status, created_at")
      .eq("conversation_id", data.conversation_id)
      .eq("client_message_id", data.client_message_id)
      .maybeSingle();
    if (existing.error) throw new Error(existing.error.message);
    if (existing.data) {
      return { success: true, data: { message_id: existing.data.id, deduped: true } };
    }

    const { data: row, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: data.conversation_id,
        client_message_id: data.client_message_id,
        sender_id: userId,
        content: data.content,
        status: "SENT",
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { success: true, data: { message_id: row.id, deduped: false } };
  });
