import { LiveDot } from "@/components/ui-kit/TrustBadge";
import { AlertCircle, Sparkles, ShieldCheck } from "lucide-react";

const items = [
  {
    label: "besoins urgents",
    value: 12,
    where: "dans votre zone",
    color: "var(--radar)",
    icon: AlertCircle,
  },
  {
    label: "offres proches",
    value: 5,
    where: "à moins de 2 km",
    color: "var(--flash)",
    icon: Sparkles,
  },
  {
    label: "services vérifiés",
    value: 3,
    where: "disponibles maintenant",
    color: "var(--trust)",
    icon: ShieldCheck,
  },
];

export function LiveStrip() {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-medium text-muted-foreground">En direct autour de vous</h2>
        <LiveDot />
      </div>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((it, i) => {
          const Icon = it.icon;
          return (
            <div
              key={i}
              className="glass-surface flex min-w-[200px] shrink-0 items-center gap-3 rounded-xl p-3"
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
            </div>
          );
        })}
      </div>
    </section>
  );
}
