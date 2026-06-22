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
  return (
    <AppShell>
      <div className="space-y-7 animate-[fade-up_0.5s_var(--ease-smooth)_both]">
        <SmartHero />
        <LivePulse items={HOME_LIVE} label="Ça bouge" accent="var(--radar)" />
        <HubGrid />
        <HowItWorks />
        <LiveStrip />
        <Opportunities />
        <SmartSuggestions />
        <CommunityPulse />
        <TrustHint />
        <RecentActivity />
        <FinalCTA />
      </div>
    </AppShell>
  );
}
