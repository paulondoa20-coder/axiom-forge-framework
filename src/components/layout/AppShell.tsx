import { ReactNode, useEffect } from "react";
import { FloatingDock } from "./FloatingDock";
import { TopBar } from "./TopBar";
import { AIAssistant } from "@/components/ai/AIAssistant";
import { Onboarding } from "@/components/onboarding/Onboarding";
import { startAutoSync } from "@/packages/offline";

export function AppShell({ children }: { children: ReactNode }) {
  // Bootstrap the offline outbox sync (client-only, no-op on SSR).
  useEffect(() => {
    startAutoSync();
  }, []);

  return (
    <div className="dark relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 hero-bg opacity-70" />
      <div className="pointer-events-none fixed inset-0 [background:radial-gradient(circle_at_50%_-20%,oklch(0.3_0.1_270/0.4),transparent_60%)]" />
      <main className="relative z-10 mx-auto w-full max-w-md px-4 pb-32 pt-3">
        <TopBar />
        {children}
      </main>
      <AIAssistant />
      <FloatingDock />
      <Onboarding />
    </div>
  );
}
