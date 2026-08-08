import {
  askPermission,
  readPermission,
  showNotification,
  type NotificationPermissionState,
} from "../services/NotificationPermissionService";

const WELCOME_KEY = "vitala:welcome-notified";

export const WELCOME_TITLE = "Bienvenue dans VITALA 👋";
export const WELCOME_BODY = "Le quartier est branché. Flash, Radar, Talents — tout est à portée.";

/** Use case : demander la permission puis souhaiter la bienvenue (une seule fois). */
export async function requestNotificationsAndWelcome(): Promise<NotificationPermissionState> {
  const state = await askPermission();
  if (state === "granted") await sendWelcomeOnce();
  return state;
}

/** Use case : notification de bienvenue post-installation, jamais répétée. */
export async function sendWelcomeOnce(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (window.localStorage.getItem(WELCOME_KEY) === "1") return false;
  if (readPermission() !== "granted") return false;
  const sent = await showNotification(WELCOME_TITLE, WELCOME_BODY);
  if (sent) window.localStorage.setItem(WELCOME_KEY, "1");
  return sent;
}

export function hasWelcomed(): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(WELCOME_KEY) === "1";
}
