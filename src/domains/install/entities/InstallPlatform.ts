/**
 * Domaine `install` — entités.
 * Décrit la plateforme d'installation et l'état du parcours d'installation.
 * Aucun accès DOM ici : uniquement des types et des constantes métier.
 */

export type InstallPlatform = "android" | "ios" | "desktop" | "unknown";

/** Gabarit d'appareil : change le vocabulaire et les repères visuels du guide. */
export type DeviceKind = "phone" | "tablet" | "desktop";

export type Orientation = "portrait" | "landscape";

export type InstallStatus =
  | "unsupported" // navigateur sans parcours d'installation
  | "installed" // déjà lancé en mode app (standalone) ou installation mémorisée
  | "prompt-ready" // le navigateur a proposé un prompt natif
  | "manual"; // installation manuelle (iOS / Safari)

export interface InstallState {
  platform: InstallPlatform;
  deviceKind: DeviceKind;
  orientation: Orientation;
  status: InstallStatus;
  canPrompt: boolean;
}

/** Position du menu Partager selon l'appareil / l'orientation (guide iOS). */
export const IOS_SHARE_LOCATION: Record<DeviceKind, Record<Orientation, string>> = {
  phone: {
    portrait: "Barre du bas, au centre de Safari.",
    landscape: "Barre du haut, à droite de l'adresse.",
  },
  tablet: {
    portrait: "Barre du haut, à droite de l'adresse.",
    landscape: "Barre du haut, à droite de l'adresse.",
  },
  desktop: {
    portrait: "Barre d'outils de Safari, en haut.",
    landscape: "Barre d'outils de Safari, en haut.",
  },
};

/** Étapes affichées quand l'installation ne peut pas être automatique. */
export const MANUAL_STEPS: Record<InstallPlatform, string[]> = {
  ios: [
    "Ouvre le menu Partager (le carré avec la flèche).",
    "Descends et choisis « Sur l'écran d'accueil ».",
    "Valide avec « Ajouter » — VITALA arrive sur ton écran.",
  ],
  android: [
    "Ouvre le menu ⋮ du navigateur.",
    "Touche « Installer l'application ».",
    "Confirme — VITALA s'installe comme une vraie app.",
  ],
  desktop: [
    "Clique l'icône d'installation dans la barre d'adresse.",
    "Valide « Installer ».",
    "VITALA s'ouvre dans sa propre fenêtre.",
  ],
  unknown: [
    "Ouvre le menu de ton navigateur.",
    "Cherche « Installer » ou « Ajouter à l'écran d'accueil ».",
    "Valide pour poser VITALA sur ton écran.",
  ],
};

export const PLATFORM_LABEL: Record<InstallPlatform, string> = {
  ios: "iPhone / iPad",
  android: "Android",
  desktop: "Ordinateur",
  unknown: "Ton appareil",
};

export const DEVICE_LABEL: Record<DeviceKind, string> = {
  phone: "Téléphone",
  tablet: "Tablette",
  desktop: "Ordinateur",
};

/** Repère contextuel affiché en tête du guide manuel. */
export function contextHint(
  platform: InstallPlatform,
  deviceKind: DeviceKind,
  orientation: Orientation,
): string {
  if (platform === "ios") return IOS_SHARE_LOCATION[deviceKind][orientation];
  if (platform === "android") return "Menu ⋮ en haut à droite du navigateur.";
  return "Icône d'installation dans la barre d'adresse.";
}
