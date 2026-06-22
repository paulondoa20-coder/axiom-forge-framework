import { Link } from "@tanstack/react-router";
import { Wrench, Megaphone, Zap, MapPin, ArrowUpRight } from "lucide-react";

const suggestions = [
  { to: "/scan", label: "Trouver un électricien près de toi", icon: Wrench, color: "var(--scan)" },
  { to: "/radar", label: "Publier une demande urgente", icon: Megaphone, color: "var(--radar)" },
  { to: "/flash", label: "Voir les flashs dispo maintenant", icon: Zap, color: "var(--flash)" },
  { to: "/trust", label: "Découvrir des lieux vérifiés", icon: MapPin, color: "var(--trust)" },
] as const;

export function SmartSuggestions() {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-medium text-muted-foreground">Suggestions pour toi</h2>
        <span className="text-[11px] text-muted-foreground">selon ton quartier</span>
      </div>
      <div className="space-y-2">
        {suggestions.map((s, i) => {
          const Icon = s.icon;
          return (
            <Link
              key={i}
              to={s.to}
              className="glass-surface group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all hover:-translate-y-0.5 active:scale-[0.99]"
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{
                  background: `color-mix(in oklch, ${s.color} 16%, transparent)`,
                  color: s.color,
                }}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className="min-w-0 flex-1 text-sm leading-snug text-foreground/90">
                {s.label}
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
