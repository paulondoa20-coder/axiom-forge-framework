/** Barrel public du domaine `install` (PWA / installation mobile). */
export type { InstallPlatform, InstallState, InstallStatus } from "./entities/InstallPlatform";
export { MANUAL_STEPS, PLATFORM_LABEL } from "./entities/InstallPlatform";
export { useInstallPrompt } from "./hooks/useInstallPrompt";
export { promptInstall } from "./use-cases/PromptInstall";
export { dismissInstall, isInstallSnoozed } from "./use-cases/DismissInstall";
export { InstallInvite } from "./components/InstallInvite";
export { InstallGuideDialog } from "./components/InstallGuideDialog";
