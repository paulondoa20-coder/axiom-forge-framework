import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";

export function FinalCTA() {
  return (
    <section
      className="relative overflow-hidden rounded-3xl p-5"
      style={{
        background:
          "linear-gradient(135deg, color-mix(in oklch, var(--primary) 16%, var(--glass)), color-mix(in oklch, var(--radar) 10%, var(--glass)))",
        border: "1px solid var(--glass-border)",
        boxShadow: "var(--shadow-glass), 0 0 40px -12px var(--primary)",
        backdropFilter: "blur(20px) saturate(140%)",
      }}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-40 blur-3xl"
        style={{ background: "var(--gradient-radar)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full opacity-30 blur-3xl"
        style={{ background: "var(--gradient-flash)" }}
      />

      <div className="relative space-y-3">
        <div
          className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
          style={{
            background: "color-mix(in oklch, var(--primary) 18%, transparent)",
            color: "var(--primary)",
          }}
        >
          <Sparkles className="h-3 w-3" />
          Rejoins le mouvement
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-semibold leading-tight tracking-tight text-foreground">
            Une seule app. <span className="text-gradient-primary">Mille possibilités.</span>
          </h3>
          <p className="text-[12px] leading-relaxed text-muted-foreground">
            Publie, demande, découvre, vérifie — tout au même endroit. VITALA t'oriente, la
            communauté fait le reste.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <Link
            to="/flash"
            className="inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[12px] font-semibold transition-all hover:-translate-y-0.5 active:scale-[0.98]"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
              boxShadow: "0 6px 20px -8px var(--primary)",
            }}
          >
            Publier maintenant <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            to="/scan"
            className="inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-[12px] font-medium text-foreground/90 transition-all hover:-translate-y-0.5"
            style={{ borderColor: "var(--glass-border)", background: "var(--glass)" }}
          >
            Explorer d'abord
          </Link>
        </div>
      </div>
    </section>
  );
}
