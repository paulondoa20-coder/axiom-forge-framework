import { ShieldCheck } from "lucide-react";

export function TrustBadge({ score }: { score: number }) {
  const tone =
    score >= 85 ? "var(--trust)" : score >= 60 ? "var(--warning)" : "var(--destructive)";
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium"
      style={{
        borderColor: `color-mix(in oklch, ${tone} 40%, transparent)`,
        background: `color-mix(in oklch, ${tone} 12%, transparent)`,
        color: tone,
      }}
    >
      <ShieldCheck className="h-3 w-3" />
      {score}
    </span>
  );
}

export function LiveDot({ label = "Live" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
      <span className="relative flex h-2 w-2">
        <span className="absolute inset-0 rounded-full bg-[var(--live)] animate-pulse-soft" />
        <span className="relative h-2 w-2 rounded-full bg-[var(--live)]" />
      </span>
      {label}
    </span>
  );
}
