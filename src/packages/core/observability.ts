import { createMiddleware } from "@tanstack/react-start";
import { getRequestHeader, setResponseHeader } from "@tanstack/react-start/server";

/**
 * Observabilité (P2-06) — middleware server-fn.
 * Log structuré : requestId, durée, statut. Aucune donnée personnelle
 * n'est journalisée (redaction PII : on ne log ni payload, ni headers).
 */

const PII_HINTS = /(email|phone|token|password|address|lat|lng|avatar)/i;

/** Retire toute valeur dont la clé ressemble à une donnée personnelle. */
export function redact<T extends Record<string, unknown>>(input: T): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    out[key] = PII_HINTS.test(key) ? "[redacted]" : value;
  }
  return out;
}

function newRequestId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `req_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  }
}

export const observabilityMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const startedAt = Date.now();
    let requestId = newRequestId();
    try {
      requestId = getRequestHeader("x-request-id") || requestId;
    } catch {
      /* hors contexte requête */
    }

    try {
      const result = await next();
      try {
        setResponseHeader("x-request-id", requestId);
      } catch {
        /* noop */
      }
      console.info(
        JSON.stringify({
          level: "info",
          requestId,
          durationMs: Date.now() - startedAt,
          outcome: "ok",
        }),
      );
      return result;
    } catch (error) {
      console.error(
        JSON.stringify({
          level: "error",
          requestId,
          durationMs: Date.now() - startedAt,
          outcome: "error",
          message: error instanceof Error ? error.message : String(error),
        }),
      );
      throw error;
    }
  },
);
