/**
 * Domaine `install` — service navigateur pour les notifications système.
 * Aucune UI, aucun état React ici.
 */

export type NotificationPermissionState = "unsupported" | "default" | "granted" | "denied";

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
export async function showNotification(title: string, body: string): Promise<boolean> {
  if (readPermission() !== "granted") return false;
  const options: NotificationOptions = {
    body,
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    tag: "vitala-welcome",
  };
  try {
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.showNotification(title, options);
        return true;
      }
    }
    new Notification(title, options);
    return true;
  } catch {
    return false;
  }
}
