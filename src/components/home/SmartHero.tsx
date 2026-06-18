import { Search, Sparkles, ArrowRight } from "lucide-react";

export function SmartHero({ name = "Alex" }: { name?: string }) {
  const hour = new Date().getHours();
  const greet =
    hour < 6 ? "Late night" : hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <header className="space-y-5">


      {/* Greeting */}
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {greet}, {name}
        </p>
        <h1 className="text-[26px] font-semibold leading-tight tracking-tight text-gradient-primary">
          Que souhaitez-vous faire&nbsp;aujourd'hui&nbsp;?
        </h1>
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
          className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-40 blur-2xl transition-opacity group-hover:opacity-70"
          style={{ background: "var(--gradient-radar)" }}
        />
        <div className="relative flex items-center gap-3 px-4 py-3.5">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            style={{
              background: "color-mix(in oklch, var(--primary) 20%, transparent)",
              color: "var(--primary)",
            }}
          >
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground/90">
              Publier, chercher un service, ou exprimer un besoin…
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Une seule action — VITALA vous oriente
            </p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </div>
      </button>
    </header>
  );
}
