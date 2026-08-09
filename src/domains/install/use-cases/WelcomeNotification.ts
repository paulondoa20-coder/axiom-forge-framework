import {
  askPermission,
  readPermission,
  showNotification,
  type NotificationPermissionState,
} from "../services/NotificationPermissionService";
import { trackInstall } from "../services/InstallTelemetry";
import { ensureInstallId, getInstallId } from "./InstallState";
import { INSTALL } from "@/packages/config";

const WELCOME_PREFIX = "vitala:welcome-notified";

export const WELCOME_TITLE = "Bienvenue dans VITALA 👋";
export const WELCOME_BODY = "Le quartier est branché. Flash, Radar, Talents — tout est à portée.";

function welcomeKey(installId: string) {
  return `${WELCOME_PREFIX}:${installId}`;
}

/** Use case : demander la permission puis souhaiter la bienvenue (une seule fois). */
export async function requestNotificationsAndWelcome(
  url: string = INSTALL.welcomeRoute,
): Promise<NotificationPermissionState> {
  trackInstall("notif_permission_requested", { from: readPermission() });
  const state = await askPermission();
  trackInstall("notif_permission_result", { permission: state, granted: state === "granted" });
  if (state === "granted") await sendWelcomeOnce(url);
  return state;
}

/**
 * Use case : notification de bienvenue post-installation.
 * Envoyée au maximum une fois par installation (portée = install id).
 */
export async function sendWelcomeOnce(url: string = INSTALL.welcomeRoute): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const installId = ensureInstallId();
  if (window.localStorage.getItem(welcomeKey(installId)) === "1") {
    trackInstall("notif_welcome_skipped", { reason: "already_sent", installId });
    return false;
  }
  if (readPermission() !== "granted") {
    trackInstall("notif_welcome_skipped", { reason: "no_permission" });
    return false;
  }
  const sent = await showNotification(WELCOME_TITLE, WELCOME_BODY, { url });
  if (sent) {
    window.localStorage.setItem(welcomeKey(installId), "1");
    trackInstall("notif_welcome_sent", { installId, url });
  } else {
    trackInstall("notif_welcome_failed", { installId, url });
  }
  return sent;
}

export function hasWelcomed(): boolean {
  if (typeof window === "undefined") return true;
  const installId = getInstallId();
  if (!installId) return false;
  return window.localStorage.getItem(welcomeKey(installId)) === "1";
}
