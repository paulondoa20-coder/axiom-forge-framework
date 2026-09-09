import { Link } from "@tanstack/react-router";
import { LogIn, Lock } from "lucide-react";

interface SignInGateProps {
  title?: string;
  description?: string;
  redirect: string;
}

/** Presentational sign-in invitation shown instead of a blank/unauthorized screen. */
export function SignInGate({
  title = "Connecte-toi pour continuer",
  description = "Cette partie de VITALA a besoin de ton compte.",
  redirect,
}: SignInGateProps) {
  return (
    <div className="glass-surface mx-auto flex max-w-sm flex-col items-center gap-3 rounded-2xl px-5 py-8 text-center">
      <span
        className="flex h-11 w-11 items-center justify-center rounded-full"
        style={{ background: "var(--surface-3)" }}
      >
        <Lock className="h-5 w-5" />
      </span>
      <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
      <Link
        to="/auth"
        search={{ redirect }}
        className="mt-1 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
        style={{ background: "var(--live)" }}
      >
        <LogIn className="h-4 w-4" />
        Se connecter
      </Link>
    </div>
  );
}

/** Compact warning banner explaining the offline/local-only mode. */
export function SignInBanner({ redirect }: { redirect: string }) {
  return (
    <div
      className="flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-xl px-3.5 py-2.5 text-xs"
      style={{ background: "var(--surface-2)" }}
    >
      <span className="text-muted-foreground">
        Mode démo : sans compte, pas de temps réel ni d'accusés de lecture.
      </span>
      <Link
        to="/auth"
        search={{ redirect }}
        className="font-semibold"
        style={{ color: "var(--live)" }}
      >
        Se connecter
      </Link>
    </div>
  );
}
