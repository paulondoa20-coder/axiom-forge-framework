import { ReactNode } from "react";
import { LiveDot } from "@/components/ui-kit/TrustBadge";

export function HubHeader({
  eyebrow,
  title,
  description,
  color,
  icon,
  live,
}: {
  eyebrow: string;
  title: string;
  description: string;
  color: string;
  icon: ReactNode;
  live?: boolean;
}) {
  return (
    <header className="relative space-y-3">
      <div
        className="absolute -left-6 -top-10 h-40 w-40 rounded-full opacity-40 blur-3xl"
        style={{ background: color }}
      />
      <div className="relative flex items-center gap-2">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-2xl"
          style={{
            background: `color-mix(in oklch, ${color} 18%, transparent)`,
            boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${color} 35%, transparent), 0 0 24px -8px ${color}`,
            color,
          }}
        >
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color }}>
            {eyebrow}
          </p>
          <h1 className="text-2xl font-semibold leading-tight tracking-tight">{title}</h1>
        </div>
        {live && <LiveDot />}
      </div>
      <p className="relative max-w-xs text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </header>
  );
}
