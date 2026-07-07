import { Link } from "@tanstack/react-router";
import { Zap, Radar, ScanSearch, ShieldCheck, ArrowUpRight } from "lucide-react";

const features = [
  {
    to: "/flash",
    label: "Flash",
    color: "var(--flash)",
    gradient: "var(--gradient-flash)",
    icon: Zap,
    pitch: "Publie vite, sois vu.",
    bullets: ["Annonce en 30s", "Visible autour de toi", "Urgences & bons plans"],
  },
  {
    to: "/radar",
    label: "Radar",
    color: "var(--radar)",
    gradient: "var(--gradient-radar)",
    icon: Radar,
    pitch: "Ton besoin, leur réponse.",
    bullets: ["Une phrase suffit", "Bons profils alertés", "Réponse en < 2 min"],
  },
  {
    to: "/scan",
    label: "Scan",
    color: "var(--scan)",
    gradient: "var(--gradient-scan)",
    icon: ScanSearch,
    pitch: "Vois ce qui bouge.",
    bullets: ["Trié par proximité", "Filtres simples", "Carte en direct"],
  },
  {
    to: "/trust",
    label: "Trust",
    color: "var(--trust)",
    gradient: "var(--gradient-trust)",
    icon: ShieldCheck,
    pitch: "Vérifie avant d'y aller.",
    bullets: ["Score de confiance", "Identité vérifiée", "Avis transparents"],
  },

] as const;

export function FeaturesShowcase() {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-medium text-muted-foreground">Ce que VITALA fait pour toi</h2>
        <span className="text-[11px] text-muted-foreground">4 outils, zéro prise de tête</span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <Link
              key={f.to}
              to={f.to}
              className="glass-surface group relative overflow-hidden rounded-2xl p-4 transition-all hover:-translate-y-0.5 active:scale-[0.99]"
            >
              <div
                className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-25 blur-2xl transition-opacity group-hover:opacity-60"
                style={{ background: f.gradient }}
              />
              <div className="relative space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        background: `color-mix(in oklch, ${f.color} 18%, transparent)`,
                        color: f.color,
                        boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${f.color} 30%, transparent)`,
                      }}
                    >
                      <Icon className="h-5 w-5" strokeWidth={2.2} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-base font-semibold tracking-tight">{f.label}</p>
                      <p className="text-[11px] text-muted-foreground">{f.pitch}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
                <ul className="space-y-1.5">
                  {f.bullets.map((b, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2 text-[12px] leading-snug text-foreground/80"
                    >
                      <span
                        className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                        style={{ background: f.color }}
                      />
                      <span className="min-w-0 flex-1">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
