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
import { trackInstall } from "../services/InstallTelemetry";

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
    const initial = readState();
    setState(initial);
    setSnoozed(isInstallSnoozed());
    setReady(true);
    trackInstall("install_state", {
      scope: "install",
      status: initial.status,
      platform: initial.platform,
      device: initial.deviceKind,
      standalone: isStandalone(),
    });

    const unsubscribe = subscribe(() => {
      if (isStandalone()) rememberInstalled();
      const next = readState();
      setState(next);
      trackInstall("install_state", { scope: "install", status: next.status, source: "event" });
    });

    // Persistance de l'état installé : standalone, appinstalled, ou apps liées.
    if (isStandalone()) {
      rememberInstalled();
      trackInstall("install_detected", { source: "standalone" });
    }
    void queryRelatedApps().then((related) => {
      if (!related) return;
      rememberInstalled();
      markInstalledInMemory();
      setState(readState());
      trackInstall("install_detected", { source: "related_apps" });
    });

    // Bienvenue post-installation, une seule fois (si permission déjà accordée).
    if (isStandalone() || isInstalledRemembered()) void sendWelcomeOnce();

    return unsubscribe;
  }, []);

  const install = useCallback(async (): Promise<PromptInstallResult> => {
    trackInstall("install_prompt_shown", { native: hasNativePrompt() });
    const result = await promptInstall();
    trackInstall("install_prompt_result", { result, success: result === "accepted" });
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
    trackInstall("install_dismissed", {});
  }, []);

  const shouldInvite =
    ready &&
    !snoozed &&
    state.status !== "installed" &&
    (state.status === "prompt-ready" || state.status === "manual");

  return { ...state, ready, snoozed, shouldInvite, install, dismiss };
}
