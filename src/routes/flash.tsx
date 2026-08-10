import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { HubHeader } from "@/components/hub/HubHeader";
import { SmartCard } from "@/components/ui-kit/SmartCard";
import { ScanWaves } from "@/components/scan/ScanWaves";
import { ScanReady } from "@/components/scan/ScanReady";
import { cn } from "@/lib/utils";
import {
  Zap,
  Wrench,
  Megaphone,
  Briefcase,
  Flame,
  ImagePlus,
  MapPin,
  Tag,
  Clock,
  Eye,
  Users,
  Rocket,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  Sparkles,
  ScanSearch,
  ArrowLeft,
  Radar as RadarIcon,
  Sliders,
  MessageCircle,
} from "lucide-react";
import {
  useFlashFeed,
  useMyFlashes,
  flashTitle,
  flashAge,
  composeFlashContent,
} from "@/domains/publication";
import { useProfile } from "@/domains/identity";


export const Route = createFileRoute("/flash")({
  head: () => ({ meta: [{ title: "Flash — Publish in seconds" }] }),
  component: FlashPage,
});

type FlashType = "sale" | "service" | "urgent" | "offer" | "promo";
type Mode = "home" | "scan-config" | "scanning" | "scan-ready" | "scan-results";

const TYPES: { id: FlashType; label: string; icon: typeof Zap; tint: string }[] = [
  { id: "sale", label: "Vente Flash", icon: Zap, tint: "var(--flash)" },
  { id: "service", label: "Service", icon: Wrench, tint: "var(--scan)" },
  { id: "urgent", label: "Urgence", icon: Megaphone, tint: "var(--live)" },
  { id: "offer", label: "Offre", icon: Briefcase, tint: "var(--radar)" },
  { id: "promo", label: "Promo", icon: Flame, tint: "var(--warning)" },
];

const DURATIONS = ["Flash 1h", "24h", "7 jours"] as const;

const RECENT = [
  { type: "sale", title: "iPhone 13 — état neuf", price: "420 €", where: "Lyon 7", time: "2 min" },
  { type: "service", title: "Cours de guitare à domicile", price: "25 €/h", where: "Paris 11", time: "8 min" },
  { type: "urgent", title: "Recherche garde chien ce soir", price: "—", where: "Bordeaux", time: "14 min" },
  { type: "promo", title: "-30% café torréfié maison", price: "9 €", where: "Marseille", time: "21 min" },
] as const;

const SCAN_RESULTS = [
  { title: "Électricien dispo ce soir", dist: "0.4 km", tag: "Service", tint: "var(--scan)", time: "il y a 3 min" },
  { title: "iPhone 15 Pro — vente flash", dist: "1.2 km", tag: "Vente", tint: "var(--flash)", time: "il y a 7 min" },
  { title: "Cherche graphiste freelance", dist: "2.1 km", tag: "Besoin", tint: "var(--radar)", time: "il y a 12 min" },
  { title: "Cours de yoga plein air", dist: "0.8 km", tag: "Service", tint: "var(--trust)", time: "il y a 22 min" },
  { title: "Livraison express dispo", dist: "1.6 km", tag: "Emploi", tint: "var(--success)", time: "il y a 31 min" },
];

function FlashPage() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("home");
  const [exiting, setExiting] = useState(false);
  const [scanRadius, setScanRadius] = useState(2);
  const [scanCat, setScanCat] = useState<"all" | "services" | "ventes" | "besoins">("all");
  const [urgent, setUrgent] = useState(false);

  const goScanConfig = () => {
    setExiting(true);
    setTimeout(() => {
      setMode("scan-config");
      setExiting(false);
    }, 380);
  };

  const launchScan = () => setMode("scanning");

  if (mode === "scanning") {
    return (
      <ScanWaves
        color="var(--scan)"
        title="Scan en cours…"
        subtitle={`Analyse des signaux dans un rayon de ${scanRadius} km`}
        onComplete={() => setMode("scan-ready")}
      />
    );
  }

  if (mode === "scan-ready") {
    return (
      <ScanReady
        color="var(--scan)"
        count={SCAN_RESULTS.length}
        subtitle={`${SCAN_RESULTS.length} opportunités détectées dans ${scanRadius} km.`}
        onView={() => setMode("scan-results")}
      />
    );
  }

  return (
    <AppShell>
      <div
        className={cn(
          "transition-all duration-300",
          exiting && "opacity-0 blur-sm scale-[0.98]",
        )}
      >
        {mode === "home" && (
          <div className="space-y-6 animate-[fade-up_0.5s_var(--ease-smooth)_both]">
            <HubHeader
              eyebrow="Flash"
              title="Publiez ou explorez en quelques secondes"
              description="Créez un Flash ou scannez les opportunités autour de vous."
              color="var(--flash)"
              icon={<Zap className="h-5 w-5" />}
            />

            <IntentCards onCreate={() => setOpen(true)} onScan={goScanConfig} />

            <MyFlashes />

            <RecentFlashes />
          </div>
        )}

        {mode === "scan-config" && (
          <ScanConfig
            radius={scanRadius}
            onRadius={setScanRadius}
            cat={scanCat}
            onCat={setScanCat}
            urgent={urgent}
            onUrgent={setUrgent}
            onBack={() => setMode("home")}
            onLaunch={launchScan}
          />
        )}

        {mode === "scan-results" && (
          <ScanResults
            radius={scanRadius}
            onBack={() => setMode("home")}
            onRescan={() => setMode("scan-config")}
          />
        )}
      </div>

      {open && <CreateSheet onClose={() => setOpen(false)} />}
    </AppShell>
  );
}

/* --------------------------- INTENT CARDS -------------------------- */

function IntentCards({ onCreate, onScan }: { onCreate: () => void; onScan: () => void }) {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <button
        onClick={onCreate}
        className="group relative overflow-hidden rounded-3xl p-5 text-left transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]"
        style={{
          background: "color-mix(in oklch, var(--flash) 12%, var(--surface-1))",
          boxShadow:
            "inset 0 0 0 1px color-mix(in oklch, var(--flash) 30%, transparent), 0 0 32px -12px var(--flash)",
        }}
      >
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-50 blur-2xl"
          style={{ background: "var(--gradient-flash)" }}
        />
        <div
          className="relative mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl"
          style={{
            background: "color-mix(in oklch, var(--flash) 22%, transparent)",
            color: "var(--flash)",
          }}
        >
          <Zap className="h-5 w-5" />
        </div>
        <p className="ds-eyebrow" style={{ color: "var(--flash)" }}>
          Publier
        </p>
        <h3 className="ds-title mt-1">Créer un Flash</h3>
        <p className="ds-body mt-1.5">
          Vente, service, urgence — en 2 étapes simples.
        </p>
        <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium" style={{ color: "var(--flash)" }}>
          Commencer <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </button>

      <button
        onClick={onScan}
        className="group relative overflow-hidden rounded-3xl p-5 text-left transition-all duration-300 hover:-translate-y-1 active:scale-[0.98]"
        style={{
          background: "color-mix(in oklch, var(--scan) 12%, var(--surface-1))",
          boxShadow:
            "inset 0 0 0 1px color-mix(in oklch, var(--scan) 30%, transparent), 0 0 32px -12px var(--scan)",
        }}
      >
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-50 blur-2xl"
          style={{ background: "var(--gradient-scan)" }}
        />
        <div
          className="relative mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl"
          style={{
            background: "color-mix(in oklch, var(--scan) 22%, transparent)",
            color: "var(--scan)",
          }}
        >
          <ScanSearch className="h-5 w-5" />
        </div>
        <p className="ds-eyebrow" style={{ color: "var(--scan)" }}>
          Explorer
        </p>
        <h3 className="ds-title mt-1">Scanner autour de vous</h3>
        <p className="ds-body mt-1.5">
          Détectez les opportunités live dans votre périmètre.
        </p>
        <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium" style={{ color: "var(--scan)" }}>
          Lancer un scan <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </button>
    </section>
  );
}

/* --------------------------- SCAN CONFIG --------------------------- */

function ScanConfig({
  radius,
  onRadius,
  cat,
  onCat,
  urgent,
  onUrgent,
  onBack,
  onLaunch,
}: {
  radius: number;
  onRadius: (n: number) => void;
  cat: "all" | "services" | "ventes" | "besoins";
  onCat: (c: "all" | "services" | "ventes" | "besoins") => void;
  urgent: boolean;
  onUrgent: (b: boolean) => void;
  onBack: () => void;
  onLaunch: () => void;
}) {
  const CATS = [
    { id: "all", label: "Tout" },
    { id: "services", label: "Services" },
    { id: "ventes", label: "Ventes" },
    { id: "besoins", label: "Besoins" },
  ] as const;

  return (
    <div className="space-y-6 animate-[fade-up_0.45s_var(--ease-smooth)_both]">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-xl transition hover:bg-white/5"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <p className="ds-eyebrow" style={{ color: "var(--scan)" }}>
            Scanner
          </p>
          <h2 className="ds-display">Configurer le scan</h2>
        </div>
      </div>

      <SmartCard glow="scan" className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-end justify-between">
            <label className="ds-eyebrow flex items-center gap-1.5">
              <MapPin className="h-3 w-3" /> Rayon
            </label>
            <span className="text-sm font-semibold" style={{ color: "var(--scan)" }}>
              {radius} km
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={radius}
            onChange={(e) => onRadius(Number(e.target.value))}
            className="w-full accent-[color:var(--scan)]"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>1 km</span>
            <span>20 km</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="ds-eyebrow flex items-center gap-1.5">
            <Sliders className="h-3 w-3" /> Catégorie
          </label>
          <div className="flex flex-wrap gap-1.5">
            {CATS.map((c) => {
              const active = cat === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => onCat(c.id)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                    active
                      ? "border-transparent text-foreground"
                      : "border-[var(--glass-border)] bg-white/[0.03] text-muted-foreground",
                  )}
                  style={
                    active
                      ? {
                          background: "color-mix(in oklch, var(--scan) 18%, transparent)",
                          boxShadow: "inset 0 0 0 1px var(--scan)",
                          color: "var(--scan)",
                        }
                      : undefined
                  }
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3.5 py-3">
          <div>
            <p className="text-sm font-medium">Urgences uniquement</p>
            <p className="text-[11px] text-muted-foreground">
              Filtrer les signaux à forte priorité
            </p>
          </div>
          <button
            onClick={() => onUrgent(!urgent)}
            className={cn("relative h-6 w-11 rounded-full transition-all", urgent ? "" : "bg-white/10")}
            style={urgent ? { background: "var(--gradient-scan)" } : undefined}
          >
            <span
              className={cn(
                "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
                urgent ? "left-[22px]" : "left-0.5",
              )}
            />
          </button>
        </div>
      </SmartCard>

      <button
        onClick={onLaunch}
        className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-[15px] font-semibold text-white transition-all active:scale-[0.98]"
        style={{
          background: "var(--gradient-scan)",
          boxShadow: "0 0 30px -8px var(--scan)",
        }}
      >
        <RadarIcon className="h-4 w-4" /> Lancer le scan
      </button>
      <p className="text-center text-[11px] text-muted-foreground">
        Le scan analyse l'écosystème pendant quelques secondes.
      </p>
    </div>
  );
}

/* --------------------------- SCAN RESULTS -------------------------- */

function ScanResults({
  radius,
  onBack,
  onRescan,
}: {
  radius: number;
  onBack: () => void;
  onRescan: () => void;
}) {
  return (
    <div className="space-y-5 animate-[fade-up_0.5s_var(--ease-smooth)_both]">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-xl transition hover:bg-white/5"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1">
          <p className="ds-eyebrow" style={{ color: "var(--scan)" }}>
            Scan terminé
          </p>
          <h2 className="ds-display">{SCAN_RESULTS.length} signaux détectés</h2>
        </div>
        <button
          onClick={onRescan}
          className="rounded-full px-3 py-1.5 text-xs font-medium"
          style={{
            background: "color-mix(in oklch, var(--scan) 18%, transparent)",
            color: "var(--scan)",
            boxShadow: "inset 0 0 0 1px color-mix(in oklch, var(--scan) 35%, transparent)",
          }}
        >
          Rescanner
        </button>
      </div>

      <div
        className="glass-surface flex items-center gap-3 rounded-2xl p-3.5"
        style={{ boxShadow: "var(--shadow-glass), 0 0 32px -16px var(--scan)" }}
      >
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{
            background: "color-mix(in oklch, var(--scan) 18%, transparent)",
            color: "var(--scan)",
          }}
        >
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="flex-1 text-xs">
          <p className="font-medium">Rayon analysé : {radius} km</p>
          <p className="text-muted-foreground">
            Classés par proximité et fraîcheur.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {SCAN_RESULTS.map((r, i) => (
          <div
            key={i}
            style={{ animation: `fade-up 0.4s var(--ease-smooth) ${i * 70}ms both` }}
          >
            <SmartCard className="p-3.5">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                  style={{
                    background: `color-mix(in oklch, ${r.tint} 18%, transparent)`,
                    color: r.tint,
                    boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${r.tint} 30%, transparent)`,
                  }}
                >
                  <RadarIcon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                      style={{
                        background: `color-mix(in oklch, ${r.tint} 18%, transparent)`,
                        color: r.tint,
                      }}
                    >
                      {r.tag}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {r.time}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-sm font-semibold">
                    {r.title}
                  </p>
                  <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {r.dist}
                  </p>
                </div>
                <button
                  className="rounded-lg p-2 transition hover:bg-white/5"
                  aria-label="Contacter"
                >
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </SmartCard>
          </div>
        ))}
      </div>
    </div>
  );
}


/* --------------------------- MY FLASHES -------------------------- */

const MINE = [
  { type: "sale", title: "Casque Sony WH-1000XM4", status: "Actif", color: "var(--success)", views: 124, msgs: 8, time: "il y a 1 h" },
  { type: "service", title: "Coaching sportif à domicile", status: "En attente", color: "var(--warning)", views: 47, msgs: 2, time: "il y a 3 h" },
  { type: "promo", title: "Pâtisseries maison · -20%", status: "Expiré", color: "var(--muted-foreground)", views: 312, msgs: 14, time: "hier" },
] as const;

function MyFlashes() {
  const { flashes, loading } = useMyFlashes();
  const lookup = (k: string | null) => TYPES.find((t) => t.id === k) ?? TYPES[0];

  if (loading) {
    return (
      <section className="space-y-2">
        <h3 className="px-1 text-sm font-medium text-muted-foreground">Mes flashs</h3>
        <div className="glass-surface space-y-3 rounded-2xl p-3.5">
          {[0, 1].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-overlay" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-2/3 animate-pulse rounded bg-overlay" />
                <div className="h-2.5 w-1/3 animate-pulse rounded bg-overlay" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (flashes.length === 0) {
    return (
      <section className="space-y-2">
        <h3 className="px-1 text-sm font-medium text-muted-foreground">Mes flashs</h3>
        <SmartCard className="flex flex-col items-center gap-2 p-6 text-center">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: "color-mix(in oklch, var(--flash) 18%, transparent)", color: "var(--flash)" }}
          >
            <Zap className="h-4 w-4" />
          </span>
          <p className="text-sm font-medium">Rien de publié pour l'instant</p>
          <p className="max-w-[26ch] text-xs text-muted-foreground">
            Ton premier Flash prend 10 secondes. Le quartier attend.
          </p>
        </SmartCard>
      </section>
    );
  }

  return (
    <section className="space-y-2">
      <div className="flex items-end justify-between px-1">
        <h3 className="text-sm font-medium text-muted-foreground">Mes flashs</h3>
        <span className="text-[11px] text-muted-foreground/70">{flashes.length} publié{flashes.length > 1 ? "s" : ""}</span>
      </div>
      <div className="glass-surface overflow-hidden rounded-2xl">
        {flashes.map((m, i) => {
          const t = lookup(m.category);
          const Icon = t.icon;
          return (
            <div
              key={m.id}
              className="flex items-center gap-3 px-3 py-2.5"
              style={i < flashes.length - 1 ? { borderBottom: "1px solid var(--glass-border)" } : undefined}
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{
                  background: `color-mix(in oklch, ${t.tint} 18%, transparent)`,
                  color: t.tint,
                }}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{flashTitle(m.content)}</p>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
                  <span style={{ color: m.pending ? "var(--warning)" : "var(--success)" }}>
                    ● {m.pending ? "En attente de sync" : "En ligne"}
                  </span>
                  {m.neighborhood && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {m.neighborhood}
                    </span>
                  )}
                  <span className="ml-auto">{flashAge(m.createdAt)}</span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </div>
          );
        })}
      </div>
    </section>
  );
}


/* ----------------------------- HERO ----------------------------- */

function FlashHero({ onCreate }: { onCreate: () => void }) {
  return (
    <SmartCard glow="flash" className="relative overflow-hidden p-6">
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full opacity-40 blur-2xl"
        style={{ background: "var(--gradient-flash)" }}
      />
      <div className="relative space-y-4">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--glass-border)] bg-white/5 px-2.5 py-1 text-[11px] text-muted-foreground">
          <Sparkles className="h-3 w-3" style={{ color: "var(--flash)" }} />
          ~10 secondes pour publier
        </div>
        <h2 className="text-2xl font-semibold leading-tight">
          Créer une publication <span className="text-gradient-primary">Flash</span>
        </h2>
        <p className="text-sm text-muted-foreground">
          Publiez une offre, un service ou une urgence en quelques secondes.
        </p>
        <button
          onClick={onCreate}
          className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[15px] font-semibold text-[oklch(0.18_0.02_60)] transition-transform active:scale-[0.98]"
          style={{ background: "var(--gradient-flash)", boxShadow: "var(--shadow-glow-flash)" }}
        >
          <Zap className="h-4 w-4" /> Créer un Flash
        </button>
      </div>
    </SmartCard>
  );
}

/* -------------------------- TYPE SELECTOR ------------------------ */

function QuickTypes({ onPick }: { onPick: (t: FlashType) => void }) {
  return (
    <section className="space-y-2">
      <h3 className="px-1 text-sm font-medium text-muted-foreground">Quel type ?</h3>
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none">
        {TYPES.map((t) => (
          <button
            key={t.id}
            onClick={() => onPick(t.id)}
            className="glass-surface group flex shrink-0 items-center gap-2 rounded-2xl px-3.5 py-2.5 transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
          >
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full"
              style={{
                background: `color-mix(in oklch, ${t.tint} 22%, transparent)`,
                color: t.tint,
              }}
            >
              <t.icon className="h-3.5 w-3.5" />
            </span>
            <span className="text-sm font-medium">{t.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

/* -------------------------- RECENT FLASHES ----------------------- */

function RecentFlashes() {
  const { flashes, loading } = useFlashFeed(6);
  const lookup = (k: string | null) => TYPES.find((t) => t.id === k) ?? TYPES[0];

  return (
    <section className="space-y-2">
      <div className="flex items-end justify-between px-1">
        <h3 className="text-sm font-medium text-muted-foreground">Dans ton quartier</h3>
        <span className="text-[11px] text-muted-foreground/70">
          {loading ? "Chargement…" : "Mises à jour live"}
        </span>
      </div>

      {loading && (
        <div className="grid grid-cols-1 gap-2">
          {[0, 1, 2].map((i) => (
            <SmartCard key={i} className="flex items-center gap-3 p-3.5">
              <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-overlay" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/2 animate-pulse rounded bg-overlay" />
                <div className="h-2.5 w-1/3 animate-pulse rounded bg-overlay" />
              </div>
            </SmartCard>
          ))}
        </div>
      )}

      {!loading && flashes.length === 0 && (
        <SmartCard className="flex flex-col items-center gap-2 p-6 text-center">
          <p className="text-sm font-medium">Le quartier est calme</p>
          <p className="max-w-[30ch] text-xs text-muted-foreground">
            Aucun Flash pour l'instant. Ouvre le bal, les voisins suivront.
          </p>
        </SmartCard>
      )}

      {!loading && flashes.length > 0 && (
        <div className="grid grid-cols-1 gap-2">
          {flashes.map((r) => {
            const t = lookup(r.category);
            const Icon = t.icon;
            const place = r.neighborhood ?? r.city;
            return (
              <SmartCard key={r.id} className="p-3.5">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: `color-mix(in oklch, ${t.tint} 22%, transparent)`,
                      color: t.tint,
                    }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="rounded-full px-1.5 py-0.5 text-[10px] font-medium"
                        style={{
                          background: `color-mix(in oklch, ${t.tint} 16%, transparent)`,
                          color: t.tint,
                        }}
                      >
                        {t.label}
                      </span>
                      <span className="text-[11px] text-muted-foreground">{flashAge(r.createdAt)}</span>
                    </div>
                    <p className="truncate text-sm font-medium">{flashTitle(r.content)}</p>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                      {place && (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {place}
                        </span>
                      )}
                      {r.author && (
                        <span className="inline-flex items-center gap-1 truncate">
                          <Users className="h-3 w-3" />
                          {r.author.displayName}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </div>
              </SmartCard>
            );
          })}
        </div>
      )}
    </section>
  );
}


/* ============================ CREATE SHEET ========================== */

function CreateSheet({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<1 | 2>(1);
  const [type, setType] = useState<FlashType>("sale");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("Général");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("Lyon 7");
  const [duration, setDuration] = useState<(typeof DURATIONS)[number]>("24h");
  const [visibility, setVisibility] = useState<"public" | "limited">("public");
  const [boost, setBoost] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const t = useMemo(() => TYPES.find((x) => x.id === type)!, [type]);
  const canNext = title.trim().length > 1;

  const onUpload = (file?: File) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImage(url);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm animate-[fade-up_0.25s_var(--ease-smooth)_both]">
      <div
        className="glass-surface relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl p-5 pb-8 animate-[scale-in_0.35s_var(--ease-spring)_both]"
        style={{ boxShadow: "var(--shadow-float)" }}
      >
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="rounded-full p-1.5 hover:bg-white/5"
                aria-label="Back"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                Étape {step} / 2
              </p>
              <h3 className="text-base font-semibold">
                {step === 1 ? "Décris ton Flash" : "Détails & publication"}
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 hover:bg-white/5" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Stepper */}
        <div className="mb-5 flex gap-1.5">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={cn(
                "h-1 flex-1 rounded-full transition-all",
                s <= step ? "" : "bg-white/8"
              )}
              style={s <= step ? { background: "var(--gradient-flash)" } : undefined}
            />
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4 animate-[fade-up_0.3s_var(--ease-smooth)_both]">
            <div className="grid grid-cols-5 gap-1.5">
              {TYPES.map((opt) => {
                const active = opt.id === type;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setType(opt.id)}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-xl border px-1 py-2 text-[10px] transition-all",
                      active
                        ? "border-transparent text-foreground"
                        : "border-[var(--glass-border)] bg-white/[0.03] text-muted-foreground hover:text-foreground"
                    )}
                    style={
                      active
                        ? {
                            background: `color-mix(in oklch, ${opt.tint} 18%, transparent)`,
                            boxShadow: `0 0 0 1px ${opt.tint} inset`,
                          }
                        : undefined
                    }
                  >
                    <Icon className="h-4 w-4" style={active ? { color: opt.tint } : undefined} />
                    <span className="leading-tight">{opt.label.split(" ")[0]}</span>
                  </button>
                );
              })}
            </div>

            <Field label="Titre">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex : Vélo électrique état neuf"
                className="w-full bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
              />
            </Field>

            <Field label="Description courte">
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={3}
                placeholder="Une ligne suffit. Sois clair et direct."
                className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </Field>

            <Field label="Catégorie">
              <div className="flex flex-wrap gap-1.5">
                {["Général", "Maison", "Tech", "Mode", "Loisirs", "Pro"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs transition-all",
                      category === c
                        ? "border-transparent text-foreground"
                        : "border-[var(--glass-border)] bg-white/[0.03] text-muted-foreground"
                    )}
                    style={
                      category === c
                        ? {
                            background: `color-mix(in oklch, ${t.tint} 18%, transparent)`,
                            boxShadow: `0 0 0 1px ${t.tint} inset`,
                          }
                        : undefined
                    }
                  >
                    {c}
                  </button>
                ))}
              </div>
            </Field>

            <MediaUpload image={image} onUpload={onUpload} onClear={() => setImage(null)} />

            <button
              disabled={!canNext}
              onClick={() => setStep(2)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[15px] font-semibold text-[oklch(0.18_0.02_60)] transition-all active:scale-[0.98] disabled:opacity-40"
              style={{ background: "var(--gradient-flash)", boxShadow: canNext ? "var(--shadow-glow-flash)" : undefined }}
            >
              Continuer <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4 animate-[fade-up_0.3s_var(--ease-smooth)_both]">
            <PreviewCard
              type={t}
              title={title || "Ton titre apparaît ici"}
              price={price}
              where={location}
              image={image}
            />

            <div className="grid grid-cols-2 gap-2">
              <Field label="Prix (optionnel)" icon={<Tag className="h-3.5 w-3.5" />}>
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="—"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </Field>
              <Field label="Localisation" icon={<MapPin className="h-3.5 w-3.5" />}>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                />
              </Field>
            </div>

            <Field label="Durée de publication" icon={<Clock className="h-3.5 w-3.5" />}>
              <div className="flex gap-1.5 pt-1">
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={cn(
                      "flex-1 rounded-xl border px-2 py-2 text-xs font-medium transition-all",
                      duration === d
                        ? "border-transparent text-foreground"
                        : "border-[var(--glass-border)] bg-white/[0.03] text-muted-foreground"
                    )}
                    style={
                      duration === d
                        ? {
                            background: `color-mix(in oklch, ${t.tint} 18%, transparent)`,
                            boxShadow: `0 0 0 1px ${t.tint} inset`,
                          }
                        : undefined
                    }
                  >
                    {d}
                  </button>
                ))}
              </div>
            </Field>

            <div className="space-y-2">
              <OptionRow
                icon={<Eye className="h-4 w-4" />}
                title="Visibilité"
                description={visibility === "public" ? "Visible par tous" : "Cercle limité"}
              >
                <Toggle
                  options={[
                    { id: "public", label: "Public", icon: <Users className="h-3 w-3" /> },
                    { id: "limited", label: "Limité", icon: <Eye className="h-3 w-3" /> },
                  ]}
                  value={visibility}
                  onChange={(v) => setVisibility(v as typeof visibility)}
                  tint={t.tint}
                />
              </OptionRow>

              <OptionRow
                icon={<Rocket className="h-4 w-4" />}
                title="Boost (mock)"
                description={boost ? "Mise en avant 3×" : "Diffusion standard"}
              >
                <button
                  onClick={() => setBoost((b) => !b)}
                  className={cn(
                    "relative h-6 w-11 rounded-full transition-all",
                    boost ? "" : "bg-white/10"
                  )}
                  style={boost ? { background: "var(--gradient-flash)" } : undefined}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
                      boost ? "left-[22px]" : "left-0.5"
                    )}
                  />
                </button>
              </OptionRow>
            </div>

            <button
              onClick={onPublish}
              disabled={publishing}
              className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[15px] font-semibold text-[oklch(0.18_0.02_60)] transition-all active:scale-[0.98] disabled:opacity-50"
              style={{ background: "var(--gradient-flash)", boxShadow: "var(--shadow-glow-flash)" }}
            >
              <Check className="h-4 w-4" /> {publishing ? "Publication…" : "Publier le Flash"}
            </button>
            <p className="text-center text-[11px] text-muted-foreground">
              {publishError
                ? publishError
                : profile
                  ? "Publié même hors ligne — la synchro se fait toute seule."
                  : "Connecte-toi pour publier dans ton quartier."}
            </p>

          </div>
        )}
      </div>
    </div>
  );
}

/* ----------------------- Reusable form bits ----------------------- */

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 flex items-center gap-1.5 px-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="glass-surface rounded-xl px-3.5 py-2.5">{children}</div>
    </label>
  );
}

function MediaUpload({
  image,
  onUpload,
  onClear,
}: {
  image: string | null;
  onUpload: (f?: File) => void;
  onClear: () => void;
}) {
  return (
    <div>
      <div className="mb-1.5 px-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        Média (optionnel)
      </div>
      {image ? (
        <div className="relative overflow-hidden rounded-xl border border-[var(--glass-border)]">
          <img src={image} alt="preview" className="h-40 w-full object-cover" />
          <button
            onClick={onClear}
            className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 backdrop-blur"
            aria-label="Remove image"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <label className="glass-surface flex h-28 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-dashed text-muted-foreground transition-colors hover:text-foreground">
          <ImagePlus className="h-5 w-5" />
          <span className="text-xs">Glisse une image ou tape pour choisir</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onUpload(e.target.files?.[0])}
          />
        </label>
      )}
    </div>
  );
}

function PreviewCard({
  type,
  title,
  price,
  where,
  image,
}: {
  type: (typeof TYPES)[number];
  title: string;
  price: string;
  where: string;
  image: string | null;
}) {
  const Icon = type.icon;
  return (
    <div className="space-y-1.5">
      <div className="px-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        Aperçu live
      </div>
      <SmartCard className="overflow-hidden p-0">
        {image && <img src={image} alt="" className="h-32 w-full object-cover" />}
        <div className="space-y-2 p-3.5">
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{
                background: `color-mix(in oklch, ${type.tint} 22%, transparent)`,
                color: type.tint,
              }}
            >
              <Icon className="h-3 w-3" /> {type.label}
            </span>
            <span className="text-[11px] text-muted-foreground">à l'instant</span>
          </div>
          <p className="line-clamp-2 text-[15px] font-semibold leading-snug">{title}</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{where}</span>
            {price && (
              <span className="font-semibold text-foreground">{price}{/[€$£]/.test(price) ? "" : " €"}</span>
            )}
          </div>
        </div>
      </SmartCard>
    </div>
  );
}

function OptionRow({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-surface flex items-center gap-3 rounded-xl px-3.5 py-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-muted-foreground">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="truncate text-[11px] text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}

function Toggle({
  options,
  value,
  onChange,
  tint,
}: {
  options: { id: string; label: string; icon?: React.ReactNode }[];
  value: string;
  onChange: (v: string) => void;
  tint: string;
}) {
  return (
    <div className="flex rounded-full bg-white/5 p-0.5">
      {options.map((o) => {
        const active = o.id === value;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={cn(
              "flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all",
              active ? "text-foreground" : "text-muted-foreground"
            )}
            style={
              active
                ? {
                    background: `color-mix(in oklch, ${tint} 22%, transparent)`,
                    boxShadow: `0 0 0 1px ${tint} inset`,
                  }
                : undefined
            }
          >
            {o.icon}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
