import { useEffect, useState } from "react";
import { hasSession, onIdentityChange } from "@/packages/auth";

/**
 * useSession — SSR-safe boolean session state.
 * `undefined` while unknown (SSR / first check), then true/false.
 */
export function useSession(): { signedIn: boolean | undefined } {
  const [signedIn, setSignedIn] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    void hasSession().then((v) => {
      if (!cancelled) setSignedIn(v);
    });
    const unsubscribe = onIdentityChange((v) => setSignedIn(v));
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return { signedIn };
}
