import { Radio } from "lucide-react";

type Item = { icon?: React.ReactNode; text: string };

type Props = {
  items: Item[];
  accent?: string;
  label?: string;
};

/**
 * Bandeau "ça bouge maintenant" — marquee infini + point pulsant.
 * Animation modérée, accessible (pause au hover, prefers-reduced-motion).
 */
export function LivePulse({ items, accent = "var(--radar)", label = "En direct" }: Props) {
  const loop = [...items, ...items];
  return (
    <div
      className="glass-surface group relative overflow-hidden rounded-2xl border-white/10 px-3 py-2"
      role="status"
      aria-live="polite"
      aria-label={`${label}: ${items.map((i) => i.text).join(", ")}`}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex shrink-0 items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
          style={{
            background: `color-mix(in oklch, ${accent} 14%, transparent)`,
            color: accent,
          }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span
              className="absolute inset-0 animate-ping rounded-full opacity-75"
              style={{ background: accent }}
            />
            <span
              className="relative h-1.5 w-1.5 rounded-full"
              style={{ background: accent }}
            />
          </span>
          <Radio className="h-3 w-3" aria-hidden />
          {label}
        </div>

        <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]">
          <div
            className="flex w-max gap-6 whitespace-nowrap text-[12px] motion-safe:animate-[marquee_30s_linear_infinite] motion-reduce:animate-none group-hover:[animation-play-state:paused]"
          >
            {loop.map((it, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 text-muted-foreground">
                {it.icon && (
                  <span className="opacity-80" style={{ color: accent }}>
                    {it.icon}
                  </span>
                )}
                <span className="text-foreground/90">{it.text}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </div>
  );
}
