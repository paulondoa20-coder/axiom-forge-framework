import { Sparkles, ArrowRight, MapPin, Activity } from "lucide-react";

export function SmartHero({ name = "Alex" }: { name?: string }) {
  const hour = new Date().getHours();
  const greet =
    hour < 6 ? "Encore debout" : hour < 12 ? "Bonjour" : hour < 18 ? "Bel après-midi" : "Bonsoir";

  const punch =
    hour < 12
      ? "On démarre fort ?"
      : hour < 18
      ? "C'est le moment de bouger."
      : "La ville s'active — t'es prêt ?";

  return (
    <header className="space-y-4">
      {/* Greeting */}
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="absolute inset-0 animate-ping rounded-full bg-[var(--radar)] opacity-75" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-[var(--radar)]" />
          </span>
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {greet}, {name}{" "}
            <span className="text-foreground/70">· {punch}</span>
          </p>
        </div>
        <h1 className="text-[22px] sm:text-[26px] font-semibold leading-[1.15] tracking-tight text-gradient-primary">
          Que souhaitez-vous faire aujourd'hui ?
        </h1>
        <p className="text-[12px] sm:text-[13px] leading-relaxed text-muted-foreground">
          Une demande, une offre, une découverte — VITALA te connecte au bon profil, au bon
          moment.
        </p>
      </div>

      {/* Smart action bar — single central entry point */}
      <button
        className="group relative w-full overflow-hidden rounded-2xl text-left transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.99]"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in oklch, var(--primary) 14%, var(--glass)), var(--glass))",
          border: "1px solid var(--glass-border)",
          boxShadow: "var(--shadow-glass), 0 0 32px -10px var(--primary)",
          backdropFilter: "blur(20px) saturate(140%)",
        }}
      >
        <span
          className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-40 blur-2xl transition-opacity duration-500 group-hover:opacity-80"
          style={{ background: "var(--gradient-radar)" }}
        />
        <span
          className="pointer-events-none absolute inset-x-0 -bottom-px h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(90deg, transparent, color-mix(in oklch, var(--primary) 60%, transparent), transparent)",
          }}
        />
        <div className="relative flex items-center gap-3 px-3.5 py-3 sm:px-4 sm:py-3.5">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:rotate-6"
            style={{
              background: "color-mix(in oklch, var(--primary) 20%, transparent)",
              color: "var(--primary)",
            }}
          >
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] sm:text-sm font-medium leading-snug text-foreground/90">
              Publier, chercher un service, ou exprimer un besoin…
            </p>
            <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
              Une seule action — VITALA t'oriente
            </p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </button>

      {/* Micro pulse row — context immédiat */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 px-1 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3 w-3 shrink-0" style={{ color: "var(--scan)" }} />
          Akwa, Douala
        </span>
        <span className="opacity-40">·</span>
        <span className="inline-flex flex-wrap items-center gap-1">
          <Activity className="h-3 w-3 shrink-0" style={{ color: "var(--flash)" }} />
          <span className="text-foreground/80">128</span>
          <span>personnes actives autour</span>
        </span>
      </div>
    </header>
  );
}

