import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { HubHeader } from "@/components/hub/HubHeader";
import { SmartCard } from "@/components/ui-kit/SmartCard";
import { PageBreadcrumb } from "@/components/ui-kit/PageBreadcrumb";
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
  MapPin,
  Calendar,
  Star,
  MessageCircle,
  ShieldCheck,
  Palette,
} from "lucide-react";

export const Route = createFileRoute("/talents")({
  head: () => ({
    meta: [
      { title: "Talents & Savoir Vivant — VITALA" },
      {
        name: "description",
        content:
          "Découvrez, apprenez et transmettez des talents et savoir-faire vivants près de chez vous. Ateliers, mentorat, traditions et rencontres locales.",
      },
      { property: "og:title", content: "Talents & Savoir Vivant — VITALA" },
      {
        property: "og:description",
        content:
          "Un espace humain pour transmettre, apprendre et valoriser les savoirs vivants de votre territoire.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/talents" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Talents & Savoir Vivant — VITALA" },
      {
        name: "twitter:description",
        content:
          "Apprendre, transmettre, rencontrer : la carte vivante des talents près de chez vous.",
      },
    ],
    links: [{ rel: "canonical", href: "/talents" }],
  }),
  component: TalentsPage,
});

const ACCENT = "var(--radar)";

const PILLARS = [
  {
    icon: GraduationCap,
    title: "Apprendre",
    desc: "Cours, ateliers et mentorat avec des personnes passionnées de votre territoire.",
    cta: "Trouver un atelier",
    to: "#categories",
  },
  {
    icon: Heart,
    title: "Transmettre",
    desc: "Partagez un savoir-faire, une langue, un geste — laissez une trace vivante.",
    cta: "Proposer un savoir",
    to: "#partager",
  },
  {
    icon: Users,
    title: "Se rencontrer",
    desc: "Rejoignez une communauté locale autour d'un talent ou d'une passion.",
    cta: "Voir les cercles",
    to: "/radar",
  },
] as const;

const CATEGORIES = [
  { label: "Artisanat", count: 42, icon: Palette },
  { label: "Musique", count: 28, icon: Sparkles },
  { label: "Cuisine", count: 31, icon: Heart },
  { label: "Langues", count: 19, icon: BookOpen },
  { label: "Bien-être", count: 24, icon: ShieldCheck },
  { label: "Nature & jardin", count: 17, icon: Compass },
  { label: "Sports doux", count: 14, icon: Users },
  { label: "Récits & mémoire", count: 9, icon: BookOpen },
];

const FEATURED = [
  {
    name: "Atelier poterie raku",
    by: "Claire M.",
    city: "Lyon",
    tag: "Artisanat",
    rating: 4.9,
    when: "Sam. 14h",
  },
  {
    name: "Cours de kora & griotique",
    by: "Sékou D.",
    city: "Marseille",
    tag: "Musique",
    rating: 4.8,
    when: "Mer. 18h",
  },
  {
    name: "Cuisine de grand-mère provençale",
    by: "Jeanne R.",
    city: "Aix",
    tag: "Cuisine",
    rating: 5.0,
    when: "Dim. 11h",
  },
];

const TESTIMONIALS = [
  {
    quote: "J'ai retrouvé le plaisir de transmettre ce que ma mère m'a appris.",
    author: "Awa, 62 ans — Toulouse",
  },
  {
    quote: "Trois ateliers, trois rencontres précieuses. Tout près de chez moi.",
    author: "Hugo, 29 ans — Nantes",
  },
];

function TalentsPage() {
  return (
    <AppShell>
      <div className="mx-auto w-full max-w-3xl space-y-8">
        <PageBreadcrumb />
        <HubHeader
          eyebrow="Espace"
          title="Talents & Savoir Vivant"
          description="Un lieu pour transmettre, apprendre et célébrer les savoirs qui font vivre nos communautés."
          color={ACCENT}
          icon={<GraduationCap className="h-5 w-5" />}
        />

        {/* HERO */}
        <SmartCard className="space-y-5">
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
              <h2 className="text-base font-semibold leading-snug">
                Donnez de la valeur à ce que vous savez faire.
              </h2>
              <p className="text-xs leading-relaxed text-muted-foreground">
                VITALA met en lumière les talents discrets : artisans, mentors,
                porteurs de mémoire, voisins inspirants. Trouvez les vôtres,
                proposez les vôtres — gratuitement et localement.
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
              <a href="#partager">
                <Sparkles className="h-3.5 w-3.5" /> Partager un talent
              </a>
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full rounded-xl border-white/10"
              asChild
            >
              <a href="#categories">
                <Search className="h-3.5 w-3.5" /> Explorer les catégories
              </a>
            </Button>
          </div>
        </SmartCard>

        {/* PILLARS */}
        <section className="space-y-3" aria-labelledby="pillars-heading">
          <h3
            id="pillars-heading"
            className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
          >
            Trois manières de vivre cet espace
          </h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {PILLARS.map((p) => {
              const isInternal = p.to.startsWith("/");
              const inner = (
                <SmartCard className="flex h-full flex-col gap-3 transition-all hover:-translate-y-0.5">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{
                      background: `color-mix(in oklch, ${ACCENT} 15%, transparent)`,
                      color: ACCENT,
                    }}
                    aria-hidden
                  >
                    <p.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-semibold">{p.title}</p>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {p.desc}
                    </p>
                  </div>
                  <span
                    className="inline-flex items-center gap-1 text-xs font-medium"
                    style={{ color: ACCENT }}
                  >
                    {p.cta} <ArrowUpRight className="h-3 w-3" />
                  </span>
                </SmartCard>
              );
              return isInternal ? (
                <Link
                  key={p.title}
                  to={p.to}
                  className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-2xl"
                  style={{ outlineColor: ACCENT }}
                >
                  {inner}
                </Link>
              ) : (
                <a key={p.title} href={p.to} className="block rounded-2xl">
                  {inner}
                </a>
              );
            })}
          </div>
        </section>

        {/* CATEGORIES */}
        <section
          id="categories"
          className="space-y-3 scroll-mt-20"
          aria-labelledby="categories-heading"
        >
          <div className="flex items-end justify-between gap-2">
            <h3
              id="categories-heading"
              className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              Catégories vivantes
            </h3>
            <span className="text-[11px] text-muted-foreground">
              {CATEGORIES.reduce((a, c) => a + c.count, 0)} talents recensés
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {CATEGORIES.map((c) => (
              <button
                key={c.label}
                type="button"
                className="glass-surface group flex flex-col items-start gap-1.5 rounded-2xl p-3 text-left transition-all hover:-translate-y-0.5"
              >
                <c.icon
                  className="h-4 w-4"
                  style={{ color: ACCENT }}
                  aria-hidden
                />
                <span className="text-sm font-medium leading-tight">
                  {c.label}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {c.count} talents
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* FEATURED */}
        <section className="space-y-3" aria-labelledby="featured-heading">
          <div className="flex items-end justify-between gap-2">
            <h3
              id="featured-heading"
              className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              À découvrir près de chez vous
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
            {FEATURED.map((f) => (
              <SmartCard
                key={f.name}
                className="flex flex-col gap-3 transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: `color-mix(in oklch, ${ACCENT} 18%, transparent)`,
                      color: ACCENT,
                    }}
                    aria-hidden
                  >
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{f.name}</p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      par {f.by}
                    </p>
                  </div>
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 text-[10px]"
                    style={{
                      background: `color-mix(in oklch, ${ACCENT} 12%, transparent)`,
                      color: ACCENT,
                    }}
                  >
                    {f.tag}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {f.city}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {f.when}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3 w-3" style={{ color: ACCENT }} />
                    {f.rating.toFixed(1)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 rounded-xl"
                    style={{ background: ACCENT, color: "var(--background)" }}
                  >
                    Réserver
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

        {/* PARTAGER */}
        <section
          id="partager"
          className="scroll-mt-20"
          aria-labelledby="share-heading"
        >
          <SmartCard glow="radar" className="space-y-4">
            <div className="flex items-start gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
                style={{
                  background: `color-mix(in oklch, ${ACCENT} 18%, transparent)`,
                  color: ACCENT,
                }}
                aria-hidden
              >
                <Heart className="h-5 w-5" />
              </div>
              <div className="flex-1 space-y-1">
                <h3 id="share-heading" className="text-base font-semibold">
                  Vous avez un savoir à transmettre ?
                </h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  En 3 minutes, créez votre fiche talent : un titre, une
                  description, vos disponibilités. Notre équipe vous accompagne
                  pour vos premières rencontres.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Button
                size="sm"
                className="w-full rounded-xl"
                style={{ background: ACCENT, color: "var(--background)" }}
              >
                Créer ma fiche talent
              </Button>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="w-full rounded-xl border-white/10"
              >
                <Link to="/trust">
                  <ShieldCheck className="h-3.5 w-3.5" /> Comprendre la confiance
                </Link>
              </Button>
            </div>
          </SmartCard>
        </section>

        {/* TESTIMONIALS */}
        <section className="space-y-3" aria-labelledby="voices-heading">
          <h3
            id="voices-heading"
            className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
          >
            Ils témoignent
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {TESTIMONIALS.map((t) => (
              <SmartCard key={t.author} className="space-y-2">
                <p className="text-sm italic leading-relaxed">“{t.quote}”</p>
                <p className="text-[11px] text-muted-foreground">— {t.author}</p>
              </SmartCard>
            ))}
          </div>
        </section>

        {/* FOOTER NAV */}
        <SmartCard className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Compass className="h-5 w-5" style={{ color: ACCENT }} />
            <div>
              <p className="text-sm font-medium">Continuer l'exploration</p>
              <p className="text-[11px] text-muted-foreground">
                Espace de création, Radar local et plus
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
              <Link to="/creation">
                Création <ArrowUpRight className="h-3.5 w-3.5" />
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
