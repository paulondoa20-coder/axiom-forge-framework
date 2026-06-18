import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { HubHeader } from "@/components/hub/HubHeader";
import { SmartCard } from "@/components/ui-kit/SmartCard";
import { Button } from "@/components/ui/button";
import {
  GraduationCap,
  Sparkles,
  Users,
  BookOpen,
  Heart,
  Compass,
  ArrowUpRight,
  Search,
} from "lucide-react";

export const Route = createFileRoute("/talents")({
  head: () => ({
    meta: [
      { title: "Talents & Savoir Vivant — VITALA" },
      {
        name: "description",
        content:
          "Découvrez et partagez des talents, savoir-faire et traditions vivantes près de chez vous.",
      },
      { property: "og:title", content: "Talents & Savoir Vivant — VITALA" },
      {
        property: "og:description",
        content:
          "Un espace humain pour transmettre, apprendre et valoriser les savoirs vivants.",
      },
    ],
  }),
  component: TalentsPage,
});

const ACCENT = "var(--radar)";

const PILLARS = [
  {
    icon: GraduationCap,
    title: "Apprendre",
    desc: "Cours, ateliers et mentorat par des personnes passionnées.",
  },
  {
    icon: Heart,
    title: "Transmettre",
    desc: "Partagez un savoir-faire, une langue, une tradition vivante.",
  },
  {
    icon: Users,
    title: "Se rencontrer",
    desc: "Connectez-vous à une communauté locale autour d'un talent.",
  },
];

const CATEGORIES = [
  { label: "Artisanat", count: 42 },
  { label: "Musique", count: 28 },
  { label: "Cuisine", count: 31 },
  { label: "Langues", count: 19 },
  { label: "Bien-être", count: 24 },
  { label: "Nature & jardin", count: 17 },
  { label: "Sports doux", count: 14 },
  { label: "Récits & mémoire", count: 9 },
];

const FEATURED = [
  {
    name: "Atelier poterie raku",
    by: "Claire M. · Lyon",
    tag: "Artisanat",
  },
  {
    name: "Cours de kora & griotique",
    by: "Sékou D. · Marseille",
    tag: "Musique",
  },
  {
    name: "Cuisine de grand-mère provençale",
    by: "Jeanne R. · Aix",
    tag: "Cuisine",
  },
];

function TalentsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <HubHeader
          eyebrow="Espace"
          title="Talents & Savoir Vivant"
          description="Un lieu pour transmettre, apprendre et célébrer les savoirs qui font vivre nos communautés."
          color={ACCENT}
          icon={<GraduationCap className="h-5 w-5" />}
        />

        {/* HERO */}
        <SmartCard className="space-y-4">
          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-2xl"
              style={{
                background: `color-mix(in oklch, ${ACCENT} 18%, transparent)`,
                color: ACCENT,
              }}
            >
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">
                Donnez de la valeur à ce que vous savez faire.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                VITALA met en lumière les talents discrets : artisans, mentors,
                porteurs de mémoire, voisins inspirants. Trouvez les vôtres.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="flex-1 rounded-xl" style={{ background: ACCENT, color: "var(--background)" }}>
              <Sparkles className="h-3.5 w-3.5" /> Partager un talent
            </Button>
            <Button size="sm" variant="outline" className="flex-1 rounded-xl border-white/10">
              <Search className="h-3.5 w-3.5" /> Explorer
            </Button>
          </div>
        </SmartCard>

        {/* PILLARS */}
        <section className="space-y-2">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Trois manières de vivre cet espace
          </h3>
          <div className="grid gap-2">
            {PILLARS.map((p) => (
              <SmartCard key={p.title} className="flex items-start gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background: `color-mix(in oklch, ${ACCENT} 15%, transparent)`,
                    color: ACCENT,
                  }}
                >
                  <p.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{p.desc}</p>
                </div>
              </SmartCard>
            ))}
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="space-y-2">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Catégories vivantes
          </h3>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.label}
                className="glass-surface inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-all hover:-translate-y-0.5"
              >
                <span>{c.label}</span>
                <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                  {c.count}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* FEATURED */}
        <section className="space-y-2">
          <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            À découvrir près de chez vous
          </h3>
          <div className="space-y-2">
            {FEATURED.map((f) => (
              <SmartCard key={f.name} className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background: `color-mix(in oklch, ${ACCENT} 18%, transparent)`,
                    color: ACCENT,
                  }}
                >
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{f.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {f.by}
                  </p>
                </div>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px]"
                  style={{
                    background: `color-mix(in oklch, ${ACCENT} 12%, transparent)`,
                    color: ACCENT,
                  }}
                >
                  {f.tag}
                </span>
              </SmartCard>
            ))}
          </div>
        </section>

        <SmartCard className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Compass className="h-5 w-5" style={{ color: ACCENT }} />
            <div>
              <p className="text-sm font-medium">Continuer l'exploration</p>
              <p className="text-[11px] text-muted-foreground">
                Retourner à l'accueil VITALA
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
