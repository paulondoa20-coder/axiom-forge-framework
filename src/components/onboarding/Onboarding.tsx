import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Zap, Radar, ScanSearch, ShieldCheck, ArrowRight, X, Sparkles, Compass, Mic, Check, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { DSButton, DSCard, Eyebrow, Display, Body, Caption, Pill, Title } from "@/components/ds";

const STORAGE_KEY = "vitala.onboarding.done.v1";
const GOAL_KEY = "vitala.onboarding.goal.v1";

type GoalId = "discover" | "publish" | "express" | "verify";

type Goal = {
  id: GoalId;
  label: string;
  tagline: string;
  icon: typeof Zap;
  color: string;
  hubLabel: string;
  hubIcon: typeof Zap;
  route: "/radar" | "/flash" | "/scan";
  cta: string;
  assistantIntro: string;
  example: string;
  hint: string;
};

const GOALS: Goal[] = [
  {
    id: "discover",
    label: "Découvrir",
    tagline: "Trouver des gens, lieux ou opportunités",
    icon: Compass,
    color: "var(--radar)",
    hubLabel: "Radar",
    hubIcon: Radar,
    route: "/radar",
    cta: "Ouvrir le Radar",
    assistantIntro: "Parfait. Le Radar capte ton intention et te propose des matchs.",
    example: "« Je cherche un mentor en design produit à Paris »",
    hint: "Exprime une intention — l'IA fait le tri.",
  },
  {
    id: "publish",
    label: "Publier",
    tagline: "Partager un moment en direct",
    icon: Zap,
    color: "var(--flash)",
    hubLabel: "Flash",
    hubIcon: Zap,
    route: "/flash",
    cta: "Créer un Flash",
    assistantIntro: "Top. Flash est fait pour partager l'instant — éphémère et vivant.",
    example: "« Café spontané ce soir, qui me rejoint ? »",
    hint: "Capture un moment, ajoute un lieu, publie.",
  },
  {
    id: "express",
    label: "Exprimer",
    tagline: "Formuler ce que tu cherches vraiment",
    icon: Mic,
    color: "var(--radar)",
    hubLabel: "Radar",
    hubIcon: Radar,
    route: "/radar",
    cta: "Activer la voix",
    assistantIntro: "Dis-le simplement. Je reformule ton besoin pour le Radar.",
    example: "« J'aimerais rencontrer quelqu'un qui m'inspire »",
    hint: "Parle naturellement — pas besoin de mots-clés.",
  },
  {
    id: "verify",
    label: "Vérifier",
    tagline: "Confirmer une identité ou un contenu",
    icon: ScanSearch,
    color: "var(--scan)",
    hubLabel: "Scan",
    hubIcon: ScanSearch,
    route: "/scan",
    cta: "Lancer un Scan",
    assistantIntro: "Le Scan vérifie identité, contenu et augmente ton score Trust.",
    example: "Scanne un profil ou une image pour authentifier.",
    hint: "Plus tu vérifies, plus ton Trust grimpe.",
  },
];

const HUBS = [
  { icon: Zap, color: "var(--flash)", label: "Flash" },
  { icon: Radar, color: "var(--radar)", label: "Radar" },
  { icon: ScanSearch, color: "var(--scan)", label: "Scan" },
  { icon: ShieldCheck, color: "var(--trust)", label: "Trust" },
];

export function Onboarding() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [goalId, setGoalId] = useState<GoalId | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) {
      const t = setTimeout(() => setOpen(true), 400);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      setStep(0);
      setGoalId(null);
      setOpen(true);
    };
    window.addEventListener("open-onboarding", handler);
    return () => window.removeEventListener("open-onboarding", handler);
  }, []);

  const close = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    if (goalId) localStorage.setItem(GOAL_KEY, goalId);
    setOpen(false);
  };

  const goal = useMemo(() => GOALS.find((g) => g.id === goalId) ?? null, [goalId]);
  const accent = goal?.color ?? "var(--scan)";
  const isLast = step === 2;

  const next = () => {
    if (step === 0) return setStep(1);
    if (step === 1) {
      if (!goalId) return;
      return setStep(2);
    }
    close();
    navigate({ to: goal?.route ?? "/radar" });
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center animate-[fade-up_0.3s_var(--ease-smooth)_both]"
      style={{ background: "color-mix(in oklch, var(--background) 72%, transparent)", backdropFilter: "blur(10px)" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="onb-title"
    >
      <div
        className="glass-surface relative w-full max-w-md rounded-3xl overflow-hidden animate-[scale-in_0.35s_var(--ease-spring)_both]"
        style={{ boxShadow: "0 30px 80px -20px rgba(0,0,0,0.5)" }}
      >
        <button
          onClick={close}
          aria-label="Passer l'introduction"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-white/8 transition focus-visible:ds-focus-ring"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div
          className="px-6 pt-7 pb-5 transition-all duration-500"
          style={{
            background: `radial-gradient(circle at 30% 0%, color-mix(in oklch, ${accent} 24%, transparent), transparent 62%)`,
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-xl transition-all"
              style={{
                background: `color-mix(in oklch, ${accent} 22%, transparent)`,
                boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${accent} 42%, transparent)`,
              }}
            >
              <Sparkles className="h-3.5 w-3.5" style={{ color: accent }} />
            </span>
            <Eyebrow accent={accent}>
              {step === 0 ? "Bienvenue" : step === 1 ? "Ton objectif" : "Confirmation"}
            </Eyebrow>
          </div>
          <Display id="onb-title" className="mt-3">
            {step === 0
              ? "Découvre VITALA"
              : step === 1
                ? "Que veux-tu faire ?"
                : goal
                  ? `Cap sur ${goal.hubLabel}`
                  : "Lance-toi"}
          </Display>
          <Body className="mt-2">
            {step === 0
              ? "4 hubs, une intention. Choisis ton objectif et l'assistant te guide étape par étape."
              : step === 1
                ? "Choisis ce qui te parle le plus. Tu pourras changer à tout moment."
                : (goal?.assistantIntro ?? "")}
          </Body>
        </div>

        {/* Body */}
        <div className="px-6 pb-5 min-h-[200px]">
          {step === 0 && (
            <div className="grid grid-cols-2 gap-2">
              {HUBS.map((h) => {
                const I = h.icon;
                return (
                  <DSCard key={h.label} variant="hub" hubColor={h.color} padding="sm" className="flex items-center gap-2">
                    <I className="h-4 w-4 shrink-0" style={{ color: h.color }} />
                    <span className="text-sm font-medium">{h.label}</span>
                  </DSCard>
                );
              })}
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Choisis ton objectif">
              {GOALS.map((g) => {
                const I = g.icon;
                const active = goalId === g.id;
                return (
                  <button
                    key={g.id}
                    role="radio"
                    aria-checked={active}
                    onClick={() => setGoalId(g.id)}
                    className={cn(
                      "relative flex flex-col items-start gap-1.5 rounded-2xl px-3 py-3 text-left transition-all duration-200",
                      "active:scale-[0.98] focus-visible:ds-focus-ring",
                    )}
                    style={{
                      background: `color-mix(in oklch, ${g.color} ${active ? 18 : 8}%, transparent)`,
                      boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${g.color} ${active ? 52 : 20}%, transparent)${active ? `, 0 0 22px -8px ${g.color}` : ""}`,
                    }}
                  >
                    {active && (
                      <span
                        className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full animate-[scale-in_0.2s_var(--ease-spring)_both]"
                        style={{ background: g.color, color: "var(--background)" }}
                      >
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                    )}
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-xl"
                      style={{
                        background: `color-mix(in oklch, ${g.color} 22%, transparent)`,
                        boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${g.color} 40%, transparent)`,
                      }}
                    >
                      <I className="h-4 w-4" style={{ color: g.color }} />
                    </span>
                    <Title className="text-sm">{g.label}</Title>
                    <Caption className="leading-tight">{g.tagline}</Caption>
                  </button>
                );
              })}
            </div>
          )}

          {step === 2 && goal && (
            <div className="ds-stack-sm">
              <DSCard variant="hub" hubColor={goal.color} padding="md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <goal.icon className="h-4 w-4" style={{ color: goal.color }} />
                    <Title className="text-sm">{goal.label}</Title>
                  </div>
                  <Pill color={goal.color}>
                    <goal.hubIcon className="h-2.5 w-2.5" />
                    Hub {goal.hubLabel}
                  </Pill>
                </div>
                <Caption className="mt-2 italic">{goal.example}</Caption>
              </DSCard>
              <div className="flex items-start gap-2 px-1">
                <Sparkles className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: goal.color }} />
                <Caption>{goal.hint}</Caption>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-white/8 px-6 py-4">
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={cn("h-1.5 rounded-full transition-all duration-300", i === step ? "w-6" : "w-1.5")}
                style={{
                  background: i === step ? accent : "color-mix(in oklch, var(--foreground) 18%, transparent)",
                  boxShadow: i === step ? `0 0 10px ${accent}` : undefined,
                }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            {!isLast && (
              <DSButton variant="ghost" size="sm" onClick={close}>
                Passer
              </DSButton>
            )}
            <DSButton
              variant={isLast ? "hub" : "primary"}
              hubColor={accent}
              onClick={next}
              disabled={step === 1 && !goalId}
              iconRight={
                isLast ? <Send className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              }
            >
              {isLast ? (goal?.cta ?? "Commencer") : "Continuer"}
            </DSButton>
          </div>
        </div>
      </div>
    </div>
  );
}
