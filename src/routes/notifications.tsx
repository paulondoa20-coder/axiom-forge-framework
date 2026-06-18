import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
  NOTIFICATIONS,
  PRIORITY_META,
  CONTEXT_META,
  type Notification,
  type HubContext,
} from "@/lib/notifications";
import { cn } from "@/lib/utils";
import { Bell, Zap, Radar, ScanSearch, ShieldCheck, MessageCircle, Check, X, ChevronRight, CircleAlert as AlertCircle } from "lucide-react";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — VITALA" },
      { name: "description", content: "Notifications contextuelles et intelligentes sur VITALA." },
    ],
  }),
  component: NotificationsPage,
});

// ─── Icon helpers ────────────────────────────────────────────────────────────

function ContextIcon({ context, size = 14 }: { context: HubContext; size?: number }) {
  const props = { style: { width: size, height: size } };
  if (context === "flash") return <Zap {...props} />;
  if (context === "radar") return <Radar {...props} />;
  if (context === "scan") return <ScanSearch {...props} />;
  if (context === "trust") return <ShieldCheck {...props} />;
  return <MessageCircle {...props} />;
}

function PriorityDot({ priority }: { priority: Notification["priority"] }) {
  const colors: Record<string, string> = {
    urgent: "var(--destructive)",
    important: "var(--live)",
    normal: "transparent",
    info: "transparent",
  };
  const color = colors[priority];
  if (!color || color === "transparent") return null;
  return (
    <span
      className="h-2.5 w-2.5 rounded-full shrink-0"
      style={{ background: color, boxShadow: `0 0 6px ${color}` }}
    />
  );
}

// ─── Context badge ────────────────────────────────────────────────────────────

function ContextBadge({ context, small }: { context: HubContext; small?: boolean }) {
  const meta = CONTEXT_META[context];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        small ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-[11px]",
      )}
      style={{
        background: `color-mix(in oklch, ${meta.color} 16%, transparent)`,
        color: meta.color,
        boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${meta.color} 30%, transparent)`,
      }}
    >
      <ContextIcon context={context} size={small ? 10 : 12} />
      {meta.label}
    </span>
  );
}

// ─── NOTIFICATIONS PAGE ───────────────────────────────────────────────────────

function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | HubContext>("all");
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const FILTERS: Array<{ id: "all" | HubContext; label: string }> = [
    { id: "all", label: "Toutes" },
    { id: "flash", label: "Flash" },
    { id: "radar", label: "Radar" },
    { id: "scan", label: "Scan" },
    { id: "trust", label: "Trust" },
    { id: "message", label: "Messages" },
  ];

  // Filter notifications
  const filtered = useMemo(() => {
    return NOTIFICATIONS.filter((n) => {
      if (dismissed.has(n.id)) return false;
      if (filter === "all") return true;
      return n.context === filter;
    });
  }, [filter, dismissed]);

  // Group by date
  const grouped = useMemo(() => {
    const groups: Record<string, Notification[]> = {
      today: [],
      yesterday: [],
      this_week: [],
    };
    filtered.forEach((n) => {
      groups[n.date]?.push(n);
    });
    return groups;
  }, [filtered]);

  const unreadCount = filtered.filter((n) => !n.read).length;
  const totalUnread = NOTIFICATIONS.filter((n) => !n.read).length;

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set(prev).add(id));
  };

  const handleMarkAllAsRead = () => {
    // In a real app, this would persist. Here it just updates the read state.
    // For demo purposes, we'll just mark visual as read.
  };

  return (
    <AppShell>
      <div className="space-y-5 animate-[fade-up_0.5s_var(--ease-smooth)_both]">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Alertes</p>
            <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
          </div>
          {totalUnread > 0 && (
            <div className="flex flex-col items-end gap-1">
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-semibold"
                style={{
                  background: "var(--live)",
                  color: "#fff",
                  boxShadow: "0 0 12px var(--live)",
                }}
              >
                {totalUnread}
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-[10px] text-muted-foreground underline hover:text-foreground transition"
                >
                  Marquer tout comme lu
                </button>
              )}
            </div>
          )}
        </header>

        {/* Filter chips */}
        <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-2 pb-1">
            {FILTERS.map((f) => {
              const isActive = filter === f.id;
              const meta = f.id !== "all" ? CONTEXT_META[f.id] : null;
              return (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className="shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all"
                  style={
                    isActive
                      ? {
                          background: meta
                            ? `color-mix(in oklch, ${meta.color} 18%, transparent)`
                            : "var(--surface-3)",
                          color: meta ? meta.color : "var(--foreground)",
                          boxShadow: meta
                            ? `inset 0 0 0 1px color-mix(in oklch, ${meta.color} 40%, transparent)`
                            : "inset 0 0 0 1px var(--glass-border)",
                        }
                      : {
                          background: "var(--glass)",
                          color: "var(--muted-foreground)",
                          boxShadow: "inset 0 0 0 1px var(--glass-border)",
                        }
                  }
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notifications list */}
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-6">
            {/* Today */}
            {grouped.today.length > 0 && (
              <NotificationGroup
                title="Aujourd'hui"
                notifications={grouped.today}
                onDismiss={handleDismiss}
              />
            )}

            {/* Yesterday */}
            {grouped.yesterday.length > 0 && (
              <NotificationGroup
                title="Hier"
                notifications={grouped.yesterday}
                onDismiss={handleDismiss}
              />
            )}

            {/* This week */}
            {grouped.this_week.length > 0 && (
              <NotificationGroup
                title="Cette semaine"
                notifications={grouped.this_week}
                onDismiss={handleDismiss}
              />
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}

// ─── Notification group ────────────────────────────────────────────────────────

function NotificationGroup({
  title,
  notifications,
  onDismiss,
}: {
  title: string;
  notifications: Notification[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-[0.1em] text-muted-foreground font-medium px-1">
        {title}
      </p>
      <div className="space-y-2">
        {notifications.map((notif, idx) => (
          <NotificationItem
            key={notif.id}
            notification={notif}
            onDismiss={onDismiss}
            delay={idx * 30}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Notification item ────────────────────────────────────────────────────────

function NotificationItem({
  notification,
  onDismiss,
  delay,
}: {
  notification: Notification;
  onDismiss: (id: string) => void;
  delay?: number;
}) {
  const [showActions, setShowActions] = useState(false);
  const meta = CONTEXT_META[notification.context];
  const priorityMeta = PRIORITY_META[notification.priority];
  const isUnread = !notification.read;

  const animationStyle = delay ? { animationDelay: `${delay}ms` } : undefined;

  return (
    <div
      className="animate-[fade-up_0.4s_var(--ease-smooth)_both]"
      style={animationStyle}
    >
      <button
        onClick={() => setShowActions((v) => !v)}
        className={cn(
          "glass-surface group w-full rounded-2xl px-4 py-3 text-left transition-all duration-200 hover:-translate-y-0.5",
          isUnread && "ring-1",
        )}
        style={
          isUnread
            ? { boxShadow: `0 0 0 1px color-mix(in oklch, ${meta.color} 25%, transparent), var(--shadow-glass)` }
            : undefined
        }
      >
        <div className="flex items-start gap-3">
          {/* Avatar or icon */}
          {notification.avatarInitials ? (
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
              style={{
                background: `color-mix(in oklch, ${meta.color} 20%, var(--surface-2))`,
                color: meta.color,
              }}
            >
              {notification.avatarInitials}
            </div>
          ) : (
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
              style={{
                background: `color-mix(in oklch, ${meta.color} 16%, transparent)`,
                color: meta.color,
              }}
            >
              <ContextIcon context={notification.context} size={18} />
            </div>
          )}

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={cn(
                      "text-sm font-semibold leading-snug",
                      isUnread ? "text-foreground" : "text-foreground/80",
                    )}
                  >
                    {notification.title}
                  </span>
                  <ContextBadge context={notification.context} small />
                  {notification.priority !== "normal" && notification.priority !== "info" && (
                    <span
                      className="text-[10px] font-medium rounded-full px-1.5 py-0.5"
                      style={{
                        background: priorityMeta.bgColor,
                        color: priorityMeta.color,
                      }}
                    >
                      {priorityMeta.label}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground/80 leading-relaxed">
                  {notification.description}
                </p>
              </div>

              {/* Timestamp + close */}
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="text-[10px] text-muted-foreground">{notification.timestamp}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDismiss(notification.id);
                  }}
                  className="text-muted-foreground hover:text-foreground transition opacity-0 group-hover:opacity-100"
                  aria-label="Fermer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Priority indicator */}
            {notification.priority !== "normal" && notification.priority !== "info" && (
              <div className="mt-2 flex items-center gap-1">
                <PriorityDot priority={notification.priority} />
                {notification.priority === "urgent" && (
                  <span className="text-[10px] text-destructive font-medium">Action requise</span>
                )}
                {notification.priority === "important" && (
                  <span className="text-[10px] text-live font-medium">À voir rapidement</span>
                )}
              </div>
            )}

            {/* Actions (expanded) */}
            {showActions && notification.actions && (
              <div className="mt-3 flex flex-wrap gap-2 pt-3 border-t border-white/5">
                {notification.actions.map((action) => (
                  <button
                    key={action.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (action.id === "ignore" || action.id === "close") {
                        onDismiss(notification.id);
                      }
                      setShowActions(false);
                    }}
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all",
                      action.type === "primary"
                        ? "hover:scale-105"
                        : "hover:bg-white/5",
                    )}
                    style={
                      action.type === "primary"
                        ? {
                            background: `color-mix(in oklch, ${meta.color} 20%, var(--surface-2))`,
                            color: meta.color,
                          }
                        : {
                            background: "transparent",
                            color: "var(--muted-foreground)",
                          }
                    }
                  >
                    {action.id === "view" || action.id === "explore" || action.id === "reply" ? (
                      <ChevronRight className="h-3 w-3" />
                    ) : (
                      <Check className="h-3 w-3" />
                    )}
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Unread indicator */}
          {isUnread && (
            <span
              className="h-2 w-2 rounded-full shrink-0 mt-1"
              style={{ background: meta.color, boxShadow: `0 0 6px ${meta.color}` }}
            />
          )}
        </div>
      </button>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="glass-surface rounded-2xl px-6 py-12 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/5">
        <Bell className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold">Aucune notification</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Vous êtes à jour. Explorez de nouvelles opportunités pour recevoir des notifications.
      </p>
      <div className="mt-5 flex flex-col gap-2">
        {[
          { label: "Découvrir avec Scan", color: "var(--scan)", icon: ScanSearch },
          { label: "Voir les offres Flash", color: "var(--flash)", icon: Zap },
          { label: "Créer un besoin Radar", color: "var(--radar)", icon: Radar },
        ].map((s) => (
          <button
            key={s.label}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm transition hover:bg-white/5"
            style={{ color: s.color }}
          >
            <s.icon className="h-4 w-4" />
            {s.label}
            <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
          </button>
        ))}
      </div>
    </div>
  );
}
