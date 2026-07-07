import { useEffect, useState } from "react";
import { Link, useLocation, useRouter } from "@tanstack/react-router";
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
  Home,
  SearchX,
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
  { to: "/talents", label: "Talents", hint: "Apprendre", icon: GraduationCap, color: "var(--radar)" },
  { to: "/creation", label: "Création", hint: "Projets", icon: Palette, color: "var(--flash)" },
  { to: "/scan", label: "Scanner", hint: "Autour", icon: ScanSearch, color: "var(--live)" },
  { to: "/trust", label: "Confiance", hint: "Score", icon: ShieldCheck, color: "var(--trust)" },
  { to: "/messages", label: "Messages", hint: "Chats", icon: MessageCircle, color: "var(--flash)" },
  { to: "/notifications", label: "Alertes", hint: "Signaux", icon: Bell, color: "var(--scan)" },
  { to: "/profile", label: "Profil", hint: "Toi", icon: User, color: "var(--radar)" },
];

export function CategoriesSheet({ onClose }: { onClose: () => void }) {
  const { pathname } = useLocation();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => setLoading(false), 320);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      clearTimeout(t);
    };
  }, [onClose]);

  const goBack = () => {
    onClose();
    // best-effort history back after modal closes
    if (typeof window !== "undefined" && window.history.length > 1) {
      setTimeout(() => router.history.back(), 30);
    }
  };

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
        {/* Sticky top bar */}
        <div
          className="sticky top-0 z-10 border-b border-white/5 bg-[color-mix(in_oklch,var(--surface-1)_85%,transparent)] px-4 pb-3 backdrop-blur-xl"
          style={{ paddingTop: "max(env(safe-area-inset-top), 1rem)" }}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={goBack}
              aria-label="Retour à la page précédente"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-foreground/80 transition-all hover:bg-white/10 hover:text-foreground active:scale-95"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <h2 className="ds-title min-w-0 flex-1 truncate text-[15px]">Choisis ton espace</h2>

            <button
              onClick={onClose}
              aria-label="Fermer"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl hover:bg-white/5 active:scale-95"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Fil d'Ariane */}
          <nav aria-label="Fil d'Ariane" className="mt-2">
            <ol className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <li>
                <Link
                  to="/"
                  onClick={onClose}
                  className="inline-flex items-center gap-1 rounded-md px-1 py-0.5 hover:bg-white/5 hover:text-foreground"
                >
                  <Home className="h-3 w-3" />
                  <span>Accueil</span>
                </Link>
              </li>
              <ChevronRight className="h-3 w-3 opacity-40" />
              <li>
                <button
                  onClick={goBack}
                  className="inline-flex items-center gap-1 rounded-md px-1 py-0.5 hover:bg-white/5 hover:text-foreground"
                >
                  Précédent
                </button>
              </li>
              <ChevronRight className="h-3 w-3 opacity-40" />
              <li className="inline-flex items-center gap-1 px-1" aria-current="page">
                <LayoutGrid className="h-3 w-3" style={{ color: "var(--radar)" }} />
                <span style={{ color: "var(--radar)" }}>Espaces</span>
              </li>
            </ol>
          </nav>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 pt-4">
          <div className="mb-4 flex items-center gap-2 rounded-2xl bg-white/[0.03] p-3">
            <Sparkles className="h-4 w-4 shrink-0" style={{ color: "var(--scan)" }} />
            <p className="text-[12px] leading-snug text-muted-foreground">
              Un tap pour aller partout.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex aspect-square animate-pulse flex-col items-center justify-center rounded-2xl bg-white/[0.04] p-2.5"
                  aria-hidden
                >
                  <div className="mb-2 h-9 w-9 rounded-xl bg-white/[0.06]" />
                  <div className="h-2 w-10 rounded bg-white/[0.06]" />
                  <div className="mt-1 h-1.5 w-8 rounded bg-white/[0.04]" />
                </div>
              ))}
            </div>
          ) : SHORTCUTS.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white/[0.03] p-6 text-center">
              <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.06]">
                <SearchX className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="ds-title text-[13px]">Aucun espace pour l'instant</p>
              <p className="ds-caption mt-1 text-[11px]">Reviens vite, ça arrive.</p>
            </div>
          ) : (
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
                      "group relative flex aspect-square min-w-0 flex-col items-center justify-center overflow-hidden rounded-2xl p-2 text-center transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.97]"
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
                      className="relative mb-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                      style={{
                        background: `color-mix(in oklch, ${s.color} 22%, transparent)`,
                        color: s.color,
                      }}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="w-full truncate text-[11px] font-semibold leading-tight text-foreground/95">
                      {s.label}
                    </p>
                    <p className="mt-0.5 w-full truncate text-[9px] leading-tight text-muted-foreground">
                      {s.hint}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-4 mb-2 text-center">
            <p className="text-[10px] text-muted-foreground/70">
              Touche <span className="text-foreground/80">Retour</span> ou Échap pour fermer
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
