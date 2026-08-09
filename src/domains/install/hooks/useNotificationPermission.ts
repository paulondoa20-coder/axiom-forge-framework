import { useCallback, useEffect, useState } from "react";
import {
  readPermission,
  type NotificationPermissionState,
} from "../services/NotificationPermissionService";
import { requestNotificationsAndWelcome } from "../use-cases/WelcomeNotification";
import { trackInstall } from "../services/InstallTelemetry";
import { INSTALL } from "@/packages/config";

/** Binding React → use cases de permission notifications. SSR-safe. */
export function useNotificationPermission(welcomeRoute: string = INSTALL.welcomeRoute) {
  const [permission, setPermission] = useState<NotificationPermissionState>("unsupported");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const current = readPermission();
    setPermission(current);
    setReady(true);
    trackInstall("install_state", { scope: "notifications", permission: current });
  }, []);

  const request = useCallback(async () => {
    const next = await requestNotificationsAndWelcome(welcomeRoute);
    setPermission(next);
    return next;
  }, [welcomeRoute]);

  return { permission, ready, request, canAsk: ready && permission === "default" };
}
