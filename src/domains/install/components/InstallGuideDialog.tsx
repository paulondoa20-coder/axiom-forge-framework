import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  MANUAL_STEPS,
  PLATFORM_LABEL,
  DEVICE_LABEL,
  contextHint,
  type DeviceKind,
  type InstallPlatform,
  type Orientation,
} from "../entities/InstallPlatform";
import { Share, MoreVertical, MonitorDown, Smartphone, Tablet, Monitor, RotateCcw } from "lucide-react";

const ICONS: Record<InstallPlatform, typeof Share> = {
  ios: Share,
  android: MoreVertical,
  desktop: MonitorDown,
  unknown: MonitorDown,
};

const DEVICE_ICONS: Record<DeviceKind, typeof Share> = {
  phone: Smartphone,
  tablet: Tablet,
  desktop: Monitor,
};

/** UI présentationnelle : étapes d'installation manuelle, contextualisées. */
export function InstallGuideDialog({
  open,
  onOpenChange,
  platform,
  deviceKind = "phone",
  orientation = "portrait",
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  platform: InstallPlatform;
  deviceKind?: DeviceKind;
  orientation?: Orientation;
}) {
  const Icon = ICONS[platform];
  const DeviceIcon = DEVICE_ICONS[deviceKind];
  const hint = contextHint(platform, deviceKind, orientation);
  const isLandscapePhone = platform === "ios" && deviceKind === "phone" && orientation === "landscape";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-surface max-h-[85vh] max-w-sm overflow-y-auto rounded-3xl border-0 p-5">
        <DialogHeader className="text-left">
          <DialogTitle className="text-base font-semibold">
            Poser VITALA sur ton écran
          </DialogTitle>
          <DialogDescription className="text-[12px]">
            {PLATFORM_LABEL[platform]} — 3 gestes, 10 secondes.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-foreground/80">
            <DeviceIcon className="h-3.5 w-3.5" />
            {DEVICE_LABEL[deviceKind]}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-foreground/80">
            <RotateCcw className="h-3.5 w-3.5" />
            {orientation === "portrait" ? "Portrait" : "Paysage"}
          </span>
        </div>

        <p className="mt-2 rounded-2xl px-3 py-2 text-[12px] leading-snug"
          style={{
            background: "color-mix(in oklch, var(--primary) 12%, transparent)",
            color: "var(--primary)",
          }}
        >
          Où regarder : {hint}
        </p>

        <ol className="mt-2 flex flex-col gap-2.5">
          {MANUAL_STEPS[platform].map((step, i) => (
            <li key={step} className="flex items-start gap-3">
              <span
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                style={{
                  background: "color-mix(in oklch, var(--primary) 20%, transparent)",
                  color: "var(--primary)",
                }}
              >
                {i + 1}
              </span>
              <span className="text-[13px] leading-relaxed text-foreground/85">{step}</span>
            </li>
          ))}
        </ol>

        {isLandscapePhone && (
          <p className="mt-3 rounded-2xl bg-white/5 px-3 py-2 text-[11px] leading-snug text-muted-foreground">
            Astuce : remets le téléphone à la verticale, le menu Partager est plus facile à trouver.
          </p>
        )}

        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-2.5">
          <Icon className="h-4 w-4 shrink-0" style={{ color: "var(--scan)" }} />
          <p className="text-[11px] leading-snug text-muted-foreground">
            Une fois posée, VITALA s'ouvre en plein écran, sans barre de navigateur.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
