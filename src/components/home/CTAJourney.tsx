import { Link } from "@tanstack/react-router";
import { BookOpen, Compass, Rocket, ArrowRight } from "lucide-react";

const steps = [
  {
    n: "01",
    label: "Comprendre",
    title: "C'est quoi VITALA ?",
    desc: "Découvre comment ça marche en 30 secondes.",
    cta: "Voir les fonctionnalités",
    to: "/scan",
    icon: BookOpen,
    color: "var(--scan)",
    gradient: "var(--gradient-scan)",
  },
  {
    n: "02",
    label: "Choisir",
    title: "Quel hub te correspond ?",
    desc: "Flash, Radar, Trust… on te guide vers le bon.",
    cta: "Explorer les hubs",
    to: "/radar",
    icon: Compass,
    color: "var(--radar)",
    gradient: "var(--gradient-radar)",
  },
  {
    n: "03",
    label: "Démarrer",
    title: "Lance ton premier flash",
    desc: "Une phrase, un clic — la communauté répond.",
    cta: "Publier maintenant",
    to: "/flash",
    icon: Rocket,
    color: "var(--flash)",
    gradient: "var(--gradient-flash)",
  },
] as const;

export function CTAJourney() {
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2 px-1">
        <div className="min-w-0">
          <h2 className="text-base font-semibold tracking-tight text-foreground/95">
            Démarre en 3 temps
          </h2>
          <p className="text-[11px] text-muted-foreground">
            Comprendre, choisir, commencer — t'es chez toi.
          </p>
        </div>
        <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          Parcours express
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.n}
              to={s.to}
              className="glass-surface group relative flex flex-col gap-3 overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_-12px_var(--shadow-color,oklch(0_0_0/0.5))] active:scale-[0.98]"
              style={{ ["--shadow-color" as never]: s.color }}
            >
              <span
                className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-25 blur-2xl transition-opacity duration-500 group-hover:opacity-70"
                style={{ background: s.gradient }}
              />
              <span
                className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(90deg, transparent, ${s.color}, transparent)`,
                }}
              />

              <div className="relative flex items-center justify-between">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{
                    background: `color-mix(in oklch, ${s.color} 18%, transparent)`,
                    color: s.color,
                    boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${s.color} 30%, transparent)`,
                  }}
                >
                  <Icon className="h-5 w-5" strokeWidth={2.2} />
                </div>
                <span
                  className="text-[10px] font-bold tracking-[0.18em]"
                  style={{ color: s.color }}
                >
                  {s.n} · {s.label}
                </span>
              </div>

              <div className="relative min-w-0 flex-1 space-y-1">
                <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-foreground/95">
                  {s.title}
                </h3>
                <p className="text-[12px] leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>

              <div
                className="relative inline-flex items-center gap-1.5 text-[12px] font-semibold transition-transform duration-300 group-hover:translate-x-0.5"
                style={{ color: s.color }}
              >
                {s.cta}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
