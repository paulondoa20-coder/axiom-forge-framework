import { createFileRoute } from "@tanstack/react-router";
import { Zap, Radar, ShieldCheck, MapPin } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { SmartHero } from "@/components/home/SmartHero";
import { HubGrid } from "@/components/home/HubGrid";
import { LiveStrip } from "@/components/home/LiveStrip";
import { SmartSuggestions } from "@/components/home/SmartSuggestions";
import { TrustHint } from "@/components/home/TrustHint";
import { RecentActivity } from "@/components/home/RecentActivity";
import { Opportunities } from "@/components/home/Opportunities";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CommunityPulse } from "@/components/home/CommunityPulse";
import { FinalCTA } from "@/components/home/FinalCTA";
import { LivePulse } from "@/components/ui-kit/LivePulse";
import { FeaturesShowcase } from "@/components/home/FeaturesShowcase";
import { UseCases } from "@/components/home/UseCases";
import { QuickFAQ } from "@/components/home/QuickFAQ";
import { CTAJourney } from "@/components/home/CTAJourney";
import { Reveal } from "@/components/home/Reveal";
import { Testimonials } from "@/components/home/Testimonials";
import { track, useScrollDepth, useSectionTime } from "@/lib/analytics";
import { useEffect } from "react";

const HOME_LIVE = [
  { icon: <Zap className="h-3 w-3" />, text: "Marc vient de publier un flash livraison" },
  { icon: <Radar className="h-3 w-3" />, text: "3 besoins urgents à Akwa" },
  { icon: <ShieldCheck className="h-3 w-3" />, text: "Léa a vérifié son profil" },
  { icon: <MapPin className="h-3 w-3" />, text: "Nouveau lieu repéré à Bonapriso" },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VITALA — Publie, demande, découvre, vérifie" },
      {
        name: "description",
        content:
          "VITALA — l'app intelligente qui connecte ta communauté : publie un flash, exprime un besoin, découvre les bons profils et vérifie leur fiabilité, au même endroit.",
      },
      { property: "og:title", content: "VITALA — Une app, mille possibilités" },
      {
        property: "og:description",
        content:
          "Flash, Radar, Scan, Trust : 4 hubs pour bouger vite et bien dans ta ville.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  useScrollDepth("home");
  useEffect(() => {
    track("page_view", { page: "home" });
  }, []);

  const heroRef = useSectionTime("hero");
  const journeyRef = useSectionTime("cta_journey");
  const featuresRef = useSectionTime("features");
  const testimonialsRef = useSectionTime("testimonials");
  const faqRef = useSectionTime("faq");

  return (
    <AppShell>
      <div className="space-y-7 animate-[fade-up_0.5s_var(--ease-smooth)_both] motion-reduce:animate-none">
        <section ref={heroRef as never}>
          <SmartHero />
        </section>
        <LivePulse items={HOME_LIVE} label="Ça bouge" accent="var(--radar)" />
        <Reveal><HubGrid /></Reveal>
        <section ref={journeyRef as never}>
          <Reveal delay={60}><CTAJourney /></Reveal>
        </section>
        <Reveal><HowItWorks /></Reveal>
        <section ref={featuresRef as never}>
          <Reveal><FeaturesShowcase /></Reveal>
        </section>
        <Reveal><LiveStrip /></Reveal>
        <Reveal><Opportunities /></Reveal>
        <Reveal><UseCases /></Reveal>
        <Reveal><SmartSuggestions /></Reveal>
        <Reveal><CommunityPulse /></Reveal>
        <section ref={testimonialsRef as never}>
          <Reveal><Testimonials /></Reveal>
        </section>
        <section ref={faqRef as never}>
          <Reveal><QuickFAQ /></Reveal>
        </section>
        <Reveal><TrustHint /></Reveal>
        <Reveal><RecentActivity /></Reveal>
        <Reveal><FinalCTA /></Reveal>
      </div>
    </AppShell>
  );
}
