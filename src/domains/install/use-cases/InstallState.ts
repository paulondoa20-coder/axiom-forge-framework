const KEY = "vitala:installed";

/**
 * Use case : mémoriser l'installation pour que l'invite ne revienne jamais,
 * même après un rechargement en onglet navigateur.
 */
export function rememberInstalled(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, "1");
}

export function isInstalledRemembered(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(KEY) === "1";
}

export function forgetInstalled(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}
