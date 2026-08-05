import { hasNativePrompt, triggerNativePrompt } from "../services/InstallPromptService";

export type PromptInstallResult = "accepted" | "dismissed" | "manual";

/**
 * Use case : proposer l'installation de l'app.
 * Retourne "manual" quand le navigateur (iOS notamment) n'expose pas de prompt
 * natif : l'UI affiche alors les étapes manuelles.
 */
export async function promptInstall(): Promise<PromptInstallResult> {
  if (!hasNativePrompt()) return "manual";
  const accepted = await triggerNativePrompt();
  return accepted ? "accepted" : "dismissed";
}
