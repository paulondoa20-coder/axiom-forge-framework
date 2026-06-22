import { Link } from "@tanstack/react-router";
import { Eye, MessageCircle, CheckCircle2 } from "lucide-react";

const activities = [
  {
    to: "/scan",
    icon: Eye,
    text: "Tu as consulté 3 services près d'Akwa",
    time: "il y a 2 min",
    color: "var(--scan)",
  },
  {
    to: "/messages",
    icon: MessageCircle,
    text: "Léa a répondu à ta demande Radar",
    time: "il y a 14 min",
    color: "var(--radar)",
  },
  {
    to: "/trust",
    icon: CheckCircle2,
    text: "Le profil de Tom vient d'être vérifié",
    time: "il y a 1 h",
    color: "var(--trust)",
  },
] as const;

export function RecentActivity() {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-medium text-muted-foreground">Ton activité récente</h2>
        <Link to="/notifications" className="text-[11px] text-muted-foreground hover:text-foreground">
          Tout voir
        </Link>
      </div>
      <div className="glass-surface overflow-hidden rounded-2xl">
        {activities.map((a, i) => {
          const Icon = a.icon;
          return (
            <Link
              key={i}
              to={a.to}
              className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-white/5"
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
                <p className="text-sm leading-snug text-foreground/90">{a.text}</p>
                <p className="text-[11px] text-muted-foreground">{a.time}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
