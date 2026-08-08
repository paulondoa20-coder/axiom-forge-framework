import { useCallback, useEffect, useState } from "react";
import {
  detectDeviceKind,
  detectOrientation,
  detectPlatform,
  hasNativePrompt,
  isStandalone,
  markInstalledInMemory,
  queryRelatedApps,
  startInstallListener,
  subscribe,
} from "../services/InstallPromptService";
import type { InstallState } from "../entities/InstallPlatform";
import { promptInstall, type PromptInstallResult } from "../use-cases/PromptInstall";
import { dismissInstall, isInstallSnoozed } from "../use-cases/DismissInstall";
import { isInstalledRemembered, rememberInstalled } from "../use-cases/InstallState";
import { sendWelcomeOnce } from "../use-cases/WelcomeNotification";

const SSR_STATE: InstallState = {
  platform: "unknown",
  deviceKind: "desktop",
  orientation: "portrait",
  status: "unsupported",
  canPrompt: false,
};

function readState(): InstallState {
  const base = {
    platform: detectPlatform(),
    deviceKind: detectDeviceKind(),
    orientation: detectOrientation(),
  };
  if (isStandalone() || isInstalledRemembered())
    return { ...base, status: "installed", canPrompt: false };
  if (hasNativePrompt()) return { ...base, status: "prompt-ready", canPrompt: true };
  if (base.platform === "ios") return { ...base, status: "manual", canPrompt: false };
  return { ...base, status: "unsupported", canPrompt: false };
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

    const unsubscribe = subscribe(() => {
      if (isStandalone()) rememberInstalled();
      setState(readState());
    });

    // Persistance de l'état installé : standalone, appinstalled, ou apps liées.
    if (isStandalone()) rememberInstalled();
    void queryRelatedApps().then((related) => {
      if (!related) return;
      rememberInstalled();
      markInstalledInMemory();
      setState(readState());
    });

    // Bienvenue post-installation, une seule fois (si permission déjà accordée).
    if (isStandalone() || isInstalledRemembered()) void sendWelcomeOnce();

    return unsubscribe;
  }, []);

  const install = useCallback(async (): Promise<PromptInstallResult> => {
    const result = await promptInstall();
    if (result === "accepted") {
      rememberInstalled();
      markInstalledInMemory();
      setState(readState());
    }
    return result;
  }, []);

  const dismiss = useCallback(() => {
    dismissInstall();
    setSnoozed(true);
  }, []);

  const shouldInvite =
    ready &&
    !snoozed &&
    state.status !== "installed" &&
    (state.status === "prompt-ready" || state.status === "manual");

  return { ...state, ready, snoozed, shouldInvite, install, dismiss };
}
