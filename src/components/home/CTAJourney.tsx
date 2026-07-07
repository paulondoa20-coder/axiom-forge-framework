import { Link } from "@tanstack/react-router";
import { BookOpen, Compass, Rocket, ArrowRight, Clock, Sparkles, Gift } from "lucide-react";
import { track } from "@/lib/analytics";

const steps = [
  {
    n: "01",
    label: "Comprendre",
    title: "C'est quoi VITALA ?",
    desc: "30s pour piger.",
    cta: "Découvrir",
    hint: "Express",
    hintIcon: Clock,
    to: "/scan",
    icon: BookOpen,
    color: "var(--scan)",
    gradient: "var(--gradient-scan)",
  },
  {
    n: "02",
    label: "Choisir",
    title: "Quel hub pour toi ?",
    desc: "Flash, Radar, Scan, Trust.",
    cta: "Tester les hubs",
    hint: "Sans compte",
    hintIcon: Sparkles,
    to: "/radar",
    icon: Compass,
    color: "var(--radar)",
    gradient: "var(--gradient-radar)",
  },
  {
    n: "03",
    label: "Démarrer",
    title: "Lance ton 1er flash",
    desc: "Une phrase, un clic.",
    cta: "Publier",
    hint: "Gratuit",
    hintIcon: Gift,

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
            Comprends, choisis, lance.
          </p>
        </div>

        <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          Parcours express
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {steps.map((s, i) => {
          const Icon = s.icon;
          const Hint = s.hintIcon;
          return (
            <Link
              key={s.n}
              to={s.to}
              onClick={() =>
                track("cta_journey_click", {
                  step: s.n,
                  label: s.label,
                  target: s.to,
                  position: i + 1,
                })
              }
              aria-label={`${s.label} — ${s.cta}`}
              className="glass-surface lift-on-hover group relative flex flex-col gap-3 overflow-hidden rounded-2xl p-4 active:scale-[0.98]"
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
                  className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 motion-reduce:transition-none motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0"
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

              <div className="relative flex items-center justify-between gap-2">
                <span
                  className="inline-flex items-center gap-1.5 text-[12px] font-semibold transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                  style={{ color: s.color }}
                >
                  {s.cta}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
                </span>
                <span
                  className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                  style={{
                    background: `color-mix(in oklch, ${s.color} 10%, transparent)`,
                  }}
                >
                  <Hint className="h-2.5 w-2.5" />
                  {s.hint}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
