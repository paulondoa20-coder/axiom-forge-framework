/**
 * Templates de notification (P2-03) — stubs client-safe.
 * Un seul endroit pour le wording : push, email et in-app partagent la source.
 */

export type NotificationKind =
  | "message_received"
  | "flash_response"
  | "opportunity_match"
  | "trust_verified"
  | "system";

export interface NotificationPayload {
  kind: NotificationKind;
  actorName?: string;
  subject?: string;
  url?: string;
}

export interface RenderedNotification {
  title: string;
  body: string;
  url: string;
}

const TEMPLATES: Record<NotificationKind, (p: NotificationPayload) => RenderedNotification> = {
  message_received: (p) => ({
    title: "Nouveau message",
    body: `${p.actorName ?? "Quelqu'un"} t'a écrit.`,
    url: p.url ?? "/messages",
  }),
  flash_response: (p) => ({
    title: "Réponse à ton flash",
    body: `${p.actorName ?? "Quelqu'un"} a répondu${p.subject ? ` à « ${p.subject} »` : ""}.`,
    url: p.url ?? "/flash",
  }),
  opportunity_match: (p) => ({
    title: "Ça matche",
    body: p.subject ? `Une mission pour toi : ${p.subject}.` : "Une mission colle à ton profil.",
    url: p.url ?? "/radar",
  }),
  trust_verified: () => ({
    title: "Confiance validée",
    body: "Ta vérification a été acceptée.",
    url: "/trust",
  }),
  system: (p) => ({
    title: p.subject ?? "Vitala",
    body: p.subject ?? "Une mise à jour t'attend.",
    url: p.url ?? "/",
  }),
};

export function renderNotification(payload: NotificationPayload): RenderedNotification {
  return TEMPLATES[payload.kind](payload);
}
