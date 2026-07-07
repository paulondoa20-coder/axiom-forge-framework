import { Link } from "@tanstack/react-router";
import { LiveDot } from "@/components/ui-kit/TrustBadge";
import { AlertCircle, Sparkles, ShieldCheck } from "lucide-react";

const items = [
  {
    to: "/radar",
    label: "urgents",
    value: 12,
    where: "dans ta zone",
    color: "var(--radar)",
    icon: AlertCircle,
  },
  {
    to: "/flash",
    label: "offres proches",
    value: 5,
    where: "< 2 km",
    color: "var(--flash)",
    icon: Sparkles,
  },
  {
    to: "/trust",
    label: "vérifiés",
    value: 3,
    where: "dispo",
    color: "var(--trust)",
    icon: ShieldCheck,
  },

] as const;

export function LiveStrip() {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-medium text-muted-foreground">En direct autour de toi</h2>
        <LiveDot />
      </div>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((it, i) => {
          const Icon = it.icon;
          return (
            <Link
              key={i}
              to={it.to}
              className="glass-surface flex min-w-[210px] shrink-0 items-center gap-3 rounded-xl p-3 transition-all hover:-translate-y-0.5 active:scale-[0.99]"
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{
                  background: `color-mix(in oklch, ${it.color} 16%, transparent)`,
                  color: it.color,
                  boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${it.color} 28%, transparent)`,
                }}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-tight">
                  <span style={{ color: it.color }}>{it.value}</span>{" "}
                  <span className="text-foreground/90">{it.label}</span>
                </p>
                <p className="text-[11px] text-muted-foreground">{it.where}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
