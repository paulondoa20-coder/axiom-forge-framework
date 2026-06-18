import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { HubHeader } from "@/components/hub/HubHeader";
import { SmartCard } from "@/components/ui-kit/SmartCard";
import { TrustBadge } from "@/components/ui-kit/TrustBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  UserRound,
  BadgeCheck,
  ShieldCheck,
  Pencil,
  Zap,
  Radar,
  ScanSearch,
  Settings,
  Lock,
  Bell,
  Eye,
  ChevronRight,
  Sparkles,
  Activity,
  TrendingUp,
  MessageCircle,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profil — VITALA" },
      { name: "description", content: "Votre identité, vos actions, votre confiance." },
    ],
  }),
  component: ProfilePage,
});

const USER = {
  name: "Sophie Lambert",
  handle: "@sophie.l",
  city: "Lyon, FR",
  status: "Confirmé" as "Enregistré" | "Confirmé" | "Pro",
  activity: 72,
  trust: 88,
  completion: 80,
};

const STATS = [
  { label: "Flash", value: 14, icon: Zap, color: "var(--flash)" },
  { label: "Radar", value: 6, icon: Radar, color: "var(--radar)" },
  { label: "Scan", value: 23, icon: ScanSearch, color: "var(--scan)" },
  { label: "Trust", value: 88, icon: ShieldCheck, color: "var(--trust)" },
];

const LEVELS = [
  { key: "consultant", label: "Consultant", desc: "Lecture seule" },
  { key: "registered", label: "Enregistré", desc: "Peut publier" },
  { key: "confirmed", label: "Confirmé", desc: "Identité vérifiée" },
  { key: "pro", label: "Pro", desc: "Activité régulière" },
];

const ACTIVITY = [
  { icon: Zap, color: "var(--flash)", title: "Vente Flash — Vélo urbain", meta: "Il y a 2 h", tag: "Publié" },
  { icon: Radar, color: "var(--radar)", title: "Besoin — Cours de guitare", meta: "Hier", tag: "Actif" },
  { icon: MessageCircle, color: "var(--scan)", title: "Réponse à Marc D.", meta: "Hier", tag: "Échange" },
  { icon: CheckCircle2, color: "var(--trust)", title: "Vérification email", meta: "3 jours", tag: "Validé" },
  { icon: ScanSearch, color: "var(--scan)", title: "A consulté 4 services", meta: "Cette semaine", tag: "Découverte" },
];

const TRUST_ITEMS = [
  { label: "Identité", value: 100 },
  { label: "Transparence", value: 92 },
  { label: "Fiabilité", value: 85 },
];

const QUICK_ACTIONS = [
  { to: "/flash", label: "Publier Flash", icon: Zap, color: "var(--flash)" },
  { to: "/radar", label: "Créer besoin", icon: Radar, color: "var(--radar)" },
  { to: "/scan", label: "Explorer", icon: ScanSearch, color: "var(--scan)" },
  { to: "/trust", label: "Trust Hub", icon: ShieldCheck, color: "var(--trust)" },
] as const;

const SETTINGS = [
  { icon: Pencil, label: "Modifier profil" },
  { icon: Lock, label: "Confidentialité" },
  { icon: Bell, label: "Préférences" },
  { icon: Eye, label: "Sécurité" },
];

function ProfilePage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <HubHeader
          eyebrow="Profil"
          title="Votre espace"
          description="Identité, activité et confiance — en un coup d'œil."
          color="var(--primary)"
          icon={<UserRound className="h-5 w-5" />}
        />

        {/* HERO */}
        <SmartCard className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="relative">
              <Avatar className="h-16 w-16 ring-2 ring-[color-mix(in_oklch,var(--primary)_40%,transparent)]">
                <AvatarImage src="" alt={USER.name} />
                <AvatarFallback className="bg-gradient-to-br from-[var(--primary)]/40 to-[var(--scan)]/40 text-base font-semibold">
                  SL
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--trust)] ring-2 ring-background">
                <BadgeCheck className="h-3 w-3 text-background" />
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold leading-tight">{USER.name}</h2>
                <TrustBadge score={USER.trust} />
              </div>
              <p className="text-xs text-muted-foreground">
                {USER.handle} · {USER.city}
              </p>
              <span
                className="mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={{
                  background: "color-mix(in oklch, var(--trust) 15%, transparent)",
                  color: "var(--trust)",
                  border: "1px solid color-mix(in oklch, var(--trust) 30%, transparent)",
                }}
              >
                <BadgeCheck className="h-3 w-3" /> {USER.status}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Niveau d'activité</span>
              <span className="font-medium text-foreground">{USER.activity}%</span>
            </div>
            <Progress value={USER.activity} className="h-1.5 bg-white/5" />
          </div>

          <div className="flex gap-2">
            <Button size="sm" className="flex-1 rounded-xl">
              <Pencil className="h-3.5 w-3.5" /> Modifier profil
            </Button>
            <Button asChild size="sm" variant="outline" className="flex-1 rounded-xl border-white/10">
              <Link to="/trust">
                <ShieldCheck className="h-3.5 w-3.5" /> Trust Space
              </Link>
            </Button>
          </div>
        </SmartCard>

        {/* ONBOARDING */}
        {USER.completion < 100 && (
          <SmartCard className="border border-[color-mix(in_oklch,var(--primary)_25%,transparent)]">
            <div className="flex items-start gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ background: "color-mix(in oklch, var(--primary) 18%, transparent)", color: "var(--primary)" }}
              >
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-2">
                <div>
                  <p className="text-sm font-medium">Complétez votre profil</p>
                  <p className="text-xs text-muted-foreground">
                    Débloquez toutes les fonctionnalités VITALA.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={USER.completion} className="h-1.5 flex-1 bg-white/5" />
                  <span className="text-[11px] font-medium" style={{ color: "var(--primary)" }}>
                    {USER.completion}%
                  </span>
                </div>
              </div>
            </div>
          </SmartCard>
        )}

        {/* QUICK STATS */}
        <section className="space-y-2">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Aperçu
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="glass-surface flex flex-col items-center gap-1 rounded-2xl p-3"
              >
                <s.icon className="h-4 w-4" style={{ color: s.color }} />
                <span className="text-base font-semibold leading-none">{s.value}</span>
                <span className="text-[10px] text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* STATUS SYSTEM */}
        <section className="space-y-2">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Statut utilisateur
          </h3>
          <SmartCard className="space-y-3">
            <div className="grid grid-cols-4 gap-1.5">
              {LEVELS.map((lvl, i) => {
                const active = lvl.label === USER.status;
                const reached = i <= LEVELS.findIndex((l) => l.label === USER.status);
                return (
                  <div
                    key={lvl.key}
                    className="flex flex-col items-center gap-1.5 text-center"
                  >
                    <div
                      className="h-1 w-full rounded-full"
                      style={{
                        background: reached
                          ? "var(--trust)"
                          : "color-mix(in oklch, var(--foreground) 10%, transparent)",
                      }}
                    />
                    <span
                      className={`text-[10px] font-medium ${active ? "" : "text-muted-foreground"}`}
                      style={active ? { color: "var(--trust)" } : undefined}
                    >
                      {lvl.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">Confirmé</span> — Identité vérifiée.
              Continuez à publier régulièrement pour passer au statut Pro.
            </p>
          </SmartCard>
        </section>

        {/* TRUST SNAPSHOT */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Aperçu Trust
            </h3>
            <Link to="/trust" className="text-[11px] font-medium" style={{ color: "var(--trust)" }}>
              Voir tout →
            </Link>
          </div>
          <SmartCard glow="trust" className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{
                    background: "color-mix(in oklch, var(--trust) 18%, transparent)",
                    color: "var(--trust)",
                  }}
                >
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Confiance générale</p>
                  <p className="text-[11px] text-muted-foreground">Profil vérifié & transparent</p>
                </div>
              </div>
              <span className="text-2xl font-semibold" style={{ color: "var(--trust)" }}>
                {USER.trust}
              </span>
            </div>
            <div className="space-y-2">
              {TRUST_ITEMS.map((t) => (
                <div key={t.label} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground">{t.label}</span>
                    <span className="font-medium">{t.value}%</span>
                  </div>
                  <Progress value={t.value} className="h-1 bg-white/5" />
                </div>
              ))}
            </div>
            <Button asChild variant="outline" size="sm" className="w-full rounded-xl border-white/10">
              <Link to="/trust">
                Voir Trust Hub complet <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </SmartCard>
        </section>

        {/* ACTIVITY SUMMARY */}
        <section className="space-y-2">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Activité récente
          </h3>
          <SmartCard className="divide-y divide-white/5 p-0">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background: `color-mix(in oklch, ${a.color} 15%, transparent)`,
                    color: a.color,
                  }}
                >
                  <a.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{a.title}</p>
                  <p className="text-[11px] text-muted-foreground">{a.meta}</p>
                </div>
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-muted-foreground">
                  {a.tag}
                </span>
              </div>
            ))}
          </SmartCard>
        </section>

        {/* QUICK ACTIONS */}
        <section className="space-y-2">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Actions rapides
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_ACTIONS.map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className="glass-surface group flex items-center gap-2.5 rounded-2xl p-3 transition-all hover:-translate-y-0.5"
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{
                    background: `color-mix(in oklch, ${a.color} 18%, transparent)`,
                    color: a.color,
                  }}
                >
                  <a.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{a.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* SETTINGS PREVIEW */}
        <section className="space-y-2">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Paramètres
          </h3>
          <SmartCard className="divide-y divide-white/5 p-0">
            {SETTINGS.map((s) => (
              <button
                key={s.label}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5"
              >
                <s.icon className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 text-sm">{s.label}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </SmartCard>
        </section>
      </div>
    </AppShell>
  );
}
