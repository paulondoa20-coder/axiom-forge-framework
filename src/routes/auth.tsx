import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useSession } from "@/hooks/useSession";
import { cn } from "@/lib/utils";
import { LogIn, UserPlus, Loader as Loader2, TriangleAlert as AlertTriangle, Mail } from "lucide-react";

interface AuthSearch {
  redirect?: string;
}

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): AuthSearch => ({
    redirect:
      typeof search['redirect'] === "string" && search['redirect'].startsWith("/")
        ? (search['redirect'] as string)
        : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Connexion — VITALA" },
      {
        name: "description",
        content: "Connecte-toi à VITALA pour retrouver tes conversations, tes flashs et ton profil de confiance.",
      },
      { property: "og:title", content: "Connexion — VITALA" },
      {
        property: "og:description",
        content: "Rejoins le quartier : messages en temps réel, flashs et confiance vérifiée.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth" });
  const { signedIn } = useSession();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    if (signedIn) {
      void navigate({ to: (search.redirect ?? "/") as string, replace: true });
    }
  }, [signedIn, navigate, search.redirect]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      if (mode === "signup") {
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (err) throw err;
        if (!data.session) {
          setInfo("Compte créé. Vérifie ta boîte mail pour confirmer, puis reviens te connecter.");
        }
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connexion impossible pour le moment.");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setError(null);
    try {
      await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google indisponible pour le moment.");
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-6 px-5 py-10">
      <header className="space-y-1.5 text-center">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">VITALA</p>
        <h1 className="text-2xl font-semibold tracking-tight">
          {mode === "signin" ? "Content de te revoir" : "Rejoins le quartier"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {mode === "signin"
            ? "Connecte-toi pour retrouver tes conversations."
            : "Crée ton compte, ça prend 30 secondes."}
        </p>
      </header>

      <div className="glass-surface space-y-4 rounded-2xl p-5">
        <button
          type="button"
          onClick={google}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all hover:brightness-110"
          style={{ background: "var(--surface-3)" }}
        >
          <Mail className="h-4 w-4" />
          Continuer avec Google
        </button>

        <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest text-muted-foreground">
          <span className="h-px flex-1" style={{ background: "var(--surface-3)" }} />
          ou
          <span className="h-px flex-1" style={{ background: "var(--surface-3)" }} />
        </div>

        <form onSubmit={submit} className="space-y-3">
          <label className="block space-y-1.5">
            <span className="text-xs text-muted-foreground">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none"
              style={{ background: "var(--surface-2)" }}
              placeholder="toi@exemple.com"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs text-muted-foreground">Mot de passe</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none"
              style={{ background: "var(--surface-2)" }}
              placeholder="••••••••"
            />
          </label>

          {error && (
            <p className="flex items-start gap-2 rounded-xl px-3 py-2 text-xs" style={{ background: "color-mix(in oklch, var(--destructive) 14%, transparent)", color: "var(--destructive)" }}>
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span className="break-words">{error}</span>
            </p>
          )}
          {info && (
            <p className="rounded-xl px-3 py-2 text-xs" style={{ background: "var(--surface-2)" }}>
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all",
              busy && "opacity-60",
            )}
            style={{ background: "var(--live)" }}
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "signin" ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
            {mode === "signin" ? "Se connecter" : "Créer mon compte"}
          </button>
        </form>
      </div>

      <button
        type="button"
        onClick={() => {
          setMode(mode === "signin" ? "signup" : "signin");
          setError(null);
          setInfo(null);
        }}
        className="text-center text-xs text-muted-foreground underline-offset-4 hover:underline"
      >
        {mode === "signin" ? "Pas encore de compte ? Créer un compte" : "Déjà inscrit ? Se connecter"}
      </button>
    </main>
  );
}
