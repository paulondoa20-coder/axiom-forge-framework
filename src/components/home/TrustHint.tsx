import { ShieldCheck, BadgeCheck, Eye } from "lucide-react";

const points = [
  { icon: ShieldCheck, label: "Plateforme sécurisée" },
  { icon: BadgeCheck, label: "Profils vérifiés" },
  { icon: Eye, label: "Échanges transparents" },
];

export function TrustHint() {
  return (
    <section
      className="glass-surface relative overflow-hidden rounded-2xl px-4 py-3"
      style={{ boxShadow: "0 0 28px -14px var(--trust)" }}
    >
      <div
        className="pointer-events-none absolute -left-10 -top-10 h-28 w-28 rounded-full opacity-25 blur-2xl"
        style={{ background: "var(--gradient-trust)" }}
      />
      <div className="relative grid grid-cols-1 gap-2 sm:grid-cols-3">
        {points.map((p, i) => {
          const Icon = p.icon;
          return (
            <div key={i} className="flex min-w-0 items-center gap-2">
              <Icon className="h-4 w-4 shrink-0" style={{ color: "var(--trust)" }} />
              <span className="text-[12px] leading-snug text-foreground/85">{p.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
