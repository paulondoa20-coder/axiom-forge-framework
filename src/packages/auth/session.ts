import { supabase } from "@/integrations/supabase/client";

/** True when a Supabase session with a bearer token is available. */
export async function hasSession(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    const { data } = await supabase.auth.getSession();
    return Boolean(data.session?.access_token);
  } catch {
    return false;
  }
}

/**
 * Subscribe to identity transitions (sign-in / sign-out).
 * Used by domains to refresh their data as soon as a session appears.
 */
export function onIdentityChange(cb: (signedIn: boolean) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
    cb(Boolean(session));
  });
  return () => data.subscription.unsubscribe();
}
