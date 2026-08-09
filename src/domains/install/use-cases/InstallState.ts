const KEY = "vitala:installed";
const ID_KEY = "vitala:install-id";

/**
 * Use case : mémoriser l'installation pour que l'invite ne revienne jamais,
 * même après un rechargement en onglet navigateur.
 * Chaque installation reçoit un identifiant : il sert de portée aux actions
 * « une seule fois par installation » (notification de bienvenue, télémétrie).
 */
export function rememberInstalled(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, "1");
  ensureInstallId();
}

export function isInstalledRemembered(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(KEY) === "1";
}

export function forgetInstalled(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  window.localStorage.removeItem(ID_KEY);
}

/** Identifiant stable de l'installation courante (créé au besoin). */
export function ensureInstallId(): string {
  if (typeof window === "undefined") return "ssr";
  const existing = window.localStorage.getItem(ID_KEY);
  if (existing) return existing;
  let id: string;
  try {
    id = crypto.randomUUID();
  } catch {
    id = `inst_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  }
  window.localStorage.setItem(ID_KEY, id);
  return id;
}

export function getInstallId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ID_KEY);
}
