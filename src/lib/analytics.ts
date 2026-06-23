/**
 * Lightweight analytics helpers for the Home page.
 * - track(): logs an event (console + window.dataLayer if present + custom event)
 * - useSectionTime(): mesure le temps passé sur une section (sortie de viewport)
 * - useScrollDepth(): jalons 25/50/75/100% du document
 *
 * Volontairement sans dépendance — branchable plus tard sur GA/Plausible/Posthog
 * via window.addEventListener("vitala:analytics", ...).
 */
import { useEffect, useRef } from "react";

export type AnalyticsEvent = {
  name: string;
  props?: Record<string, unknown>;
  ts?: number;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    __vitalaScrollDepth?: Set<number>;
  }
}

export function track(name: string, props: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const payload: AnalyticsEvent = { name, props, ts: Date.now() };
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: name, ...props });
    window.dispatchEvent(new CustomEvent("vitala:analytics", { detail: payload }));
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug("[analytics]", name, props);
    }
  } catch {
    /* noop */
  }
}

/** Tracks total visible time of a section (fires once it leaves the viewport / unmounts). */
export function useSectionTime(section: string) {
  const ref = useRef<HTMLElement | null>(null);
  const visibleSince = useRef<number | null>(null);
  const totalMs = useRef(0);
  const reported = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const flush = (reason: string) => {
      if (visibleSince.current != null) {
        totalMs.current += Date.now() - visibleSince.current;
        visibleSince.current = null;
      }
      if (!reported.current && totalMs.current > 600) {
        reported.current = true;
        track("section_time", { section, ms: Math.round(totalMs.current), reason });
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            visibleSince.current = Date.now();
          } else if (visibleSince.current != null) {
            totalMs.current += Date.now() - visibleSince.current;
            visibleSince.current = null;
          }
        });
      },
      { threshold: 0.35 },
    );
    io.observe(el);

    const onHide = () => {
      if (document.visibilityState === "hidden") flush("hidden");
    };
    document.addEventListener("visibilitychange", onHide);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onHide);
      flush("unmount");
    };
  }, [section]);

  return ref;
}

/** Fires scroll_depth events at 25/50/75/100% (once per page load). */
export function useScrollDepth(page = "home") {
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.__vitalaScrollDepth = new Set<number>();
    const marks = [25, 50, 75, 100];

    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = (h.scrollTop + window.innerHeight) / h.scrollHeight;
      const pct = Math.min(100, Math.round(scrolled * 100));
      for (const m of marks) {
        if (pct >= m && !window.__vitalaScrollDepth!.has(m)) {
          window.__vitalaScrollDepth!.add(m);
          track("scroll_depth", { page, depth: m });
        }
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [page]);
}
