import type { DeviceKind, InstallPlatform, Orientation } from "../entities/InstallPlatform";

/**
 * Domaine `install` — service navigateur.
 * Seul endroit qui touche aux API du navigateur (beforeinstallprompt,
 * matchMedia, navigator). Client-only : chaque fonction est SSR-safe.
 */

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type Listener = () => void;

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let installed = false;
let started = false;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((l) => l());
}

export function detectPlatform(): InstallPlatform {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent || "";
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (/Macintosh/.test(ua) && typeof document !== "undefined" && "ontouchend" in document);
  if (isIOS) return "ios";
  if (/Android/i.test(ua)) return "android";
  if (/Mobi/i.test(ua)) return "unknown";
  return "desktop";
}

export function detectDeviceKind(): DeviceKind {
  if (typeof window === "undefined") return "desktop";
  const ua = navigator.userAgent || "";
  const touch = (navigator.maxTouchPoints ?? 0) > 1;
  const shortest = Math.min(window.innerWidth, window.innerHeight);
  if (/iPad/.test(ua) || (/Macintosh/.test(ua) && touch)) return "tablet";
  if (/Android/.test(ua) && !/Mobile/.test(ua)) return "tablet";
  if (/iPhone|iPod/.test(ua) || /Mobi/i.test(ua)) return "phone";
  if (touch && shortest >= 600 && shortest < 900) return "tablet";
  return "desktop";
}

export function detectOrientation(): Orientation {
  if (typeof window === "undefined") return "portrait";
  return window.innerWidth > window.innerHeight ? "landscape" : "portrait";
}

export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const displayModes = ["standalone", "fullscreen", "minimal-ui"];
  const matched = displayModes.some((m) => window.matchMedia(`(display-mode: ${m})`).matches);
  const iosStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
  return matched || iosStandalone || installed;
}

export function hasNativePrompt(): boolean {
  return deferredPrompt !== null;
}

/** L'app est-elle listée comme installée par le navigateur (Chromium) ? */
export async function queryRelatedApps(): Promise<boolean> {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as unknown as { getInstalledRelatedApps?: () => Promise<unknown[]> };
  if (typeof nav.getInstalledRelatedApps !== "function") return false;
  try {
    const apps = await nav.getInstalledRelatedApps();
    return Array.isArray(apps) && apps.length > 0;
  } catch {
    return false;
  }
}

/** Démarre l'écoute des évènements d'installation. Idempotent, client-only. */
export function startInstallListener(): void {
  if (typeof window === "undefined" || started) return;
  started = true;

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event as BeforeInstallPromptEvent;
    emit();
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    installed = true;
    emit();
  });

  const media = window.matchMedia("(display-mode: standalone)");
  media.addEventListener?.("change", emit);
  window.addEventListener("resize", emit);
  window.addEventListener("orientationchange", emit);
}

/** Mémorise en RAM que l'app est installée (source: persistance ou API). */
export function markInstalledInMemory(): void {
  if (installed) return;
  installed = true;
  deferredPrompt = null;
  emit();
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Déclenche le prompt natif. Retourne `false` si indisponible ou refusé. */
export async function triggerNativePrompt(): Promise<boolean> {
  if (!deferredPrompt) return false;
  const event = deferredPrompt;
  await event.prompt();
  const { outcome } = await event.userChoice;
  deferredPrompt = null;
  emit();
  return outcome === "accepted";
}
