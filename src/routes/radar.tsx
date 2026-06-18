import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ScanWaves } from "@/components/scan/ScanWaves";
import { ScanReady } from "@/components/scan/ScanReady";
import { cn } from "@/lib/utils";
import {
  Radar,
  Mic,
  Settings2,
  Sparkles,
  ChevronRight,
  Radio,
  ArrowLeft,
  Bell,
  BellRing,
  Check,
  MapPin,
  ShieldCheck,
  MessageCircle,
  Brain,
  Eye,
  Users,
  Zap,
  Plus,
  X,
  History,
  TrendingUp,
  Briefcase,
  Heart,
  Layers,
  Sliders,
  Clock,
} from "lucide-react";

export const Route = createFileRoute("/radar")({
  head: () => ({
    meta: [
      { title: "Radar — Intelligence · VITALA" },
      {
        name: "description",
        content: "Describe your intention. RADAR searches intelligently.",
      },
    ],
  }),
  component: RadarPage,
});

type RadarState = "express" | "analyzing" | "ready" | "results";

const PLACEHOLDER_PROMPTS = [
  "Que recherchez-vous aujourd'hui ?",
  "Décrivez votre besoin naturellement…",
  "Expliquez ce que vous cherchez…",
  "Parlez librement de votre besoin…",
];

const SMART_EXAMPLES = [
  { text: "Trouver un développeur", icon: "💻" },
  { text: "Chercher un emploi", icon: "💼" },
  { text: "Trouver une aide urgente", icon: "🆘" },
  { text: "Rechercher un partenaire", icon: "🤝" },
];

const ANALYSIS_STEPS = [
  { icon: Brain, label: "Compréhension de l'intention", hint: "Décodage du contexte humain" },
  { icon: Eye, label: "Exploration de l'écosystème", hint: "Lecture des signaux vivants" },
  { icon: Users, label: "Analyse de compatibilité", hint: "Profils, confiance, disponibilité" },
  { icon: Sparkles, label: "Émergence des opportunités", hint: "Résultats contextuels" },
];

const MOCK_RESULTS = [
  {
    id: "1",
    name: "Amélie Laurent",
    role: "Product Designer · Mentor",
    avatar: "AL",
    location: "Paris · 2 km",
    trust: 96,
    compatibility: 94,
    available: true,
    tags: ["Design systems", "Mentorat", "Calme"],
    note: "Style de collaboration proche du tien. Activité récente forte.",
    gradient: "linear-gradient(135deg, oklch(0.72 0.2 320), oklch(0.65 0.22 280))",
  },
  {
    id: "2",
    name: "Yacine Boudiaf",
    role: "Full-Stack Engineer",
    avatar: "YB",
    location: "Lyon · Remote",
    trust: 88,
    compatibility: 89,
    available: true,
    tags: ["React", "Edge", "Open-source"],
    note: "Contribue régulièrement à l'écosystème. Communication directe.",
    gradient: "linear-gradient(135deg, oklch(0.78 0.18 200), oklch(0.7 0.2 240))",
  },
  {
    id: "3",
    name: "Studio Hévéa",
    role: "Collectif créatif · 4 humains",
    avatar: "SH",
    location: "Marseille",
    trust: 92,
    compatibility: 86,
    available: false,
    tags: ["Branding", "Motion", "Stratégie"],
    note: "Expertise complémentaire. Disponibilité dans 2 semaines.",
    gradient: "linear-gradient(135deg, oklch(0.78 0.18 155), oklch(0.7 0.18 180))",
  },
];

const ASSISTANT_HINTS = [
  "Préciser le niveau d'expérience ?",
  "Ajouter une contrainte de zone ?",
  "Filtrer par disponibilité immédiate ?",
];

function RadarPage() {
  const [state, setState] = useState<RadarState>("express");
  const [need, setNeed] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const [voiceActive, setVoiceActive] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [veilleOn, setVeilleOn] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [params, setParams] = useState({
    radius: 10,
    depth: "balanced" as "fast" | "balanced" | "deep",
    trustMin: 70,
    availableOnly: true,
    scope: "all" as "all" | "humans" | "collectifs" | "services",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % PLACEHOLDER_PROMPTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Animate analyzing steps
  useEffect(() => {
    if (state !== "analyzing") return;
    setAnalysisStep(0);
    const id = setInterval(() => {
      setAnalysisStep((s) => {
        if (s >= ANALYSIS_STEPS.length - 1) {
          clearInterval(id);
          setTimeout(() => setState("results"), 700);
          return s;
        }
        return s + 1;
      });
    }, 700);
    return () => clearInterval(id);
  }, [state]);

  const ready = need.trim().length > 3;

  const handleLaunch = () => {
    if (!ready) return;
    setState("analyzing");
  };

  const resetToExpress = () => {
    setState("express");
    setVeilleOn(false);
  };

  return (
    <AppShell>
      {state === "express" && (
        <div className="space-y-6 animate-[fade-up_0.6s_var(--ease-smooth)_both]">
          {/* Compact header */}
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-2xl"
                style={{
                  background: "color-mix(in oklch, var(--radar) 18%, transparent)",
                  boxShadow:
                    "inset 0 0 0 1px color-mix(in oklch, var(--radar) 35%, transparent), 0 0 24px -8px var(--radar)",
                  color: "var(--radar)",
                }}
              >
                <Radar className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color: "var(--radar)" }}>
                  Radar
                </p>
                <h1 className="text-xl font-semibold leading-tight tracking-tight">
                  Décrivez votre intention
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="hidden xs:inline-flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 rounded-full bg-[var(--radar)] animate-pulse-soft" />
                  <span className="relative h-2 w-2 rounded-full bg-[var(--radar)]" />
                </span>
                <span className="text-[10px] text-muted-foreground opacity-60">Listening</span>
              </span>
              <button
                onClick={() => setSettingsOpen(true)}
                className="relative flex h-9 w-9 items-center justify-center rounded-xl transition-all hover:bg-white/5"
                aria-label="Paramètres du radar"
                style={{
                  boxShadow:
                    "inset 0 0 0 1px color-mix(in oklch, var(--radar) 22%, transparent)",
                }}
              >
                <Sliders className="h-4 w-4" style={{ color: "var(--radar)" }} />
              </button>
            </div>
          </header>

          {/* Composer — compact (half height) */}
          <section>
            <div
              className="glass-surface relative overflow-hidden rounded-3xl p-4 transition-all duration-500"
              style={{
                boxShadow: isFocused
                  ? "var(--shadow-glass), 0 0 60px -20px var(--radar), inset 0 0 0 1px color-mix(in oklch, var(--radar) 25%, transparent)"
                  : "var(--shadow-glass), 0 0 30px -20px var(--radar)",
              }}
            >
              <div
                className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full blur-3xl transition-opacity duration-500"
                style={{ background: "var(--gradient-radar)", opacity: isFocused ? 0.3 : 0.12 }}
              />

              <textarea
                value={need}
                onChange={(e) => setNeed(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={PLACEHOLDER_PROMPTS[currentPlaceholder]}
                rows={2}
                className="relative w-full resize-none bg-transparent text-base leading-relaxed text-foreground placeholder:text-muted-foreground/40 focus:outline-none font-light tracking-tight"
              />

              <div className="relative mt-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground/70">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {params.radius} km
                  </span>
                  <span className="opacity-30">·</span>
                  <span className="inline-flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" /> Trust ≥ {params.trustMin}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setVoiceActive(!voiceActive)}
                    aria-label="Saisie vocale"
                    className={cn(
                      "relative flex h-9 w-9 items-center justify-center rounded-full transition-all",
                      voiceActive && "scale-110",
                    )}
                    style={{
                      background: voiceActive
                        ? "var(--gradient-radar)"
                        : "color-mix(in oklch, var(--radar) 16%, transparent)",
                      boxShadow: voiceActive
                        ? "0 0 24px -6px var(--radar)"
                        : "inset 0 0 0 1px color-mix(in oklch, var(--radar) 30%, transparent)",
                    }}
                  >
                    <Mic
                      className={cn("h-4 w-4", voiceActive ? "text-white" : "text-[var(--radar)]")}
                    />
                  </button>
                  <button
                    onClick={handleLaunch}
                    disabled={!ready}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-white transition-all",
                      ready ? "active:scale-95" : "opacity-40 cursor-not-allowed",
                    )}
                    style={{
                      background: "var(--gradient-radar)",
                      boxShadow: ready ? "0 0 24px -6px var(--radar)" : "none",
                    }}
                  >
                    <Radio className="h-3.5 w-3.5" />
                    Lancer
                  </button>
                </div>
              </div>
            </div>

            {voiceActive && (
              <p className="mt-2 text-center text-[11px] text-muted-foreground animate-[fade-up_0.3s_var(--ease-smooth)_both]">
                <span style={{ color: "var(--radar)" }}>●</span> Enregistrement…
              </p>
            )}
          </section>

          {/* Quick examples */}
          <section className="space-y-2">
            <p className="px-1 text-[11px] uppercase tracking-[0.15em] text-muted-foreground/60">
              Suggestions
            </p>
            <div className="grid grid-cols-2 gap-2">
              {SMART_EXAMPLES.map((example, i) => (
                <button
                  key={i}
                  onClick={() => setNeed(example.text)}
                  className="glass-surface group relative overflow-hidden rounded-2xl px-3 py-2.5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_30px_-10px_var(--radar)]"
                >
                  <div className="relative flex items-center gap-2">
                    <span className="text-base">{example.icon}</span>
                    <p className="text-xs font-medium text-foreground/80">{example.text}</p>
                  </div>
                  <ChevronRight className="absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground/30 transition-all group-hover:translate-x-0.5" />
                </button>
              ))}
            </div>
          </section>

          <ActiveVeilles />
          <RecentSearches onPick={setNeed} />
          <SmartSuggestionsSection onPick={setNeed} />
        </div>
      )}

      {state === "analyzing" && (
        <ScanWaves
          color="var(--radar)"
          title="Scan en cours…"
          subtitle={`« ${need} »`}
          duration={3800}
          onComplete={() => setState("ready")}
        />
      )}

      {state === "ready" && (
        <ScanReady
          color="var(--radar)"
          count={MOCK_RESULTS.length}
          onView={() => setState("results")}
        />
      )}

      {state === "results" && (
        <ResultsView
          need={need}
          veilleOn={veilleOn}
          onToggleVeille={() => setVeilleOn((v) => !v)}
          onBack={resetToExpress}
        />
      )}

      {settingsOpen && (
        <RadarSettingsSheet
          params={params}
          onChange={setParams}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </AppShell>
  );
}

/* ---------- ANALYZING ---------- */
function AnalyzingView({ need, step }: { need: string; step: number }) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-6 animate-[fade-up_0.5s_var(--ease-smooth)_both]">
      {/* Radar waves */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 160,
              height: 160,
              border: "1px solid color-mix(in oklch, var(--radar) 40%, transparent)",
              animation: `pulse-ring 3s ease-out infinite ${i * 0.7}s`,
            }}
          />
        ))}
        <div
          className="absolute h-72 w-72 rounded-full blur-3xl opacity-40"
          style={{ background: "var(--gradient-radar)" }}
        />
      </div>

      {/* Core orb */}
      <div className="relative mb-10">
        <div
          className="flex h-28 w-28 items-center justify-center rounded-full"
          style={{
            background: "var(--gradient-radar)",
            boxShadow: "0 0 80px -10px var(--radar), inset 0 1px 0 0 oklch(1 0 0 / 0.2)",
            animation: "breathing 2.5s ease-in-out infinite",
          }}
        >
          <Brain className="h-10 w-10 text-white" />
        </div>
      </div>

      <p className="relative max-w-sm text-center text-sm text-muted-foreground italic mb-2">
        « {need} »
      </p>
      <h2 className="relative text-xl font-light tracking-tight mb-8 text-center">
        L'écosystème vous comprend…
      </h2>

      {/* Steps */}
      <div className="relative w-full max-w-md space-y-2">
        {ANALYSIS_STEPS.map((s, i) => {
          const Icon = s.icon;
          const active = i === step;
          const done = i < step;
          return (
            <div
              key={i}
              className="glass-surface flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-500"
              style={{
                opacity: i > step ? 0.3 : 1,
                transform: active ? "scale(1.02)" : "scale(1)",
                boxShadow: active
                  ? "var(--shadow-glass), 0 0 30px -10px var(--radar)"
                  : "var(--shadow-glass)",
              }}
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                style={{
                  background: done || active ? "color-mix(in oklch, var(--radar) 20%, transparent)" : "var(--surface-2)",
                  color: done || active ? "var(--radar)" : "var(--muted-foreground)",
                }}
              >
                {done ? <Check className="h-4 w-4" /> : <Icon className={cn("h-4 w-4", active && "animate-pulse")} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-tight">{s.label}</p>
                <p className="text-[11px] text-muted-foreground">{s.hint}</p>
              </div>
              {active && (
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 rounded-full bg-[var(--radar)] animate-ping" />
                  <span className="relative h-2 w-2 rounded-full bg-[var(--radar)]" />
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- RESULTS ---------- */
function ResultsView({
  need,
  veilleOn,
  onToggleVeille,
  onBack,
}: {
  need: string;
  veilleOn: boolean;
  onToggleVeille: () => void;
  onBack: () => void;
}) {
  return (
    <div className="min-h-screen pb-12 animate-[fade-up_0.5s_var(--ease-smooth)_both]">
      {/* Header */}
      <header className="sticky top-0 z-10 -mx-4 mb-4 backdrop-blur-xl bg-background/70 px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-muted/50 transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Votre intention</p>
            <p className="truncate text-sm font-medium">« {need} »</p>
          </div>
          <button
            onClick={onToggleVeille}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
              veilleOn
                ? "text-white shadow-[0_0_20px_-6px_var(--radar)]"
                : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
            )}
            style={veilleOn ? { background: "var(--gradient-radar)" } : undefined}
          >
            {veilleOn ? <BellRing className="h-3.5 w-3.5" /> : <Bell className="h-3.5 w-3.5" />}
            <span>{veilleOn ? "Veille active" : "Activer la veille"}</span>
          </button>
        </div>
      </header>

      {/* Summary */}
      <section className="mb-5">
        <div
          className="glass-surface relative overflow-hidden rounded-2xl p-4"
          style={{ boxShadow: "var(--shadow-glass), 0 0 40px -20px var(--radar)" }}
        >
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-30 blur-3xl" style={{ background: "var(--gradient-radar)" }} />
          <div className="relative flex items-start gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl"
              style={{
                background: "color-mix(in oklch, var(--radar) 18%, transparent)",
                color: "var(--radar)",
              }}
            >
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm leading-relaxed">
                J'ai exploré l'écosystème et identifié <span className="font-semibold" style={{ color: "var(--radar)" }}>3 humains compatibles</span> avec votre intention.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Classés par compatibilité, confiance et disponibilité.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Veille confirmation */}
      {veilleOn && (
        <div
          className="glass-surface mb-5 flex items-center gap-3 rounded-2xl p-3 animate-[fade-up_0.3s_var(--ease-smooth)_both]"
          style={{ boxShadow: "0 0 24px -10px var(--radar)" }}
        >
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ background: "color-mix(in oklch, var(--radar) 20%, transparent)", color: "var(--radar)" }}
          >
            <Eye className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">L'écosystème continue de chercher pour vous</p>
            <p className="text-[11px] text-muted-foreground">Notifications calmes dès qu'une opportunité émerge.</p>
          </div>
        </div>
      )}

      {/* Results */}
      <section className="space-y-3">
        <p className="px-1 text-xs uppercase tracking-[0.15em] text-muted-foreground/60">
          Humains compatibles
        </p>
        {MOCK_RESULTS.map((r, i) => (
          <MatchCard key={r.id} match={r} delay={i * 80} />
        ))}
      </section>

      {/* Assistant hints */}
      <section className="mt-8 space-y-3">
        <p className="px-1 text-xs uppercase tracking-[0.15em] text-muted-foreground/60">
          Affiner avec l'assistant
        </p>
        <div className="flex flex-wrap gap-2">
          {ASSISTANT_HINTS.map((h, i) => (
            <button
              key={i}
              className="glass-surface flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-foreground/80 transition hover:-translate-y-0.5 hover:text-foreground"
              style={{ boxShadow: "inset 0 0 0 1px color-mix(in oklch, var(--radar) 20%, transparent)" }}
            >
              <Plus className="h-3 w-3" style={{ color: "var(--radar)" }} />
              {h}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ---------- MATCH CARD ---------- */
function MatchCard({ match, delay }: { match: (typeof MOCK_RESULTS)[number]; delay: number }) {
  return (
    <div
      className="glass-surface group relative overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:-translate-y-0.5"
      style={{
        animation: `fade-up 0.5s var(--ease-smooth) ${delay}ms both`,
        boxShadow: "var(--shadow-glass)",
      }}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-20 blur-3xl transition-opacity group-hover:opacity-40"
        style={{ background: match.gradient }}
      />

      <div className="relative flex items-start gap-3">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-semibold text-white"
            style={{ background: match.gradient, boxShadow: "0 0 24px -8px var(--radar)" }}
          >
            {match.avatar}
          </div>
          {match.available && (
            <span
              className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background"
              style={{ background: "var(--success)" }}
            />
          )}
        </div>

        {/* Body */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{match.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">{match.role}</p>
            </div>
            <div
              className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{
                background: "color-mix(in oklch, var(--radar) 18%, transparent)",
                color: "var(--radar)",
                boxShadow: "inset 0 0 0 1px color-mix(in oklch, var(--radar) 30%, transparent)",
              }}
            >
              {match.compatibility}% match
            </div>
          </div>

          {/* Meta */}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {match.location}
            </span>
            <span className="inline-flex items-center gap-1" style={{ color: "var(--trust)" }}>
              <ShieldCheck className="h-3 w-3" /> Trust {match.trust}
            </span>
            <span className="inline-flex items-center gap-1">
              <Zap className="h-3 w-3" style={{ color: match.available ? "var(--success)" : "var(--warning)" }} />
              {match.available ? "Disponible" : "Bientôt"}
            </span>
          </div>

          {/* Tags */}
          <div className="mt-2 flex flex-wrap gap-1">
            {match.tags.map((t) => (
              <span
                key={t}
                className="rounded-full px-2 py-0.5 text-[10px] text-foreground/70"
                style={{
                  background: "var(--surface-2)",
                  boxShadow: "inset 0 0 0 1px oklch(1 0 0 / 0.06)",
                }}
              >
                {t}
              </span>
            ))}
          </div>

          {/* AI note */}
          <p className="mt-2.5 flex items-start gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
            <Sparkles className="mt-0.5 h-3 w-3 shrink-0" style={{ color: "var(--radar)" }} />
            <span className="italic">{match.note}</span>
          </p>

          {/* Action */}
          <button
            className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-white transition hover:-translate-y-0.5"
            style={{
              background: "var(--gradient-radar)",
              boxShadow: "0 0 20px -6px var(--radar)",
            }}
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Entrer en contact
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- COMPACT SECTION HEADER ---------- */
function SectionHeader({
  icon: Icon,
  label,
  color = "var(--muted-foreground)",
  action,
  onAction,
}: {
  icon: typeof BellRing;
  label: string;
  color?: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-1">
      <div className="flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5" style={{ color }} />
        <h3 className="ds-eyebrow !text-[10px]" style={{ color: "var(--muted-foreground)" }}>
          {label}
        </h3>
      </div>
      {action && (
        <button
          onClick={onAction}
          className="text-[11px] font-medium text-muted-foreground transition hover:text-foreground"
        >
          {action}
        </button>
      )}
    </div>
  );
}

/* ---------- ACTIVE VEILLES ---------- */
const VEILLES = [
  { id: "v1", label: "Designer freelance Paris", matches: 3, fresh: "il y a 2 h", color: "var(--radar)" },
  { id: "v2", label: "Co-fondateur tech, mission longue", matches: 1, fresh: "hier", color: "var(--trust)" },
];

function ActiveVeilles() {
  return (
    <section className="space-y-2">
      <SectionHeader icon={BellRing} label="MES VEILLES" color="var(--radar)" action="Tout voir" />
      <div className="glass-surface overflow-hidden rounded-2xl">
        {VEILLES.map((v, i) => (
          <button
            key={v.id}
            type="button"
            className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition active:bg-white/[0.04]"
            style={i < VEILLES.length - 1 ? { borderBottom: "1px solid var(--glass-border)" } : undefined}
          >
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
              style={{
                background: `color-mix(in oklch, ${v.color} 18%, transparent)`,
                color: v.color,
                boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${v.color} 30%, transparent)`,
              }}
            >
              <BellRing className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium leading-tight">{v.label}</p>
              <div className="mt-0.5 flex items-center gap-2 text-[10.5px] text-muted-foreground">
                <span
                  className="rounded-full px-1.5 py-px text-[10px] font-semibold"
                  style={{
                    background: `color-mix(in oklch, ${v.color} 18%, transparent)`,
                    color: v.color,
                  }}
                >
                  +{v.matches}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {v.fresh}
                </span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/60" />
          </button>
        ))}
      </div>
    </section>
  );
}

/* ---------- RECENT SEARCHES ---------- */
const RECENT_SEARCHES = [
  "Designer freelance dispo cette semaine",
  "Mentor produit early-stage",
  "Studio motion design Marseille",
  "Coach voix podcast",
];

function RecentSearches({ onPick }: { onPick: (q: string) => void }) {
  return (
    <section className="space-y-2">
      <SectionHeader icon={History} label="RECHERCHES RÉCENTES" />
      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {RECENT_SEARCHES.map((q) => (
          <button
            key={q}
            onClick={() => onPick(q)}
            className="glass-surface group inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] text-foreground/80 transition active:scale-95"
          >
            <History className="h-3 w-3 text-muted-foreground/60 transition group-hover:text-[color:var(--radar)]" />
            <span className="max-w-[180px] truncate">{q}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

/* ---------- SMART SUGGESTIONS ---------- */
const SUGGESTIONS = [
  {
    icon: TrendingUp,
    label: "Tendance",
    hint: "Designers produit recherchés",
    color: "var(--flash)",
    prompt: "Designer produit pour mission de 4 semaines",
  },
  {
    icon: Briefcase,
    label: "Opportunité",
    hint: "3 collectifs cherchent ton profil",
    color: "var(--radar)",
    prompt: "Rejoindre un collectif tech bienveillant",
  },
  {
    icon: Heart,
    label: "Entraide",
    hint: "Aide demandée à 800 m",
    color: "var(--trust)",
    prompt: "Aider un voisin sur un déménagement",
  },
];

function SmartSuggestionsSection({ onPick }: { onPick: (q: string) => void }) {
  return (
    <section className="space-y-2 pb-2">
      <SectionHeader icon={Sparkles} label="SUGGESTIONS" color="var(--radar)" />
      <div className="grid grid-cols-1 gap-1.5">
        {SUGGESTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.label}
              onClick={() => onPick(s.prompt)}
              className="glass-surface group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition active:scale-[0.99]"
              style={{
                boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${s.color} 14%, transparent)`,
              }}
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
                style={{
                  background: `color-mix(in oklch, ${s.color} 18%, transparent)`,
                  color: s.color,
                }}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium leading-tight">{s.label}</p>
                <p className="truncate text-[11px] text-muted-foreground">{s.hint}</p>
              </div>
              <ChevronRight
                className="h-4 w-4 shrink-0 text-muted-foreground/60 transition group-hover:translate-x-0.5"
                style={{ color: "color-mix(in oklch, var(--muted-foreground) 80%, transparent)" }}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}


/* ---------- RADAR SETTINGS SHEET ---------- */
type RadarParams = {
  radius: number;
  depth: "fast" | "balanced" | "deep";
  trustMin: number;
  availableOnly: boolean;
  scope: "all" | "humans" | "collectifs" | "services";
};

function RadarSettingsSheet({
  params,
  onChange,
  onClose,
}: {
  params: RadarParams;
  onChange: (p: RadarParams) => void;
  onClose: () => void;
}) {
  const DEPTHS = [
    { id: "fast", label: "Rapide", hint: "~3s" },
    { id: "balanced", label: "Équilibré", hint: "~6s" },
    { id: "deep", label: "Profond", hint: "~12s" },
  ] as const;

  const SCOPES = [
    { id: "all", label: "Tout" },
    { id: "humans", label: "Humains" },
    { id: "collectifs", label: "Collectifs" },
    { id: "services", label: "Services" },
  ] as const;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm animate-[fade-up_0.25s_var(--ease-smooth)_both]"
      onClick={onClose}
    >
      <div
        className="glass-surface relative max-h-[88vh] w-full max-w-md overflow-y-auto rounded-t-3xl p-5 pb-8 animate-[scale-in_0.35s_var(--ease-spring)_both]"
        style={{ boxShadow: "var(--shadow-float)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wider" style={{ color: "var(--radar)" }}>
              Paramètres
            </p>
            <h2 className="text-lg font-semibold">Calibrer le radar</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-white/5"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Rayon */}
          <div className="space-y-2">
            <div className="flex items-end justify-between">
              <label className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground inline-flex items-center gap-1.5">
                <MapPin className="h-3 w-3" /> Rayon de recherche
              </label>
              <span className="text-sm font-semibold" style={{ color: "var(--radar)" }}>
                {params.radius} km
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={50}
              step={1}
              value={params.radius}
              onChange={(e) => onChange({ ...params, radius: Number(e.target.value) })}
              className="w-full accent-[color:var(--radar)]"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>1 km</span>
              <span>50 km</span>
            </div>
          </div>

          {/* Profondeur */}
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground inline-flex items-center gap-1.5">
              <Layers className="h-3 w-3" /> Profondeur d'analyse
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DEPTHS.map((d) => {
                const active = params.depth === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => onChange({ ...params, depth: d.id })}
                    className={cn(
                      "rounded-xl border px-3 py-2.5 text-center transition-all",
                      active ? "border-transparent" : "border-[var(--glass-border)] bg-white/[0.03]",
                    )}
                    style={
                      active
                        ? {
                            background: "color-mix(in oklch, var(--radar) 18%, transparent)",
                            boxShadow: "inset 0 0 0 1px var(--radar)",
                            color: "var(--radar)",
                          }
                        : undefined
                    }
                  >
                    <p className="text-xs font-semibold">{d.label}</p>
                    <p className="text-[10px] text-muted-foreground">{d.hint}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trust min */}
          <div className="space-y-2">
            <div className="flex items-end justify-between">
              <label className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3 w-3" /> Confiance minimale
              </label>
              <span className="text-sm font-semibold" style={{ color: "var(--trust)" }}>
                {params.trustMin}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={params.trustMin}
              onChange={(e) => onChange({ ...params, trustMin: Number(e.target.value) })}
              className="w-full accent-[color:var(--trust)]"
            />
          </div>

          {/* Scope */}
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground inline-flex items-center gap-1.5">
              <Users className="h-3 w-3" /> Cible
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SCOPES.map((s) => {
                const active = params.scope === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => onChange({ ...params, scope: s.id })}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                      active ? "border-transparent" : "border-[var(--glass-border)] bg-white/[0.03] text-muted-foreground",
                    )}
                    style={
                      active
                        ? {
                            background: "color-mix(in oklch, var(--radar) 18%, transparent)",
                            boxShadow: "inset 0 0 0 1px var(--radar)",
                            color: "var(--radar)",
                          }
                        : undefined
                    }
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Disponibles */}
          <div className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3.5 py-3">
            <div>
              <p className="text-sm font-medium">Disponibles uniquement</p>
              <p className="text-[11px] text-muted-foreground">
                Filtrer les profils en veille ou indisponibles
              </p>
            </div>
            <button
              onClick={() => onChange({ ...params, availableOnly: !params.availableOnly })}
              className={cn(
                "relative h-6 w-11 rounded-full transition-all",
                !params.availableOnly && "bg-white/10",
              )}
              style={params.availableOnly ? { background: "var(--gradient-radar)" } : undefined}
              aria-label="Basculer disponibles uniquement"
            >
              <span
                className={cn(
                  "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
                  params.availableOnly ? "left-[22px]" : "left-0.5",
                )}
              />
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-white transition active:scale-[0.98]"
          style={{
            background: "var(--gradient-radar)",
            boxShadow: "0 0 30px -8px var(--radar)",
          }}
        >
          <Check className="h-4 w-4" /> Appliquer
        </button>
      </div>
    </div>
  );
}
