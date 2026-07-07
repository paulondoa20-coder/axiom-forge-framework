import { useEffect } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  X,
  ArrowLeft,
  User,
  MessageCircle,
  Bell,
  ShieldCheck,
  ScanSearch,
  Sparkles,
  GraduationCap,
  Palette,
  ChevronRight,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Shortcut = {
  to: string;
  label: string;
  hint: string;
  icon: typeof User;
  color: string;
};

const SHORTCUTS: Shortcut[] = [
  { to: "/talents", label: "Talents", hint: "Apprendre & transmettre", icon: GraduationCap, color: "var(--radar)" },
  { to: "/creation", label: "Création", hint: "Projets & collabs", icon: Palette, color: "var(--flash)" },
  { to: "/scan", label: "Scanner", hint: "Autour de toi", icon: ScanSearch, color: "var(--live)" },
  { to: "/trust", label: "Confiance", hint: "Score & réputation", icon: ShieldCheck, color: "var(--trust)" },
  { to: "/messages", label: "Messages", hint: "Conversations", icon: MessageCircle, color: "var(--flash)" },
  { to: "/notifications", label: "Alertes", hint: "Signaux calmes", icon: Bell, color: "var(--scan)" },
  { to: "/profile", label: "Profil", hint: "Ton identité", icon: User, color: "var(--radar)" },
];

export function CategoriesSheet({ onClose }: { onClose: () => void }) {
  const { pathname } = useLocation();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Espaces VITALA"
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 backdrop-blur-md animate-[fade-up_0.2s_var(--ease-smooth)_both] sm:items-center"
      onClick={onClose}
    >
      <div
        className="glass-surface relative flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl pb-[max(env(safe-area-inset-bottom),1rem)] animate-[scale-in_0.3s_var(--ease-spring)_both] sm:max-h-[86vh] sm:rounded-3xl"
        style={{ boxShadow: "var(--shadow-float)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky top bar — always visible */}
        <div
          className="sticky top-0 z-10 flex items-center gap-2 border-b border-white/5 bg-[color-mix(in_oklch,var(--surface-1)_85%,transparent)] px-4 pt-4 pb-3 backdrop-blur-xl"
          style={{ paddingTop: "max(env(safe-area-inset-top), 1rem)" }}
        >
          <button
            onClick={onClose}
            aria-label="Retour"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-foreground/80 transition-all hover:bg-white/10 hover:text-foreground active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <LayoutGrid className="h-3 w-3" style={{ color: "var(--radar)" }} />
              <span>Menu</span>
              <ChevronRight className="h-3 w-3 opacity-50" />
              <span style={{ color: "var(--radar)" }}>Espaces</span>
            </div>
            <h2 className="ds-title mt-0.5 truncate text-[15px]">Choisis ton espace</h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Fermer"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl hover:bg-white/5 active:scale-95"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 pt-4">
          <div className="mb-4 flex items-center gap-2 rounded-2xl bg-white/[0.03] p-3">
            <Sparkles className="h-4 w-4 shrink-0" style={{ color: "var(--scan)" }} />
            <p className="text-[12px] leading-snug text-muted-foreground">
              Un tap pour aller partout. Tes raccourcis, en un clin d'œil.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {SHORTCUTS.map((s) => {
              const Icon = s.icon;
              const active = pathname === s.to;
              return (
                <Link
                  key={s.to}
                  to={s.to}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative flex flex-col items-center overflow-hidden rounded-2xl p-2.5 text-center transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97]"
                  )}
                  style={{
                    background: `color-mix(in oklch, ${s.color} ${active ? "18%" : "8%"}, var(--surface-1))`,
                    boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${s.color} ${active ? "45%" : "20%"}, transparent), 0 0 18px -12px ${s.color}`,
                  }}
                >
                  {active && (
                    <span
                      className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full"
                      style={{ background: s.color, boxShadow: `0 0 6px ${s.color}` }}
                      aria-hidden
                    />
                  )}
                  <div
                    className="pointer-events-none absolute -right-4 -top-4 h-14 w-14 rounded-full opacity-30 blur-2xl transition-opacity group-hover:opacity-60"
                    style={{ background: s.color }}
                  />
                  <div
                    className="relative mb-1.5 flex h-9 w-9 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                    style={{
                      background: `color-mix(in oklch, ${s.color} 22%, transparent)`,
                      color: s.color,
                    }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="ds-title w-full text-[11px] leading-tight">{s.label}</p>
                  <p className="ds-caption mt-0.5 w-full text-[9px] leading-tight opacity-80 line-clamp-2">
                    {s.hint}
                  </p>
                </Link>
              );
            })}
          </div>

          <div className="mt-4 mb-2 text-center">
            <p className="text-[10px] text-muted-foreground/70">
              Balaie vers le bas ou touche <span className="text-foreground/80">Retour</span> pour fermer
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
