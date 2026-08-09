/** Barrel public du domaine `install` (PWA / installation mobile / offline). */
export type {
  InstallPlatform,
  InstallState,
  InstallStatus,
  DeviceKind,
  Orientation,
} from "./entities/InstallPlatform";
export {
  MANUAL_STEPS,
  PLATFORM_LABEL,
  DEVICE_LABEL,
  IOS_SHARE_LOCATION,
  contextHint,
} from "./entities/InstallPlatform";
export { useInstallPrompt } from "./hooks/useInstallPrompt";
export { useNotificationPermission } from "./hooks/useNotificationPermission";
export { promptInstall } from "./use-cases/PromptInstall";
export { dismissInstall, isInstallSnoozed } from "./use-cases/DismissInstall";
export {
  rememberInstalled,
  isInstalledRemembered,
  forgetInstalled,
  ensureInstallId,
  getInstallId,
} from "./use-cases/InstallState";
export {
  requestNotificationsAndWelcome,
  sendWelcomeOnce,
  hasWelcomed,
} from "./use-cases/WelcomeNotification";
export type { NotificationPermissionState } from "./services/NotificationPermissionService";
export { trackInstall } from "./services/InstallTelemetry";
export type { InstallTelemetryEvent } from "./services/InstallTelemetry";
export { registerServiceWorker } from "./services/ServiceWorkerService";
export { InstallInvite } from "./components/InstallInvite";
export { InstallGuideDialog } from "./components/InstallGuideDialog";
