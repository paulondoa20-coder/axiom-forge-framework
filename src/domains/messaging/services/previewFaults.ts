/**
 * Preview-only fault injection.
 *
 * Lets us force message sends to fail with a configurable rate so the
 * outbox retry (auto backoff) and the manual "Réessayer" button can be
 * verified by hand. Never active in production builds.
 */
const KEY = "vitala.preview.sendFailureRate";

export const FAULT_INJECTION_ENABLED = import.meta.env.DEV;

/** Failure rate between 0 (never) and 1 (always). */
export function getSendFailureRate(): number {
  if (!FAULT_INJECTION_ENABLED || typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(KEY);
  const value = raw === null ? 0 : Number(raw);
  return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;
}

export function setSendFailureRate(rate: number): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, String(Math.min(1, Math.max(0, rate))));
}

export class InjectedFaultError extends Error {
  constructor() {
    super("Échec d'envoi simulé (mode preview)");
    this.name = "InjectedFaultError";
  }
}

/** Throws according to the configured rate. No-op outside preview/dev. */
export function maybeInjectSendFailure(): void {
  const rate = getSendFailureRate();
  if (rate > 0 && Math.random() < rate) throw new InjectedFaultError();
}
