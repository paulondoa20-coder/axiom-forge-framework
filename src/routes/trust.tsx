import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { HubHeader } from "@/components/hub/HubHeader";
import { SmartCard } from "@/components/ui-kit/SmartCard";
import { TrustBadge } from "@/components/ui-kit/TrustBadge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  BadgeCheck,
  Lock,
  Clock,
  Zap,
  Eye,
  FileCheck,
  Sparkles,
  MessageCircle,
  Bookmark,
  Share2,
  LifeBuoy,
  Flag,
  HelpCircle,
  Calendar,
  CheckCircle2,
  Activity,
  Image as ImageIcon,
  Award,
} from "lucide-react";

export const Route = createFileRoute("/trust")({
  head: () => ({
    meta: [
      { title: "Trust — VITALA" },
      { name: "description", content: "Vérifiez la fiabilité d'un service avant d'agir." },
    ],
  }),
  component: TrustPage,
});

const PROFILE = {
  name: "Atelier Léa Moreau",
  handle: "@lea.atelier",
  role: "Service de couture · Paris 11e",
  score: 92,
  status: "Fiable",
};

const SCORES = [
  { label: "Fiabilité", value: 94 },
  { label: "Activité", value: 88 },
  { label: "Transparence", value: 96 },
  { label: "Réactivité", value: 90 },
];

const VERIFICATIONS = [
  { label: "Identité vérifiée", icon: BadgeCheck, ok: true },
  { label: "Activité confirmée", icon: CheckCircle2, ok: true },
  { label: "Informations complètes", icon: FileCheck, ok: true },
  { label: "Historique actif", icon: Activity, ok: true },
];

const BADGES = [
  { label: "Verified", icon: BadgeCheck },
  { label: "Active", icon: Activity },
  { label: "Trusted", icon: ShieldCheck },
  { label: "Professional", icon: Award },
];

const INDICATORS = [
  { label: "Réponse moyenne", value: "< 1h", pct: 92, icon: Zap },
  { label: "Satisfaction", value: "98%", pct: 98, icon: Sparkles },
  { label: "Transparence infos", value: "Complète", pct: 96, icon: Eye },
  { label: "Activité récente", value: "Aujourd'hui", pct: 88, icon: Clock },
];

const FEEDBACKS = [
  { name: "Maya R.", text: "Travail soigné, communication parfaite.", tags: ["professionnel", "clair"] },
  { name: "Tom B.", text: "Très rapide, exactement ce que je cherchais.", tags: ["rapide", "fiable"] },
  { name: "Inès D.", text: "Conseils précis et délais respectés.", tags: ["professionnel", "fiable"] },
];

const PROOFS = [
  { label: "Certification métier", icon: Award },
  { label: "Pièce d'identité", icon: BadgeCheck },
  { label: "Atelier — photo", icon: ImageIcon },
  { label: "Assurance pro", icon: FileCheck },
];

const TIMELINE = [
  { when: "Aujourd'hui", text: "Profil mis à jour" },
  { when: "Hier", text: "Nouvelle interaction confirmée" },
  { when: "3 j", text: "Vérification d'identité renouvelée" },
  { when: "1 sem", text: "Certification ajoutée" },
];

const TRANSPARENCY = [
  { label: "Disponibilité", value: "Lun–Sam" },
  { label: "Horaires", value: "9h – 19h" },
  { label: "Délai moyen", value: "2 jours" },
  { label: "Politique", value: "Retour 14j" },
];

function ScoreBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{label}</span>
        <span style={{ color: "var(--trust)" }}>{value}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${value}%`, background: "var(--gradient-trust)" }}
        />
      </div>
    </div>
  );
}

function TrustPage() {
  return (
    <AppShell>
      <div className="space-y-6 animate-[fade-up_0.5s_var(--ease-smooth)_both]">
        <HubHeader
          eyebrow="Trust"
          title="Vérifiez en confiance"
          description="Des signaux clairs et calmes pour décider sereinement avant d'agir."
          color="var(--trust)"
          icon={<ShieldCheck className="h-5 w-5" />}
        />

        {/* 1. TRUST HERO */}
        <SmartCard glow="trust" className="space-y-5">
          <div className="flex items-start gap-3">
            <div
              className="h-12 w-12 shrink-0 rounded-2xl"
              style={{ background: "var(--gradient-trust)" }}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h2 className="truncate text-base font-semibold">{PROFILE.name}</h2>
                <BadgeCheck className="h-4 w-4 shrink-0" style={{ color: "var(--trust)" }} />
              </div>
              <p className="text-xs text-muted-foreground">{PROFILE.role}</p>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
                  style={{
                    background: "color-mix(in oklch, var(--trust) 14%, transparent)",
                    color: "var(--trust)",
                  }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--trust)]" />
                  {PROFILE.status}
                </span>
                <span className="text-[11px] text-muted-foreground">{PROFILE.handle}</span>
              </div>
            </div>
            <TrustBadge score={PROFILE.score} />
          </div>

          <div className="rounded-2xl bg-white/5 p-4">
            <div className="mb-3 flex items-end justify-between">
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Trust score
              </p>
              <p
                className="text-4xl font-semibold tracking-tight"
                style={{ color: "var(--trust)" }}
              >
                {PROFILE.score}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {SCORES.map((s) => (
                <ScoreBar key={s.label} value={s.value} label={s.label} />
              ))}
            </div>
          </div>
        </SmartCard>

        {/* 2. VERIFICATION STATUS */}
        <section className="space-y-3">
          <h3 className="px-1 text-sm font-medium text-muted-foreground">
            Statut de vérification
          </h3>
          <SmartCard className="space-y-2">
            {VERIFICATIONS.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2.5"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" style={{ color: "var(--trust)" }} />
                    <span className="text-sm">{v.label}</span>
                  </div>
                  <span className="text-[11px]" style={{ color: "var(--trust)" }}>
                    Vérifié
                  </span>
                </div>
              );
            })}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {BADGES.map((b) => {
                const Icon = b.icon;
                return (
                  <span
                    key={b.label}
                    className="inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px]"
                    style={{
                      borderColor: "color-mix(in oklch, var(--trust) 35%, transparent)",
                      background: "color-mix(in oklch, var(--trust) 10%, transparent)",
                      color: "var(--trust)",
                    }}
                  >
                    <Icon className="h-3 w-3" />
                    {b.label}
                  </span>
                );
              })}
            </div>
          </SmartCard>
        </section>

        {/* 3. TRUST INDICATORS */}
        <section className="space-y-3">
          <h3 className="px-1 text-sm font-medium text-muted-foreground">Indicateurs</h3>
          <div className="grid grid-cols-2 gap-3">
            {INDICATORS.map((ind) => {
              const Icon = ind.icon;
              return (
                <SmartCard key={ind.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Icon className="h-4 w-4" style={{ color: "var(--trust)" }} />
                    <span className="text-[11px] text-muted-foreground">{ind.value}</span>
                  </div>
                  <p className="text-xs text-foreground/80">{ind.label}</p>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${ind.pct}%`, background: "var(--gradient-trust)" }}
                    />
                  </div>
                </SmartCard>
              );
            })}
          </div>
        </section>

        {/* 4. USER FEEDBACKS */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-medium text-muted-foreground">Retours modérés</h3>
            <span className="text-[11px] text-muted-foreground">Vérifiés</span>
          </div>
          <div className="space-y-2">
            {FEEDBACKS.map((f, i) => (
              <SmartCard key={i} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div
                    className="h-7 w-7 rounded-full"
                    style={{ background: "var(--gradient-trust)" }}
                  />
                  <span className="text-xs font-medium">{f.name}</span>
                  <BadgeCheck
                    className="ml-auto h-3.5 w-3.5"
                    style={{ color: "var(--trust)" }}
                  />
                </div>
                <p className="text-sm leading-snug text-foreground/85">"{f.text}"</p>
                <div className="flex flex-wrap gap-1">
                  {f.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </SmartCard>
            ))}
          </div>
        </section>

        {/* 5. PROOFS & TRANSPARENCY */}
        <section className="space-y-3">
          <h3 className="px-1 text-sm font-medium text-muted-foreground">
            Preuves & transparence
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {PROOFS.map((p) => {
              const Icon = p.icon;
              return (
                <SmartCard key={p.label} className="space-y-2">
                  <div
                    className="flex h-20 items-center justify-center rounded-xl"
                    style={{
                      background:
                        "linear-gradient(135deg, color-mix(in oklch, var(--trust) 14%, transparent), transparent)",
                    }}
                  >
                    <Icon className="h-6 w-6" style={{ color: "var(--trust)" }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="truncate text-xs">{p.label}</span>
                    <BadgeCheck className="h-3.5 w-3.5" style={{ color: "var(--trust)" }} />
                  </div>
                </SmartCard>
              );
            })}
          </div>
        </section>

        {/* 6. ACTIVITY TIMELINE */}
        <section className="space-y-3">
          <h3 className="px-1 text-sm font-medium text-muted-foreground">Activité récente</h3>
          <SmartCard>
            <ol className="relative space-y-3 pl-4">
              <span
                className="absolute left-[5px] top-1 bottom-1 w-px"
                style={{ background: "color-mix(in oklch, var(--trust) 30%, transparent)" }}
              />
              {TIMELINE.map((t, i) => (
                <li key={i} className="relative">
                  <span
                    className="absolute -left-4 top-1.5 h-2 w-2 rounded-full"
                    style={{ background: "var(--trust)" }}
                  />
                  <p className="text-sm">{t.text}</p>
                  <p className="text-[11px] text-muted-foreground">{t.when}</p>
                </li>
              ))}
            </ol>
          </SmartCard>
        </section>

        {/* 7. SAFETY & SUPPORT */}
        <section className="space-y-3">
          <h3 className="px-1 text-sm font-medium text-muted-foreground">Sécurité & support</h3>
          <SmartCard className="grid grid-cols-2 gap-2">
            {[
              { icon: LifeBuoy, label: "Support" },
              { icon: Flag, label: "Signaler" },
              { icon: HelpCircle, label: "Centre d'aide" },
              { icon: Lock, label: "Confidentialité" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.label}
                  className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2.5 text-left text-sm transition-colors hover:bg-white/10"
                >
                  <Icon className="h-4 w-4" style={{ color: "var(--trust)" }} />
                  {s.label}
                </button>
              );
            })}
          </SmartCard>
        </section>

        {/* 8. TRANSPARENCY INFO PANEL */}
        <section className="space-y-3">
          <h3 className="px-1 text-sm font-medium text-muted-foreground">Informations</h3>
          <SmartCard className="space-y-2">
            {TRANSPARENCY.map((t) => (
              <div
                key={t.label}
                className="flex items-center justify-between border-b border-white/5 py-2 last:border-0"
              >
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {t.label}
                </div>
                <span className="text-sm">{t.value}</span>
              </div>
            ))}
            <button className="mt-1 w-full text-left text-[11px] text-muted-foreground underline-offset-4 hover:underline">
              Voir les conditions générales
            </button>
          </SmartCard>
        </section>

        {/* 9. TRUST ACTION BUTTONS */}
        <section className="sticky bottom-24 z-10 grid grid-cols-2 gap-2">
          <Button
            className="h-11 rounded-xl text-sm font-medium"
            style={{
              background: "var(--gradient-trust)",
              color: "oklch(0.15 0.02 270)",
              boxShadow: "var(--shadow-glow-trust)",
            }}
          >
            <MessageCircle className="h-4 w-4" />
            Contacter
          </Button>
          <Button variant="outline" className="h-11 rounded-xl text-sm">
            <ShieldCheck className="h-4 w-4" />
            Vérifier plus
          </Button>
          <button className="glass-surface flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs text-foreground/80">
            <Bookmark className="h-4 w-4" />
            Sauvegarder
          </button>
          <button className="glass-surface flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs text-foreground/80">
            <Share2 className="h-4 w-4" />
            Partager
          </button>
        </section>
      </div>
    </AppShell>
  );
}
