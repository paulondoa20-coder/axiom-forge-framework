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
    <section className="space-y-4">
      <header className="flex flex-col items-center gap-1.5 text-center px-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Parcours express
        </span>
        <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground/95">
          Démarre en 3 temps
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Comprends, choisis, lance.
        </p>
      </header>

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
              className="glass-surface lift-on-hover group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl p-5 text-center active:scale-[0.98]"
              style={{ ["--shadow-color" as never]: s.color }}
            >
              <span
                className="pointer-events-none absolute -top-16 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
                style={{ background: s.gradient }}
              />
              <span
                className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(90deg, transparent, ${s.color}, transparent)`,
                }}
              />

              <span
                className="relative text-[10px] font-bold tracking-[0.2em]"
                style={{ color: s.color }}
              >
                {s.n} · {s.label.toUpperCase()}
              </span>

              <div
                className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                style={{
                  background: `color-mix(in oklch, ${s.color} 18%, transparent)`,
                  color: s.color,
                  boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${s.color} 32%, transparent)`,
                }}
              >
                <Icon className="h-6 w-6" strokeWidth={2.2} />
              </div>

              <div className="relative flex min-w-0 flex-col items-center gap-1">
                <h3 className="text-[15px] font-semibold leading-snug tracking-tight text-foreground/95">
                  {s.title}
                </h3>
                <p className="text-[12px] leading-relaxed text-muted-foreground">
                  {s.desc}
                </p>
              </div>

              <div className="relative mt-auto flex flex-col items-center gap-2 pt-1">
                <span
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                  style={{ color: s.color }}
                >
                  {s.cta}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
                </span>
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground"
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
