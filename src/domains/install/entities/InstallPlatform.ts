/**
 * Domaine `install` — entités.
 * Décrit la plateforme d'installation et l'état du parcours d'installation.
 * Aucun accès DOM ici : uniquement des types et des constantes métier.
 */

export type InstallPlatform = "android" | "ios" | "desktop" | "unknown";

export type InstallStatus =
  | "unsupported" // navigateur sans parcours d'installation
  | "installed" // déjà lancé en mode app (standalone)
  | "prompt-ready" // le navigateur a proposé un prompt natif
  | "manual"; // installation manuelle (iOS / Safari)

export interface InstallState {
  platform: InstallPlatform;
  status: InstallStatus;
  canPrompt: boolean;
}

/** Étapes affichées quand l'installation ne peut pas être automatique. */
export const MANUAL_STEPS: Record<InstallPlatform, string[]> = {
  ios: [
    "Ouvre le menu Partager (le carré avec la flèche).",
    "Choisis « Sur l'écran d'accueil ».",
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
