import { Link } from "@tanstack/react-router";
import { X, User, MessageCircle, Bell, ShieldCheck, ScanSearch, Sparkles, GraduationCap, Palette } from "lucide-react";

type Shortcut = {
  to: string;
  label: string;
  hint: string;
  icon: typeof User;
  color: string;
};

const SHORTCUTS: Shortcut[] = [
  { to: "/talents", label: "Talents & Savoir Vivant", hint: "Apprendre & transmettre", icon: GraduationCap, color: "var(--radar)" },
  { to: "/creation", label: "Espace de création", hint: "Projets & collaborations", icon: Palette, color: "var(--flash)" },
  { to: "/profile", label: "Profil", hint: "Identité & présence", icon: User, color: "var(--radar)" },
  { to: "/messages", label: "Messages", hint: "Conversations vivantes", icon: MessageCircle, color: "var(--flash)" },
  { to: "/notifications", label: "Notifications", hint: "Signaux calmes", icon: Bell, color: "var(--scan)" },
  { to: "/trust", label: "Confiance", hint: "Score & réputation", icon: ShieldCheck, color: "var(--trust)" },
  { to: "/scan", label: "Scanner", hint: "Détecter autour de soi", icon: ScanSearch, color: "var(--live)" },
];

export function CategoriesSheet({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm animate-[fade-up_0.2s_var(--ease-smooth)_both]"
      onClick={onClose}
    >
      <div
        className="glass-surface relative w-full max-w-md rounded-t-3xl p-5 pb-24 animate-[scale-in_0.3s_var(--ease-spring)_both]"
        style={{ boxShadow: "var(--shadow-float)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/15" />

        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="ds-eyebrow inline-flex items-center gap-1.5" style={{ color: "var(--radar)" }}>
              <Sparkles className="h-3 w-3" /> Espaces
            </p>
            <h2 className="ds-title mt-0.5">Vos raccourcis</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-white/5"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {SHORTCUTS.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.to}
                to={s.to}
                onClick={onClose}
                className="group relative overflow-hidden rounded-2xl p-3.5 text-left transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
                style={{
                  background: `color-mix(in oklch, ${s.color} 10%, var(--surface-1))`,
                  boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${s.color} 25%, transparent), 0 0 22px -12px ${s.color}`,
                }}
              >
                <div
                  className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-40 blur-2xl"
                  style={{ background: s.color }}
                />
                <div
                  className="relative mb-2.5 inline-flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{
                    background: `color-mix(in oklch, ${s.color} 22%, transparent)`,
                    color: s.color,
                  }}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <p className="ds-title text-sm">{s.label}</p>
                <p className="ds-caption mt-0.5 truncate">{s.hint}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
