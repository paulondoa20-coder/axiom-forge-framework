import { track } from "@/packages/shared/analytics";

/**
 * Domaine `install` — télémétrie (P: debug & amélioration continue).
 * Un seul endroit qui nomme les évènements d'installation et de permissions.
 * Aucune donnée personnelle : uniquement des états et des résultats.
 */

export type InstallTelemetryEvent =
  | "install_state"
  | "install_prompt_shown"
  | "install_prompt_result"
  | "install_dismissed"
  | "install_detected"
  | "notif_permission_requested"
  | "notif_permission_result"
  | "notif_welcome_sent"
  | "notif_welcome_failed"
  | "notif_welcome_skipped";

export function trackInstall(
  event: InstallTelemetryEvent,
  props: Record<string, string | number | boolean | null> = {},
): void {
  track(event, { domain: "install", ...props });
}
