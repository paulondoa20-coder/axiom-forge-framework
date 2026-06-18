import { Eye, MessageCircle, CheckCircle2 } from "lucide-react";

const activities = [
  {
    icon: Eye,
    text: "Vous avez consulté 3 services près de Bastille",
    time: "il y a 2 min",
    color: "var(--scan)",
  },
  {
    icon: MessageCircle,
    text: "Léa a répondu à votre demande Radar",
    time: "il y a 14 min",
    color: "var(--radar)",
  },
  {
    icon: CheckCircle2,
    text: "Profil de Tom vérifié avec succès",
    time: "il y a 1 h",
    color: "var(--trust)",
  },
];

export function RecentActivity() {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-medium text-muted-foreground">Activité récente</h2>
        <button className="text-[11px] text-muted-foreground hover:text-foreground">
          Tout voir
        </button>
      </div>
      <div className="glass-surface overflow-hidden rounded-2xl">
        {activities.map((a, i) => {
          const Icon = a.icon;
          return (
            <div
              key={i}
              className="flex items-center gap-3 px-3 py-2.5"
              style={
                i < activities.length - 1
                  ? { borderBottom: "1px solid var(--glass-border)" }
                  : undefined
              }
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{
                  background: `color-mix(in oklch, ${a.color} 14%, transparent)`,
                  color: a.color,
                }}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-foreground/90">{a.text}</p>
                <p className="text-[11px] text-muted-foreground">{a.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
