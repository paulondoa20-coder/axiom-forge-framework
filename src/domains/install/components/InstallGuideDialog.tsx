import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MANUAL_STEPS, PLATFORM_LABEL, type InstallPlatform } from "../entities/InstallPlatform";
import { Share, MoreVertical, MonitorDown } from "lucide-react";

const ICONS: Record<InstallPlatform, typeof Share> = {
  ios: Share,
  android: MoreVertical,
  desktop: MonitorDown,
  unknown: MonitorDown,
};

/** UI présentationnelle : étapes d'installation manuelle par plateforme. */
export function InstallGuideDialog({
  open,
  onOpenChange,
  platform,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  platform: InstallPlatform;
}) {
  const Icon = ICONS[platform];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-surface max-w-sm rounded-3xl border-0 p-5">
        <DialogHeader className="text-left">
          <DialogTitle className="text-base font-semibold">
            Poser VITALA sur ton écran
          </DialogTitle>
          <DialogDescription className="text-[12px]">
            {PLATFORM_LABEL[platform]} — 3 gestes, 10 secondes.
          </DialogDescription>
        </DialogHeader>

        <ol className="mt-1 flex flex-col gap-2.5">
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
