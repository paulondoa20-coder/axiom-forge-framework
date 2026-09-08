import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AuthSessionState = {
  loading: boolean;
  isAuthenticated: boolean;
  email: string | null;
};

/** Reactive Supabase session state for UI affordances (banners, CTA). */
export function useAuthSession(): AuthSessionState {
  const [state, setState] = useState<AuthSessionState>({
    loading: true,
    isAuthenticated: false,
    email: null,
  });

  useEffect(() => {
    let alive = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setState({
        loading: false,
        isAuthenticated: Boolean(data.session),
        email: data.session?.user.email ?? null,
      });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setState({
        loading: false,
        isAuthenticated: Boolean(session),
        email: session?.user.email ?? null,
      });
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}
