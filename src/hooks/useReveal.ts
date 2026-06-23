import { useEffect, useRef } from "react";

/**
 * Scroll-reveal hook — adds `is-revealed` class when element enters viewport.
 * Pair with the `.reveal` utility in styles.css.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit = { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("is-revealed");
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          el.classList.add("is-revealed");
          io.unobserve(el);
        }
      });
    }, options);
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return ref;
}
