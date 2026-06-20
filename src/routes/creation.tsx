import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { HubHeader } from "@/components/hub/HubHeader";
import { SmartCard } from "@/components/ui-kit/SmartCard";
import { PageBreadcrumb } from "@/components/ui-kit/PageBreadcrumb";
import { LivePulse } from "@/components/ui-kit/LivePulse";
import { Button } from "@/components/ui/button";
import {
  Palette,
  PenTool,
  Camera,
  Music2,
  Film,
  Lightbulb,
  Rocket,
  Users,
  ArrowUpRight,
  Plus,
  MessageCircle,
  Sparkles,
  GraduationCap,
  Compass,
  Flame,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/creation")({
  head: () => ({
    meta: [
      { title: "Espace de création — VITALA" },
      {
        name: "description",
        content:
          "Un atelier ouvert pour les créateurs : lancez un projet, trouvez des collaborateurs, partagez vos étapes et faites vivre vos œuvres.",
      },
      { property: "og:title", content: "Espace de création — VITALA" },
      {
        property: "og:description",
        content:
          "Écriture, musique, photo, vidéo, arts visuels — un cadre vivant pour créer ensemble.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/creation" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Espace de création — VITALA" },
      {
        name: "twitter:description",
        content:
          "Lancez vos projets, trouvez des collaborateurs, montrez vos créations.",
      },
    ],
    links: [{ rel: "canonical", href: "/creation" }],
  }),
  component: CreationPage,
});

const ACCENT = "var(--flash)";

const STUDIOS = [
  { icon: PenTool, label: "Écriture", count: 12, hint: "Récits, poésie, BD" },
  { icon: Palette, label: "Arts visuels", count: 18, hint: "Illustration, peinture" },
  { icon: Camera, label: "Photo", count: 9, hint: "Reportage, portraits" },
  { icon: Music2, label: "Musique", count: 14, hint: "Compo, live, prod" },
  { icon: Film, label: "Vidéo", count: 7, hint: "Court-métrage, doc" },
  { icon: Lightbulb, label: "Idées", count: 23, hint: "Concepts, prototypes" },
];

const PROJECTS = [
  {
    title: "Fanzine collectif — N°3",
    by: "Studio Atelier 9",
    members: 6,
    status: "Ouvert",
    needs: ["Illustrateur·rice", "Relecture"],
  },
  {
    title: "EP acoustique — sessions home",
    by: "Léna B.",
    members: 2,
    status: "Recrute",
    needs: ["Batteur·euse", "Mix"],
  },
  {
    title: "Court-métrage — quartier vivant",
    by: "Collectif Plein Cadre",
    members: 8,
    status: "En tournage",
    needs: ["Régie", "Son"],
  },
];

const LIVE_ITEMS = [
  { icon: <Flame className="h-3 w-3" />, text: "Léna cherche un batteur pour ce week-end" },
  { icon: <Zap className="h-3 w-3" />, text: "Tournage live — Plein Cadre, ce soir 20h" },
  { icon: <Sparkles className="h-3 w-3" />, text: "Fanzine N°3 : 4 contributions reçues aujourd'hui" },
  { icon: <Rocket className="h-3 w-3" />, text: "2 nouveaux studios viennent d'ouvrir" },
  { icon: <Flame className="h-3 w-3" />, text: "Casting illustration — réponse avant vendredi" },
];

const STEPS = [
  {
    icon: Lightbulb,
    title: "Balance l'idée",
    desc: "Deux lignes, même brouillon. L'important c'est que ça sorte.",
    step: "01",
  },
  {
    icon: Users,
    title: "Monte l'équipe",
    desc: "Trouve les bonnes mains, les bons mentors, les bonnes oreilles.",
    step: "02",
  },
  {
    icon: Rocket,
    title: "Envoie",
    desc: "Publie une étape, montre l'avancée, fais grandir ton truc.",
    step: "03",
  },
];

const RESOURCES = [
  {
    icon: GraduationCap,
    title: "Talents & savoirs",
    desc: "Chope un geste, trouve un mentor pour ton projet.",
    to: "/talents",
    label: "Explorer",
  },
  {
    icon: Compass,
    title: "Radar local",
    desc: "Vois les studios et ateliers qui bougent autour de toi.",
    to: "/radar",
    label: "Ouvrir le radar",
  },
  {
    icon: MessageCircle,
    title: "Messages",
    desc: "Tape direct un collectif ou un porteur de projet.",
    to: "/messages",
    label: "Mes messages",
  },
] as const;

function CreationPage() {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-3xl space-y-8 motion-safe:animate-fade-in">
        <PageBreadcrumb />
        <HubHeader
          eyebrow="Espace"
          title="Espace de création"
          description="L'atelier ouvert du quartier. Pose ton idée, monte l'équipe, envoie."
          color={ACCENT}
          icon={<Palette className="h-5 w-5" />}
        />

        <LivePulse items={LIVE_ITEMS} accent={ACCENT} label="Ça tourne" />

        {/* HERO */}
        <SmartCard glow="flash" className="space-y-5">
          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
              style={{
                background: `color-mix(in oklch, ${ACCENT} 18%, transparent)`,
                color: ACCENT,
              }}
              aria-hidden
            >
              <Rocket className="h-5 w-5" />
            </div>
            <div className="flex-1 space-y-1">
              <h2 className="text-base font-semibold leading-snug">
                Sors ton projet du carton. À ton rythme.
              </h2>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Que tu écrives, dessines, filmes ou bidouilles — ici c'est un
                cadre vivant pour avancer en équipe, trouver les bonnes
                personnes et publier tes étapes sans pression.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Button
              size="sm"
              className="w-full rounded-xl"
              style={{ background: ACCENT, color: "var(--background)" }}
              asChild
            >
              <a href="#nouveau">
                <Plus className="h-3.5 w-3.5" /> Je lance mon projet
              </a>
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full rounded-xl border-white/10"
              asChild
            >
              <a href="#projets">
                <Users className="h-3.5 w-3.5" /> Rejoindre une équipe
              </a>
            </Button>
          </div>
        </SmartCard>

        {/* STUDIOS */}
        <section className="space-y-3" aria-labelledby="studios-heading">
          <div className="flex items-end justify-between gap-2">
            <h3
              id="studios-heading"
              className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              Studios actifs
            </h3>
            <span className="text-[11px] text-muted-foreground">
              {STUDIOS.reduce((a, s) => a + s.count, 0)} projets en cours
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {STUDIOS.map((s) => (
              <button
                key={s.label}
                type="button"
                className="glass-surface group flex flex-col items-start gap-1.5 rounded-2xl p-3 text-left transition-all hover:-translate-y-0.5"
              >
                <s.icon
                  className="h-4 w-4"
                  style={{ color: ACCENT }}
                  aria-hidden
                />
                <span className="text-sm font-semibold leading-tight">
                  {s.label}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {s.hint}
                </span>
                <span
                  className="mt-1 rounded-full px-2 py-0.5 text-[10px]"
                  style={{
                    background: `color-mix(in oklch, ${ACCENT} 12%, transparent)`,
                    color: ACCENT,
                  }}
                >
                  {s.count} projets
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* STEPS */}
        <section className="space-y-3" aria-labelledby="steps-heading">
          <h3
            id="steps-heading"
            className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
          >
            Comment ça se passe
          </h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {STEPS.map((s) => (
              <SmartCard key={s.title} className="flex h-full flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{
                      background: `color-mix(in oklch, ${ACCENT} 15%, transparent)`,
                      color: ACCENT,
                    }}
                    aria-hidden
                  >
                    <s.icon className="h-4 w-4" />
                  </div>
                  <span
                    className="text-[10px] font-mono"
                    style={{ color: ACCENT }}
                  >
                    {s.step}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold">{s.title}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {s.desc}
                  </p>
                </div>
              </SmartCard>
            ))}
          </div>
        </section>

        {/* PROJECTS */}
        <section
          id="projets"
          className="space-y-3 scroll-mt-20"
          aria-labelledby="projects-heading"
        >
          <div className="flex items-end justify-between gap-2">
            <h3
              id="projects-heading"
              className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              Projets qui bougent maintenant
            </h3>
            <Link
              to="/radar"
              className="inline-flex items-center gap-1 text-[11px] font-medium"
              style={{ color: ACCENT }}
            >
              Voir tout <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {PROJECTS.map((p) => (
              <SmartCard
                key={p.title}
                className="flex flex-col gap-3 transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-snug">
                      {p.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {p.by} · {p.members} contributeurs
                    </p>
                  </div>
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 text-[10px]"
                    style={{
                      background: `color-mix(in oklch, ${ACCENT} 12%, transparent)`,
                      color: ACCENT,
                    }}
                  >
                    {p.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {p.needs.map((n) => (
                    <span
                      key={n}
                      className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-muted-foreground"
                    >
                      cherche · {n}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 rounded-xl"
                    style={{ background: ACCENT, color: "var(--background)" }}
                  >
                    Rejoindre
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="rounded-xl border-white/10"
                  >
                    <Link to="/messages">
                      <MessageCircle className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </SmartCard>
            ))}
          </div>
        </section>

        {/* NOUVEAU PROJET */}
        <section id="nouveau" className="scroll-mt-20">
          <SmartCard glow="flash" className="space-y-4">
            <div className="flex items-start gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
                style={{
                  background: `color-mix(in oklch, ${ACCENT} 18%, transparent)`,
                  color: ACCENT,
                }}
                aria-hidden
              >
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="text-base font-semibold">
                  Prêt à lancer ton truc ?
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Un titre, une intention, deux mots sur qui tu cherches —
                  c'est suffisant pour démarrer. T'enrichis la fiche plus
                  tard, t'inquiète.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Button
                size="sm"
                className="w-full rounded-xl"
                style={{ background: ACCENT, color: "var(--background)" }}
              >
                <Plus className="h-3.5 w-3.5" /> Je crée mon projet
              </Button>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="w-full rounded-xl border-white/10"
              >
                <Link to="/talents">
                  <GraduationCap className="h-3.5 w-3.5" /> Trouver un mentor
                </Link>
              </Button>
            </div>
          </SmartCard>
        </section>

        {/* RESOURCES */}
        <section className="space-y-3" aria-labelledby="resources-heading">
          <h3
            id="resources-heading"
            className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
          >
            Pour aller plus loin
          </h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {RESOURCES.map((r) => (
              <Link
                key={r.title}
                to={r.to}
                className="block rounded-2xl focus:outline-none"
              >
                <SmartCard className="flex h-full flex-col gap-2 transition-all hover:-translate-y-0.5">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{
                      background: `color-mix(in oklch, ${ACCENT} 15%, transparent)`,
                      color: ACCENT,
                    }}
                    aria-hidden
                  >
                    <r.icon className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-semibold">{r.title}</p>
                  <p className="flex-1 text-xs leading-relaxed text-muted-foreground">
                    {r.desc}
                  </p>
                  <span
                    className="inline-flex items-center gap-1 text-xs font-medium"
                    style={{ color: ACCENT }}
                  >
                    {r.label} <ArrowUpRight className="h-3 w-3" />
                  </span>
                </SmartCard>
              </Link>
            ))}
          </div>
        </section>

        {/* FOOTER NAV */}
        <SmartCard className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Rocket className="h-5 w-5" style={{ color: ACCENT }} />
            <div>
              <p className="text-sm font-medium">Voir d'autres espaces</p>
              <p className="text-[11px] text-muted-foreground">
                Talents, Radar et plus
              </p>
            </div>
          </div>
          <div className="flex w-full gap-2 sm:w-auto">
            <Button
              asChild
              size="sm"
              variant="outline"
              className="flex-1 rounded-xl border-white/10 sm:flex-none"
            >
              <Link to="/talents">
                Talents <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="flex-1 rounded-xl border-white/10 sm:flex-none"
            >
              <Link to="/">Accueil</Link>
            </Button>
          </div>
        </SmartCard>
      </div>
    </AppShell>
  );
}
