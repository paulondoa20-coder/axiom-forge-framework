import { Wrench, Megaphone, Zap, MapPin, ArrowUpRight } from "lucide-react";

const suggestions = [
  { label: "Trouver un électricien proche", icon: Wrench, color: "var(--scan)" },
  { label: "Publier une demande urgente", icon: Megaphone, color: "var(--radar)" },
  { label: "Voir les ventes flash disponibles", icon: Zap, color: "var(--flash)" },
  { label: "Découvrir des lieux vérifiés", icon: MapPin, color: "var(--trust)" },
];

export function SmartSuggestions() {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-medium text-muted-foreground">Suggestions pour vous</h2>
        <span className="text-[11px] text-muted-foreground">contextuel</span>
      </div>
      <div className="space-y-2">
        {suggestions.map((s, i) => {
          const Icon = s.icon;
          return (
            <button
              key={i}
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
              <span className="flex-1 truncate text-sm text-foreground/90">{s.label}</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
          );
        })}
      </div>
    </section>
  );
}
