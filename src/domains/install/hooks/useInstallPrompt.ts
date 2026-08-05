import { useCallback, useEffect, useState } from "react";
import {
  detectPlatform,
  hasNativePrompt,
  isStandalone,
  startInstallListener,
  subscribe,
} from "../services/InstallPromptService";
import type { InstallState } from "../entities/InstallPlatform";
import { promptInstall, type PromptInstallResult } from "../use-cases/PromptInstall";
import { dismissInstall, isInstallSnoozed } from "../use-cases/DismissInstall";

const SSR_STATE: InstallState = { platform: "unknown", status: "unsupported", canPrompt: false };

function readState(): InstallState {
  const platform = detectPlatform();
  if (isStandalone()) return { platform, status: "installed", canPrompt: false };
  if (hasNativePrompt()) return { platform, status: "prompt-ready", canPrompt: true };
  if (platform === "ios") return { platform, status: "manual", canPrompt: false };
  return { platform, status: "unsupported", canPrompt: false };
}

/**
 * Binding React → use cases d'installation.
 * SSR-safe : l'état réel n'est lu qu'après hydratation.
 */
export function useInstallPrompt() {
  const [state, setState] = useState<InstallState>(SSR_STATE);
  const [snoozed, setSnoozed] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    startInstallListener();
    setState(readState());
    setSnoozed(isInstallSnoozed());
    setReady(true);
    const unsubscribe = subscribe(() => setState(readState()));
    return unsubscribe;
  }, []);

  const install = useCallback(async (): Promise<PromptInstallResult> => {
    const result = await promptInstall();
    if (result === "accepted") setState(readState());
    return result;
  }, []);

  const dismiss = useCallback(() => {
    dismissInstall();
    setSnoozed(true);
  }, []);

  const shouldInvite =
    ready && !snoozed && (state.status === "prompt-ready" || state.status === "manual");

  return { ...state, ready, snoozed, shouldInvite, install, dismiss };
}
