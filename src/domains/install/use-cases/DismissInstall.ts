const KEY = "vitala:install-dismissed-at";
const SNOOZE_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours

/** Use case : mémoriser le refus pour ne pas harceler l'utilisateur. */
export function dismissInstall(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, String(Date.now()));
}

/** Use case : l'invitation est-elle en pause ? */
export function isInstallSnoozed(): boolean {
  if (typeof window === "undefined") return true;
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return false;
  return Date.now() - Number(raw) < SNOOZE_MS;
}
