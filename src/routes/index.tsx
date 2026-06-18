import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { SmartHero } from "@/components/home/SmartHero";
import { HubGrid } from "@/components/home/HubGrid";
import { LiveStrip } from "@/components/home/LiveStrip";
import { SmartSuggestions } from "@/components/home/SmartSuggestions";
import { TrustHint } from "@/components/home/TrustHint";
import { RecentActivity } from "@/components/home/RecentActivity";
import { Opportunities } from "@/components/home/Opportunities";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Home — VITALA" },
      {
        name: "description",
        content:
          "VITALA — un centre intelligent pour publier, exprimer un besoin, découvrir et vérifier en toute confiance.",
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
        <HubGrid />
        <LiveStrip />
        <Opportunities />
        <SmartSuggestions />
        <TrustHint />
        <RecentActivity />
      </div>
    </AppShell>
  );
}
