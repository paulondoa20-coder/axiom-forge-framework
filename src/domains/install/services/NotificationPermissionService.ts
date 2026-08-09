/**
 * Domaine `install` — service navigateur pour les notifications système.
 * Aucune UI, aucun état React ici.
 */

export type NotificationPermissionState = "unsupported" | "default" | "granted" | "denied";

export interface ShowNotificationOptions {
  /** Route de destination au clic (configurable). */
  url?: string;
  tag?: string;
}

export function readPermission(): NotificationPermissionState {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  return Notification.permission as NotificationPermissionState;
}

export async function askPermission(): Promise<NotificationPermissionState> {
  if (readPermission() === "unsupported") return "unsupported";
  try {
    const result = await Notification.requestPermission();
    return result as NotificationPermissionState;
  } catch {
    return "denied";
  }
}

/** Affiche une notification via le service worker si dispo, sinon en direct. */
export async function showNotification(
  title: string,
  body: string,
  opts: ShowNotificationOptions = {},
): Promise<boolean> {
  if (readPermission() !== "granted") return false;
  const url = opts.url ?? "/";
  const options: NotificationOptions = {
    body,
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    tag: opts.tag ?? "vitala-welcome",
    data: { url },
  };
  try {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.showNotification(title, options);
        return true;
      }
    }
    const notification = new Notification(title, options);
    notification.onclick = () => {
      try {
        window.focus();
        if (window.location.pathname !== url) window.location.assign(url);
      } finally {
        notification.close();
      }
    };
    return true;
  } catch {
    return false;
  }
}
