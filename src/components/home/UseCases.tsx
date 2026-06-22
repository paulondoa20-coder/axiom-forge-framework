import { Link } from "@tanstack/react-router";
import { Wrench, Music, ShoppingBag, Briefcase, Coffee, Sparkles } from "lucide-react";

const cases = [
  {
    to: "/radar",
    icon: Wrench,
    color: "var(--radar)",
    title: "« Y'a une fuite, j'ai besoin d'un plombier ce soir »",
    sub: "Tu postes sur Radar — un pro vérifié te répond en quelques minutes.",
  },
  {
    to: "/flash",
    icon: Music,
    color: "var(--flash)",
    title: "« Je cherche un guitariste pour un set acoustique »",
    sub: "Un Flash et hop, les musicos du coin voient passer ton appel.",
  },
  {
    to: "/scan",
    icon: Coffee,
    color: "var(--scan)",
    title: "« Un coin tranquille pour bosser cet aprèm »",
    sub: "Scan te liste les spots ouverts, calmes et bien notés autour.",
  },
  {
    to: "/talents",
    icon: Briefcase,
    color: "var(--primary)",
    title: "« Je veux apprendre la couture près de chez moi »",
    sub: "Va sur Talents : ateliers, mentors, sessions — tout y est.",
  },
  {
    to: "/creation",
    icon: Sparkles,
    color: "var(--flash)",
    title: "« J'ai une idée, je cherche une équipe »",
    sub: "Creation t'aide à monter ton projet et à trouver les bonnes mains.",
  },
  {
    to: "/scan",
    icon: ShoppingBag,
    color: "var(--trust)",
    title: "« Un bon plan vente flash dans le quartier ? »",
    sub: "Scan + Flash combinés : tu vois les deals avant qu'ils partent.",
  },
] as const;

export function UseCases() {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-medium text-muted-foreground">À quoi ça sert, concrètement</h2>
        <span className="text-[11px] text-muted-foreground">vrais scénarios du quartier</span>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {cases.map((c, i) => {
          const Icon = c.icon;
          return (
            <Link
              key={i}
              to={c.to}
              className="glass-surface group flex items-start gap-3 rounded-2xl p-3 transition-all hover:-translate-y-0.5 active:scale-[0.99]"
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                style={{
                  background: `color-mix(in oklch, ${c.color} 16%, transparent)`,
                  color: c.color,
                  boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${c.color} 28%, transparent)`,
                }}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium leading-snug text-foreground/95">
                  {c.title}
                </p>
                <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{c.sub}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
