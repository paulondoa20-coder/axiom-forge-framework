import { Link } from "@tanstack/react-router";
import { Eye, MessageCircle, CheckCircle2, Bell } from "lucide-react";
import { useNotifications } from "@/domains/notification";
import { CONTEXT_META } from "@/domains/notification/entities/Notification";

const CONTEXT_ICON = {
  scan: Eye,
  message: MessageCircle,
  trust: CheckCircle2,
  flash: Bell,
  radar: Bell,
} as const;

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `il y a ${h} h`;
  const d = Math.floor(h / 24);
  return `il y a ${d} j`;
}

export function RecentActivity() {
  const { notifications } = useNotifications();
  const recent = notifications.slice(0, 4);

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-medium text-muted-foreground">Ton activité récente</h2>
        <Link to="/notifications" className="text-[11px] text-muted-foreground hover:text-foreground">
          Tout voir
        </Link>
      </div>
      <div className="glass-surface overflow-hidden rounded-2xl">
        {recent.length === 0 && (
          <div className="px-3 py-6 text-center text-xs text-muted-foreground">
            Aucune activité récente.
          </div>
        )}
        {recent.map((n, i) => {
          const meta = CONTEXT_META[n.context];
          const Icon = CONTEXT_ICON[n.context] ?? Bell;
          const to = n.actionUrl ?? `/${n.context === "message" ? "messages" : n.context}`;
          return (
            <Link
              key={n.id}
              to={to}
              className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-white/5"
              style={
                i < recent.length - 1
                  ? { borderBottom: "1px solid var(--glass-border)" }
                  : undefined
              }
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                style={{
                  background: `color-mix(in oklch, ${meta.color} 14%, transparent)`,
                  color: meta.color,
                }}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm leading-snug text-foreground/90">{n.title}</p>
                <p className="text-[11px] text-muted-foreground">{timeAgo(n.timestamp)}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
