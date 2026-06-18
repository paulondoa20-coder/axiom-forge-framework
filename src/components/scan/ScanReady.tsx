import { Check, Sparkles, ArrowRight } from "lucide-react";

type Props = {
  color?: string;
  count: number;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  onView: () => void;
};

const DOTS = [
  { x: 22, y: 28 },
  { x: 72, y: 24 },
  { x: 18, y: 62 },
  { x: 78, y: 58 },
  { x: 50, y: 80 },
  { x: 38, y: 40 },
  { x: 82, y: 46 },
  { x: 30, y: 70 },
];

export function ScanReady({
  color = "var(--scan)",
  count,
  title = "Résultats prêts",
  subtitle = "Les signaux les plus pertinents ont émergé.",
  ctaLabel = "Voir les résultats",
  onView,
}: Props) {
  return (
    <div
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center overflow-hidden animate-[fade-up_0.4s_var(--ease-smooth)_both]"
      style={{
        background:
          "radial-gradient(80% 60% at 50% 50%, color-mix(in oklch, var(--background) 80%, transparent), var(--background))",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* slow halo waves */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              width: 140,
              height: 140,
              border: `1.5px solid color-mix(in oklch, ${color} 50%, transparent)`,
              animation: `pulse-ring 2.6s ease-out ${i * 0.7}s infinite`,
            }}
          />
        ))}

        {/* persistent dots */}
        {DOTS.map((d, i) => (
          <span
            key={i}
            className="absolute"
            style={{
              left: `${d.x}%`,
              top: `${d.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <span
              className="absolute -inset-2.5 rounded-full"
              style={{
                border: `1px solid color-mix(in oklch, ${color} 50%, transparent)`,
                animation: `pulse-ring 1.8s ease-out ${i * 0.18}s infinite`,
              }}
            />
            <span
              className="block h-2 w-2 rounded-full"
              style={{
                background: color,
                boxShadow: `0 0 12px ${color}, 0 0 0 4px color-mix(in oklch, ${color} 18%, transparent)`,
                animation: `dot-pop 0.5s var(--ease-spring) ${i * 60}ms both`,
              }}
            />
          </span>
        ))}

        {/* central check orb */}
        <div
          className="relative flex h-20 w-20 items-center justify-center rounded-full"
          style={{
            background: `radial-gradient(circle, ${color}, color-mix(in oklch, ${color} 30%, transparent) 60%, transparent 75%)`,
            boxShadow: `0 0 80px ${color}, 0 0 20px ${color} inset`,
            animation: "breathing 2.4s ease-in-out infinite",
          }}
        >
          <Check className="h-8 w-8 text-white" strokeWidth={3} />
        </div>
      </div>

      {/* legend + CTA */}
      <div className="relative z-10 mt-[42vh] flex flex-col items-center gap-3 px-6 text-center">
        <p className="ds-eyebrow inline-flex items-center gap-1.5" style={{ color }}>
          <Sparkles className="h-3 w-3" /> {count} signal{count > 1 ? "s" : ""} pertinent
          {count > 1 ? "s" : ""}
        </p>
        <h2 className="ds-display max-w-sm">{title}</h2>
        <p className="ds-body max-w-sm">{subtitle}</p>

        <button
          onClick={onView}
          className="mt-2 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition active:scale-95"
          style={{
            background: `linear-gradient(135deg, ${color}, color-mix(in oklch, ${color} 70%, white))`,
            boxShadow: `0 0 32px -6px ${color}`,
          }}
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
