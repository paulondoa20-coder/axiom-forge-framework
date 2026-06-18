import { useEffect, useState } from "react";
import { Radar } from "lucide-react";

type Props = {
  color?: string;
  duration?: number; // total ms
  title?: string;
  subtitle?: string;
  onComplete?: () => void;
};

const SIGNALS = [
  { x: 28, y: 22, d: 450 },
  { x: 68, y: 28, d: 750 },
  { x: 18, y: 58, d: 1050 },
  { x: 78, y: 62, d: 1350 },
  { x: 50, y: 78, d: 1650 },
  { x: 42, y: 38, d: 1950 },
  { x: 82, y: 44, d: 2250 },
  { x: 14, y: 38, d: 2550 },
  { x: 60, y: 55, d: 2850 },
  { x: 35, y: 68, d: 3150 },
];

export function ScanWaves({
  color = "var(--scan)",
  duration = 3800,
  title = "Scan en cours…",
  subtitle = "L'application explore l'écosystème autour de vous.",
  onComplete,
}: Props) {
  const [visible, setVisible] = useState<number[]>([]);

  useEffect(() => {
    const timers = SIGNALS.map((s, i) =>
      setTimeout(() => setVisible((v) => [...v, i]), s.d),
    );
    const end = setTimeout(() => onComplete?.(), duration);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(end);
    };
  }, [duration, onComplete]);

  return (
    <div
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center overflow-hidden animate-[fade-up_0.4s_var(--ease-smooth)_both]"
      style={{
        background:
          "radial-gradient(80% 60% at 50% 50%, color-mix(in oklch, var(--background) 80%, transparent), var(--background))",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* sweeping waves */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              width: 120,
              height: 120,
              border: `1.5px solid color-mix(in oklch, ${color} 55%, transparent)`,
              animation: `scan-wave 3s ease-out ${i * 0.6}s infinite`,
            }}
          />
        ))}

        {/* rotating sweep line */}
        <span
          className="absolute h-[120vmax] w-[120vmax] rounded-full"
          style={{
            background: `conic-gradient(from 0deg, transparent 0deg, color-mix(in oklch, ${color} 32%, transparent) 30deg, transparent 60deg)`,
            mask: "radial-gradient(circle, black 0, black 38%, transparent 38%)",
            WebkitMask:
              "radial-gradient(circle, black 0, black 38%, transparent 38%)",
            animation: "scan-sweep 3.2s linear infinite",
            opacity: 0.55,
          }}
        />

        {/* central orb */}
        <div
          className="relative flex h-20 w-20 items-center justify-center rounded-full"
          style={{
            background: `radial-gradient(circle, ${color}, color-mix(in oklch, ${color} 30%, transparent) 60%, transparent 75%)`,
            boxShadow: `0 0 80px ${color}, 0 0 20px ${color} inset`,
            animation: "breathing 2.4s ease-in-out infinite",
          }}
        >
          <Radar className="h-7 w-7 text-white/90" />
        </div>
      </div>

      {/* detected signals */}
      <div className="pointer-events-none absolute inset-0">
        {SIGNALS.map((s, i) =>
          visible.includes(i) ? (
            <span
              key={i}
              className="absolute"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <span
                className="absolute -inset-3 rounded-full"
                style={{
                  border: `1px solid color-mix(in oklch, ${color} 60%, transparent)`,
                  animation: "pulse-ring 1.6s ease-out infinite",
                }}
              />
              <span
                className="block h-2.5 w-2.5 rounded-full"
                style={{
                  background: color,
                  boxShadow: `0 0 14px ${color}, 0 0 0 5px color-mix(in oklch, ${color} 18%, transparent)`,
                  animation: "dot-pop 0.55s var(--ease-spring) both",
                }}
              />
            </span>
          ) : null,
        )}
      </div>

      {/* legend */}
      <div className="relative z-10 mt-[42vh] flex flex-col items-center gap-2 px-6 text-center">
        <p className="ds-eyebrow" style={{ color }}>
          ● SCAN ACTIF
        </p>
        <h2 className="ds-display max-w-sm">{title}</h2>
        <p className="ds-body max-w-sm">{subtitle}</p>
        <p className="ds-caption mt-1">
          {visible.length} signal{visible.length > 1 ? "aux" : ""} détecté
          {visible.length > 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
}
