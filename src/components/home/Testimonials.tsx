import { Link } from "@tanstack/react-router";
import { Quote, ArrowUpRight, Star } from "lucide-react";
import { track } from "@/lib/analytics";

const testimonials = [
  {
    name: "Aïcha N.",
    role: "Couturière · Akwa",
    text: "Mes 3 premiers clients en une semaine. Le Radar, c'est sérieux — pas du bavardage.",
    tag: "Radar",
    to: "/radar",
    color: "var(--radar)",
    gradient: "var(--gradient-radar)",
    rating: 5,
  },
  {
    name: "Samir B.",
    role: "Livreur express · Bonapriso",
    text: "Flash m'a sauvé un samedi. Mission postée, prise en 4 minutes chrono. Net.",
    tag: "Flash",
    to: "/flash",
    color: "var(--flash)",
    gradient: "var(--gradient-flash)",
    rating: 5,
  },
  {
    name: "Léa M.",
    role: "Photographe · Bonanjo",
    text: "Profil vérifié, j'ai gagné la confiance direct. Les gens contactent sans hésiter.",
    tag: "Trust",
    to: "/trust",
    color: "var(--trust)",
    gradient: "var(--gradient-trust)",
    rating: 5,
  },
  {
    name: "Yvan K.",
    role: "Étudiant · Deïdo",
    text: "J'ai scanné mon quartier un dimanche, j'ai trouvé un coach foot à 200m. Wahou.",
    tag: "Scan",
    to: "/scan",
    color: "var(--scan)",
    gradient: "var(--gradient-scan)",
    rating: 5,
  },
] as const;

export function Testimonials() {
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-2 px-1">
        <div className="min-w-0">
          <h2 className="text-base font-semibold tracking-tight text-foreground/95">
            Témoignages du quartier
          </h2>
          <p className="text-[11px] text-muted-foreground">
            Des vraies voix, des vraies histoires — pas de filtres.
          </p>
        </div>
        <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
          Voix de la commu
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {testimonials.map((t, i) => (
          <Link
            key={i}
            to={t.to}
            onClick={() =>
              track("testimonial_click", { name: t.name, target: t.to, tag: t.tag })
            }
            className="glass-surface lift-on-hover group relative flex flex-col gap-2 overflow-hidden rounded-2xl p-4 active:scale-[0.98]"
            style={{ ["--shadow-color" as never]: t.color }}
          >
            <span
              className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-20 blur-2xl transition-opacity duration-500 group-hover:opacity-50"
              style={{ background: t.gradient }}
            />
            <span
              className="pointer-events-none absolute left-0 top-0 h-full w-[3px]"
              style={{ background: t.gradient }}
            />

            <div className="relative flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Quote className="h-3.5 w-3.5 shrink-0" style={{ color: t.color }} />
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.18em]"
                  style={{ color: t.color }}
                >
                  {t.tag}
                </span>
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: t.rating }).map((_, k) => (
                  <Star
                    key={k}
                    className="h-3 w-3 fill-current"
                    style={{ color: t.color }}
                  />
                ))}
              </div>
            </div>

            <p className="relative text-[13px] italic leading-relaxed text-foreground/90">
              « {t.text} »
            </p>

            <div className="relative mt-1 flex items-center justify-between gap-2">
              <p className="text-[11px] text-muted-foreground min-w-0">
                <span className="font-semibold text-foreground/85">{t.name}</span> ·{" "}
                {t.role}
              </p>
              <span
                className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold transition-transform duration-300 group-hover:translate-x-0.5"
                style={{ color: t.color }}
              >
                Voir {t.tag}
                <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
