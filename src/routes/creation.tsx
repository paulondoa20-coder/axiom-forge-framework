import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { HubHeader } from "@/components/hub/HubHeader";
import { SmartCard } from "@/components/ui-kit/SmartCard";
import { PageBreadcrumb } from "@/components/ui-kit/PageBreadcrumb";
import { LivePulse } from "@/components/ui-kit/LivePulse";
import { DetailDialog } from "@/components/ui-kit/DetailDialog";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
  HelpCircle,
} from "lucide-react";

export const Route = createFileRoute("/creation")({
  head: () => ({
    meta: [
      { title: "Espace de création — VITALA" },
      {
        name: "description",
        content:
          "L'atelier ouvert du quartier : pose ton idée, monte l'équipe, publie tes étapes. Écriture, musique, photo, vidéo, arts visuels.",
      },
      { property: "og:title", content: "Espace de création — VITALA" },
      {
        property: "og:description",
        content:
          "Sors ton projet du carton, trouve les bonnes mains, fais vivre tes créations.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/creation" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Espace de création — VITALA" },
      {
        name: "twitter:description",
        content:
          "Lance ton projet, recrute ton équipe, montre tes étapes — à ton rythme.",
      },
    ],
    links: [{ rel: "canonical", href: "/creation" }],
  }),
  component: CreationPage,
});

const ACCENT = "var(--flash)";

const STUDIOS = [
  {
    icon: PenTool,
    label: "Écriture",
    count: 12,
    hint: "Récits, poésie, BD",
    summary:
      "Tu poses des mots ? Ici on écrit à plusieurs, on se relit, on publie des fanzines et des recueils.",
    steps: [
      "Choisis un format (court, série, collectif).",
      "Lance un appel à plumes ou rejoins-en un.",
      "Publie chapitre par chapitre, à ton rythme.",
    ],
  },
  {
    icon: Palette,
    label: "Arts visuels",
    count: 18,
    hint: "Illustration, peinture",
    summary:
      "Illustrateur·rices, peintres, graphistes : monte un projet, partage tes WIP, trouve un binôme.",
    steps: [
      "Présente ta direction artistique en 3 visuels.",
      "Indique ce que tu cherches (collab, modèle, lieu).",
      "Avance par jalons visibles par la commu.",
    ],
  },
  {
    icon: Camera,
    label: "Photo",
    count: 9,
    hint: "Reportage, portraits",
    summary:
      "Du reportage de quartier aux séries portrait : trouve modèles, lieux et regards complices.",
    steps: [
      "Décris ta série en une intention forte.",
      "Lance un casting modèles/lieux dans ton coin.",
      "Publie 3 planches, recueille les retours.",
    ],
  },
  {
    icon: Music2,
    label: "Musique",
    count: 14,
    hint: "Compo, live, prod",
    summary:
      "Compose, enregistre, joue. Trouve un·e batteur·euse, un·e ingé son ou juste un studio dispo.",
    steps: [
      "Démarre une session (démo, EP, live).",
      "Recrute les rôles manquants en un post.",
      "Programme une répète ou un live de quartier.",
    ],
  },
  {
    icon: Film,
    label: "Vidéo",
    count: 7,
    hint: "Court-métrage, doc",
    summary:
      "Court-métrages, docus, capsules : monte une équipe régie, son, image et tourne près de chez toi.",
    steps: [
      "Pitch en 5 lignes + intention visuelle.",
      "Forme l'équipe (réa, image, son, régie).",
      "Diffuse en projection locale ou en ligne.",
    ],
  },
  {
    icon: Lightbulb,
    label: "Idées",
    count: 23,
    hint: "Concepts, prototypes",
    summary:
      "Un concept en tête mais pas encore d'équipe ? Pose-le ici, regarde qui mord.",
    steps: [
      "Décris l'idée en 2 lignes, sans filtre.",
      "Tag les compétences que tu cherches.",
      "Affine au fil des retours, transforme en projet.",
    ],
  },
];

const PROJECTS = [
  {
    title: "Fanzine collectif — N°3",
    by: "Studio Atelier 9",
    members: 6,
    status: "Ouvert",
    needs: ["Illustrateur·rice", "Relecture"],
    summary:
      "Troisième numéro du fanzine du quartier : 32 pages, thème « voisinages ». Sortie papier + numérique en mars.",
    steps: [
      "Lecture du brief + appel à contributions.",
      "Atelier maquette commune un samedi.",
      "Impression locale + lancement en librairie.",
    ],
  },
  {
    title: "EP acoustique — sessions home",
    by: "Léna B.",
    members: 2,
    status: "Recrute",
    needs: ["Batteur·euse", "Mix"],
    summary:
      "5 morceaux folk enregistrés en home studio. Cherche batteur·euse doux·ce et un·e ingé mix sensible.",
    steps: [
      "Écoute des démos partagées en privé.",
      "Une répète + une session d'enregistrement.",
      "Mix collaboratif, sortie sur les plateformes.",
    ],
  },
  {
    title: "Court-métrage — quartier vivant",
    by: "Collectif Plein Cadre",
    members: 8,
    status: "En tournage",
    needs: ["Régie", "Son"],
    summary:
      "Fiction de 15 min sur une journée dans un marché de quartier. Tournage en cours, postprod prévue cet été.",
    steps: [
      "Reprise des tournages les week-ends.",
      "Postprod son/image en juillet.",
      "Projection locale + festivals d'automne.",
    ],
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
    summary:
      "On démarre toujours par une intention brute. Pas besoin de plan parfait, juste de la sincérité.",
    detailSteps: [
      "Donne un titre de travail (ça peut changer).",
      "Écris 2 lignes : pourquoi ce projet, maintenant.",
      "Coche les rôles que tu cherches.",
    ],
  },
  {
    icon: Users,
    title: "Monte l'équipe",
    desc: "Trouve les bonnes mains, les bons mentors, les bonnes oreilles.",
    step: "02",
    summary:
      "L'équipe se construit petit à petit, au fil des messages et des premières répètes.",
    detailSteps: [
      "Publie un appel clair (rôle, dispo, lieu).",
      "Discute en DM avec les candidat·es.",
      "Valide une équipe noyau et démarre.",
    ],
  },
  {
    icon: Rocket,
    title: "Envoie",
    desc: "Publie une étape, montre l'avancée, fais grandir ton truc.",
    step: "03",
    summary:
      "Chaque étape publiée attire des regards, du feedback, parfois de nouveaux contributeurs.",
    detailSteps: [
      "Choisis un format de partage (photo, audio, texte).",
      "Publie l'étape avec un mot sur le contexte.",
      "Réponds aux retours, itère, recommence.",
    ],
  },
];

const INSPIRATIONS = [
  {
    tag: "Fanzine",
    title: "Voix du marché",
    by: "Atelier 9 · Marseille",
    quote: "On a édité 200 exemplaires en 3 semaines.",
  },
  {
    tag: "Musique",
    title: "Nuit kora & beats",
    by: "Sékou × Yann · Lyon",
    quote: "Rencontre dans un cercle, EP six mois plus tard.",
  },
  {
    tag: "Photo",
    title: "Portraits d'immeuble",
    by: "Inès D. · Nantes",
    quote: "12 voisins, 12 portraits, une expo dans le hall.",
  },
  {
    tag: "Vidéo",
    title: "Le dernier kiosque",
    by: "Plein Cadre · Aubervilliers",
    quote: "Doc de 8 min, primé au festival local.",
  },
  {
    tag: "Écriture",
    title: "Lettres au quartier",
    by: "Collectif Plume",
    quote: "Une lettre par semaine, lue à voix haute.",
  },
];

const FAQ = [
  {
    q: "Faut un niveau pour se lancer ?",
    a: "Non. Sérieux. Tu peux débarquer avec une idée brute et zéro réseau — la communauté est faite pour ça.",
  },
  {
    q: "C'est payant ?",
    a: "Créer un projet, rejoindre une équipe, publier des étapes : 100% gratuit. Si tu veux monter un projet rémunéré, c'est toi qui fixes les règles.",
  },
  {
    q: "Comment je trouve les bonnes personnes ?",
    a: "Décris ce que tu cherches en une phrase claire. Plus c'est précis (rôle, dispo, ville), plus les bons profils répondent.",
  },
  {
    q: "Je peux rester anonyme au début ?",
    a: "Oui, tu peux publier sous pseudo et révéler ton identité aux gens avec qui tu connectes en DM.",
  },
  {
    q: "Et si mon projet n'aboutit pas ?",
    a: "C'est la vie. Tu archives, tu en lances un autre, tu réutilises l'équipe. Aucun jugement, juste du mouvement.",
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
              <DetailDialog
                key={s.label}
                accent={ACCENT}
                eyebrow="Studio"
                title={s.label}
                summary={s.summary}
                meta={[
                  { label: "Projets actifs", value: `${s.count}` },
                  { label: "Format", value: s.hint },
                  { label: "Tarif", value: "Libre" },
                  { label: "Niveau", value: "Tous niveaux" },
                ]}
                steps={s.steps}
                primaryCta={{ label: `Ouvrir ${s.label}` }}
                secondaryCta={{ label: "Fermer" }}
                trigger={
                  <button
                    type="button"
                    className="glass-surface group flex w-full flex-col items-start gap-1.5 rounded-2xl p-3 text-left transition-all hover:-translate-y-0.5"
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
                }
              />
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
              <DetailDialog
                key={s.title}
                accent={ACCENT}
                eyebrow={`Étape ${s.step}`}
                title={s.title}
                summary={s.summary}
                steps={s.detailSteps}
                primaryCta={{ label: "C'est parti" }}
                secondaryCta={{ label: "Fermer" }}
                trigger={
                  <button type="button" className="text-left">
                    <SmartCard className="flex h-full flex-col gap-3 transition-all hover:-translate-y-0.5">
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
                  </button>
                }
              />
            ))}
          </div>
        </section>

        {/* INSPIRATIONS CAROUSEL */}
        <section className="space-y-3" aria-labelledby="inspi-heading">
          <div className="flex items-end justify-between gap-2">
            <h3
              id="inspi-heading"
              className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              Inspirations du quartier
            </h3>
            <span className="text-[11px] text-muted-foreground">
              Glisse →
            </span>
          </div>
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-2">
              {INSPIRATIONS.map((i) => (
                <CarouselItem
                  key={i.title}
                  className="basis-4/5 pl-2 sm:basis-1/2 md:basis-1/3"
                >
                  <SmartCard className="flex h-full flex-col gap-2">
                    <span
                      className="w-fit rounded-full px-2 py-0.5 text-[10px]"
                      style={{
                        background: `color-mix(in oklch, ${ACCENT} 14%, transparent)`,
                        color: ACCENT,
                      }}
                    >
                      {i.tag}
                    </span>
                    <p className="text-sm font-semibold leading-snug">
                      {i.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{i.by}</p>
                    <p className="mt-1 text-xs italic leading-relaxed">
                      “{i.quote}”
                    </p>
                  </SmartCard>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
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
                  <DetailDialog
                    accent={ACCENT}
                    eyebrow={p.status}
                    title={p.title}
                    summary={p.summary}
                    meta={[
                      { label: "Porté par", value: p.by },
                      { label: "Équipe", value: `${p.members} pers.` },
                      { label: "Cherche", value: p.needs.join(", ") },
                      { label: "Statut", value: p.status },
                    ]}
                    steps={p.steps}
                    primaryCta={{ label: "Rejoindre l'équipe" }}
                    secondaryCta={{ label: "Envoyer un message" }}
                    trigger={
                      <Button
                        size="sm"
                        className="flex-1 rounded-xl"
                        style={{ background: ACCENT, color: "var(--background)" }}
                      >
                        Voir le projet
                      </Button>
                    }
                  />
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

        {/* FAQ ACCORDION */}
        <section className="space-y-3" aria-labelledby="faq-heading">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" style={{ color: ACCENT }} aria-hidden />
            <h3
              id="faq-heading"
              className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              Questions qu'on nous pose souvent
            </h3>
          </div>
          <SmartCard>
            <Accordion type="single" collapsible className="w-full">
              {FAQ.map((f, i) => (
                <AccordionItem
                  key={f.q}
                  value={`faq-${i}`}
                  className="border-white/10"
                >
                  <AccordionTrigger className="text-left text-sm hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs leading-relaxed text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </SmartCard>
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
              <DetailDialog
                accent={ACCENT}
                eyebrow="Nouveau projet"
                title="Je crée mon projet"
                summary="On t'aide à poser ton projet en une fiche claire, ouverte à la collab et facile à faire vivre."
                steps={[
                  "Titre + intention en 2 lignes.",
                  "Coche les rôles que tu cherches.",
                  "Publie ta fiche et reçois les premiers messages.",
                ]}
                meta={[
                  { label: "Temps", value: "≈ 4 minutes" },
                  { label: "Coût", value: "Gratuit" },
                  { label: "Modification", value: "À tout moment" },
                  { label: "Visibilité", value: "Tu choisis" },
                ]}
                primaryCta={{ label: "Démarrer mon projet" }}
                secondaryCta={{ label: "Plus tard" }}
                trigger={
                  <Button
                    size="sm"
                    className="w-full rounded-xl"
                    style={{ background: ACCENT, color: "var(--background)" }}
                  >
                    <Plus className="h-3.5 w-3.5" /> Je crée mon projet
                  </Button>
                }
              />
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
