import { enqueue } from "@/packages/offline";

export interface SubmitVerificationInput {
  type: "email" | "phone" | "identity" | "address";
  evidenceUrl?: string | null;
}

/**
 * Use case — request a trust verification. Queued through the outbox so the
 * request survives an offline session.
 */
export async function submitVerification(input: SubmitVerificationInput): Promise<void> {
  await enqueue({
    domain: "trust",
    operation: "submit_verification",
    payload: { type: input.type, evidence_url: input.evidenceUrl ?? null },
  });
}
