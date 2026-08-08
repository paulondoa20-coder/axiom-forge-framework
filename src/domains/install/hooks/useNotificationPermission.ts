import { useCallback, useEffect, useState } from "react";
import {
  readPermission,
  type NotificationPermissionState,
} from "../services/NotificationPermissionService";
import { requestNotificationsAndWelcome } from "../use-cases/WelcomeNotification";

/** Binding React → use cases de permission notifications. SSR-safe. */
export function useNotificationPermission() {
  const [permission, setPermission] = useState<NotificationPermissionState>("unsupported");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPermission(readPermission());
    setReady(true);
  }, []);

  const request = useCallback(async () => {
    const next = await requestNotificationsAndWelcome();
    setPermission(next);
    return next;
  }, []);

  return { permission, ready, request, canAsk: ready && permission === "default" };
}
