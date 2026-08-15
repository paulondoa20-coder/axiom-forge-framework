import { useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Bell, MessageCircle, Sparkles, UserRound, ChevronRight, Sun, Moon, Globe } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useConversations } from "@/domains/messaging";
import { useNotifications } from "@/domains/notification";
import { useSyncStatus, SYNC_LABEL, SYNC_COLOR } from "@/domains/sync";
import { usePrefs, LANG_META, LANGS, type Lang } from "@/lib/preferences";

export function TopBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const isProfile = pathname === "/profile";
  const { theme, toggleTheme, lang, setLang } = usePrefs();

  const conversations = useConversations();
  const { notifications } = useNotifications();
  const sync = useSyncStatus();

  const unreadMsg = conversations.reduce((n, c) => n + c.unread, 0);
  const unreadNotif = notifications.filter((n) => !n.read).length;
  const totalUnread = unreadMsg + unreadNotif;

  const items = [
    {
      key: "notifications" as const,
      label: "Notifications",
      hint: unreadNotif > 0 ? `${unreadNotif} non lues` : "Tout est a jour",
      icon: Bell,
      color: "var(--flash)",
      badge: unreadNotif,
      action: () => navigate({ to: "/notifications" }),
    },
    {
      key: "messages" as const,
      label: "Messages",
      hint: unreadMsg > 0 ? `${unreadMsg} nouveaux` : "Boite de reception",
      icon: MessageCircle,
      color: "var(--radar)",
      badge: unreadMsg,
      action: () => navigate({ to: "/messages" }),
    },
    {
      key: "assistant" as const,
      label: "Assistant",
      hint: "Aide & suggestions IA",
      icon: Sparkles,
      color: "var(--scan)",
      badge: 0,
      action: () => window.dispatchEvent(new Event("open-assistant")),
    },
  ];

  return (
    <header className="sticky top-0 z-30 -mx-4 mb-4 px-4 pt-2">
      <div className="glass-surface flex items-center justify-between rounded-2xl px-3 py-2">
        <Link to="/" className="flex items-center gap-2" aria-label="VITALA - Accueil">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-xl"
            style={{
              background: "var(--gradient-hero)",
              boxShadow: "inset 0 0 0 1px var(--glass-border), 0 0 18px -4px var(--primary)",
            }}
          >
            <span className="text-[13px] font-bold tracking-tight">V</span>
          </div>
          <span className="text-[13px] font-semibold tracking-[0.22em] text-foreground/80">
            VITALA
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all duration-300"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          {/* Language selector */}
          <Popover open={langOpen} onOpenChange={setLangOpen}>
            <PopoverTrigger asChild>
              <button
                aria-label="Changer la langue"
                className="flex h-8 items-center gap-1 rounded-full px-2 text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all duration-300"
              >
                <Globe className="h-3.5 w-3.5" />
                <span className="text-[10px] font-semibold">{LANG_META[lang].flag}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={8}
              className="glass-surface w-40 rounded-2xl border-0 p-1.5 shadow-[var(--shadow-float)]"
            >
              {LANGS.map((l) => {
                const meta = LANG_META[l];
                const isActive = l === lang;
                return (
                  <button
                    key={l}
                    onClick={() => {
                      setLang(l);
                      setLangOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left transition-all duration-200",
                      isActive ? "bg-white/10 text-foreground" : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                    )}
                  >
                    <span className="text-[11px] font-bold w-5 text-center">{meta.flag}</span>
                    <span className="text-[12px] font-medium">{meta.label}</span>
                    {isActive && (
                      <span
                        className="ml-auto h-1.5 w-1.5 rounded-full"
                        style={{ background: "var(--primary)", boxShadow: "0 0 6px var(--primary)" }}
                      />
                    )}
                  </button>
                );
              })}
            </PopoverContent>
          </Popover>

          {/* Hub popover */}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                aria-label="Hub de communication"
                className={cn(
                  "relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300",
                  open
                    ? "scale-105 bg-white/10"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
                style={
                  open
                    ? {
                        boxShadow:
                          "inset 0 0 0 1px color-mix(in oklch, var(--scan) 50%, transparent), 0 0 18px -4px var(--scan)",
                      }
                    : undefined
                }
              >
                <Sparkles
                  className={cn(
                    "h-4 w-4 transition-transform duration-300",
                    open && "rotate-12 scale-110"
                  )}
                  style={open ? { color: "var(--scan)" } : undefined}
                />
                {totalUnread > 0 && !open && (
                  <span
                    className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold text-white"
                    style={{ background: "var(--live)", boxShadow: "0 0 8px var(--live)" }}
                  >
                    {totalUnread > 9 ? "9+" : totalUnread}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={10}
              className="glass-surface w-64 rounded-2xl border-0 p-2 shadow-[var(--shadow-float)]"
            >
              <div className="px-2 pb-2 pt-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
                  Hub
                </p>
              </div>
              <div className="flex flex-col gap-1">
                {items.map((it) => {
                  const Icon = it.icon;
                  return (
                    <button
                      key={it.key}
                      onClick={() => {
                        setOpen(false);
                        it.action();
                      }}
                      className="group flex items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-all duration-200 hover:bg-white/5 active:scale-[0.98]"
                    >
                      <span
                        className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                        style={{
                          background: `color-mix(in oklch, ${it.color} 18%, transparent)`,
                          boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${it.color} 30%, transparent)`,
                        }}
                      >
                        <Icon className="h-4 w-4" style={{ color: it.color }} />
                        {it.badge > 0 && (
                          <span
                            className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold text-white"
                            style={{ background: "var(--live)" }}
                          >
                            {it.badge > 9 ? "9+" : it.badge}
                          </span>
                        )}
                      </span>
                      <span className="flex flex-1 flex-col">
                        <span className="text-[13px] font-medium text-foreground">
                          {it.label}
                        </span>
                        <span className="text-[11px] text-muted-foreground">{it.hint}</span>
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                    </button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>

          <Link
            to="/profile"
            aria-label="Profil"
            className={cn(
              "ml-1 flex h-9 w-9 items-center justify-center rounded-full transition-all",
              isProfile
                ? "ring-2 ring-[color-mix(in_oklch,var(--primary)_60%,transparent)]"
                : "hover:scale-105"
            )}
            style={{
              background:
                "linear-gradient(135deg, color-mix(in oklch, var(--primary) 40%, transparent), color-mix(in oklch, var(--scan) 40%, transparent))",
              boxShadow: isProfile ? "0 0 14px -2px var(--primary)" : undefined,
            }}
          >
            <UserRound className="h-4 w-4" strokeWidth={2.2} />
          </Link>
        </div>
      </div>
    </header>
  );
}