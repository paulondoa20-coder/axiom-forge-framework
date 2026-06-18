import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { HubHeader } from "@/components/hub/HubHeader";
import { SmartCard } from "@/components/ui-kit/SmartCard";
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
} from "lucide-react";

export const Route = createFileRoute("/creation")({
  head: () => ({
    meta: [
      { title: "Espace de création — VITALA" },
      {
        name: "description",
        content:
          "Un atelier ouvert pour les créateurs : projets, collaborations, idées en mouvement.",
      },
      { property: "og:title", content: "Espace de création — VITALA" },
      {
        property: "og:description",
        content:
          "Lancez vos projets, trouvez des collaborateurs, montrez vos créations.",
      },
    ],
  }),
  component: CreationPage,
});

const ACCENT = "var(--flash)";

const STUDIOS = [
  { icon: PenTool, label: "Écriture", count: 12 },
  { icon: Palette, label: "Arts visuels", count: 18 },
  { icon: Camera, label: "Photo", count: 9 },
  { icon: Music2, label: "Musique", count: 14 },
  { icon: Film, label: "Vidéo", count: 7 },
  { icon: Lightbulb, label: "Idées", count: 23 },
];

const PROJECTS = [
  {
    title: "Fanzine collectif — N°3",
    by: "Studio Atelier 9 · 6 contributeurs",
    status: "Ouvert aux contributions",
  },
  {
    title: "EP acoustique — sessions home",
    by: "Léna B. · cherche batteur·euse",
    status: "Recrute",
  },
  {
    title: "Court-métrage — quartier vivant",
    by: "Collectif Plein Cadre",
    status: "En tournage",
  },
];

const STEPS = [
  {
    icon: Lightbulb,
    title: "1. Posez l'idée",
    desc: "Décrivez votre projet en quelques lignes, même brut.",
  },
  {
    icon: Users,
    title: "2. Rassemblez",
    desc: "Trouvez des co-créateurs, mentors, ressources autour de vous.",
  },
  {
    icon: Rocket,
    title: "3. Lancez",
    desc: "Publiez une étape, partagez l'avancée, faites vivre l'œuvre.",
  },
];

function CreationPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <HubHeader
          eyebrow="Espace"
          title="Espace de création"
          description="Un atelier ouvert pour donner forme à vos projets et rencontrer celles et ceux qui les feront grandir."
          color={ACCENT}
          icon={<Palette className="h-5 w-5" />}
        />

        {/* HERO */}
        <SmartCard glow="flash" className="space-y-4">
          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-2xl"
              style={{
                background: `color-mix(in oklch, ${ACCENT} 18%, transparent)`,
                color: ACCENT,
              }}
            >
              <Rocket className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">
                Faites éclore un projet, à votre rythme.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Que vous écriviez, dessiniez, filmiez ou inventiez —
                l'Espace de création vous donne un cadre vivant pour avancer
                ensemble.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1 rounded-xl"
              style={{ background: ACCENT, color: "var(--background)" }}
            >
              <Plus className="h-3.5 w-3.5" /> Lancer un projet
            </Button>
            <Button size="sm" variant="outline" className="flex-1 rounded-xl border-white/10">
              <Users className="h-3.5 w-3.5" /> Rejoindre
            </Button>
          </div>
        </SmartCard>

        {/* STUDIOS */}
        <section className="space-y-2">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Studios actifs
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {STUDIOS.map((s) => (
              <button
                key={s.label}
                className="glass-surface flex flex-col items-center gap-1.5 rounded-2xl p-3 transition-all hover:-translate-y-0.5"
              >
                <s.icon className="h-4 w-4" style={{ color: ACCENT }} />
                <span className="text-xs font-medium">{s.label}</span>
                <span className="text-[10px] text-muted-foreground">
                  {s.count} projets
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* STEPS */}
        <section className="space-y-2">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Comment ça marche
          </h3>
          <div className="grid gap-2">
            {STEPS.map((s) => (
              <SmartCard key={s.title} className="flex items-start gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background: `color-mix(in oklch, ${ACCENT} 15%, transparent)`,
                    color: ACCENT,
                  }}
                >
                  <s.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
              </SmartCard>
            ))}
          </div>
        </section>

        {/* PROJECTS */}
        <section className="space-y-2">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Projets en mouvement
          </h3>
          <div className="space-y-2">
            {PROJECTS.map((p) => (
              <SmartCard key={p.title} className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{p.title}</p>
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
                <p className="text-[11px] text-muted-foreground">{p.by}</p>
              </SmartCard>
            ))}
          </div>
        </section>

        <SmartCard className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Rocket className="h-5 w-5" style={{ color: ACCENT }} />
            <div>
              <p className="text-sm font-medium">Voir d'autres espaces</p>
              <p className="text-[11px] text-muted-foreground">
                Retour à l'accueil
              </p>
            </div>
          </div>
          <Button asChild size="sm" variant="outline" className="rounded-xl border-white/10">
            <Link to="/">
              Accueil <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </SmartCard>
      </div>
    </AppShell>
  );
}
