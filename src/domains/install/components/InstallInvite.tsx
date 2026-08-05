import { useState } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { useInstallPrompt } from "../hooks/useInstallPrompt";
import { InstallGuideDialog } from "./InstallGuideDialog";

/**
 * Invitation d'installation (UI présentationnelle).
 * Aucune logique métier ici : tout passe par `useInstallPrompt`.
 */
export function InstallInvite() {
  const { shouldInvite, platform, canPrompt, install, dismiss } = useInstallPrompt();
  const [guideOpen, setGuideOpen] = useState(false);

  if (!shouldInvite) return null;

  const handleInstall = async () => {
    const result = await install();
    if (result === "manual") setGuideOpen(true);
    if (result === "accepted") dismiss();
  };

  return (
    <>
      <div
        role="dialog"
        aria-label="Installer VITALA"
        className="fixed inset-x-0 bottom-24 z-40 mx-auto w-full max-w-md px-4 animate-[fade-in_0.35s_var(--ease-spring)_both]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="glass-surface flex items-center gap-3 rounded-3xl p-3 shadow-[var(--shadow-float)]">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
            style={{
              background: "var(--gradient-hero)",
              boxShadow: "inset 0 0 0 1px var(--glass-border), 0 0 18px -6px var(--primary)",
            }}
          >
            <Smartphone className="h-5 w-5" />
          </span>

          <div className="flex min-w-0 flex-1 flex-col">
            <p className="text-[13px] font-semibold leading-tight text-foreground">
              VITALA sur ton écran
            </p>
            <p className="text-[11px] leading-snug text-muted-foreground">
              {canPrompt ? "Installe l'app en un clic." : "Ajoute-la à l'écran d'accueil."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleInstall}
            className="flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[12px] font-semibold transition-transform duration-200 hover:scale-105 active:scale-95"
            style={{
              background: "color-mix(in oklch, var(--primary) 22%, transparent)",
              boxShadow: "inset 0 0 0 1px color-mix(in oklch, var(--primary) 45%, transparent)",
              color: "var(--primary)",
            }}
          >
            <Download className="h-3.5 w-3.5" />
            Installer
          </button>

          <button
            type="button"
            onClick={dismiss}
            aria-label="Plus tard"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <InstallGuideDialog open={guideOpen} onOpenChange={setGuideOpen} platform={platform} />
    </>
  );
}
