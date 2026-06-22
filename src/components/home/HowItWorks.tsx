import { Sparkles, Compass, HandshakeIcon } from "lucide-react";
import { Handshake } from "lucide-react";

const steps = [
  {
    n: "01",
    icon: Sparkles,
    title: "Tu exprimes",
    desc: "Un besoin, une offre, un flash — en une phrase, c'est posé.",
    color: "var(--flash)",
  },
  {
    n: "02",
    icon: Compass,
    title: "VITALA oriente",
    desc: "Le bon hub, les bons profils, au bon moment — sans te perdre.",
    color: "var(--radar)",
  },
  {
    n: "03",
    icon: Handshake,
    title: "Tu connectes",
    desc: "Profils vérifiés, échanges clairs, confiance intégrée.",
    color: "var(--trust)",
  },
];

export function HowItWorks() {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-medium text-muted-foreground">Comment ça marche</h2>
        <span className="text-[11px] text-muted-foreground">3 étapes, zéro friction</span>
      </div>
      <div className="space-y-2">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className="glass-surface group relative flex items-start gap-3 overflow-hidden rounded-2xl p-3 transition-all hover:-translate-y-0.5"
            >
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-50"
                style={{ background: `radial-gradient(circle, ${s.color}, transparent 70%)` }}
              />
              <div
                className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                style={{
                  background: `color-mix(in oklch, ${s.color} 18%, transparent)`,
                  color: s.color,
                  boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${s.color} 30%, transparent)`,
                }}
              >
                <Icon className="h-5 w-5" strokeWidth={2.2} />
              </div>
              <div className="relative min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-bold tracking-widest"
                    style={{ color: s.color }}
                  >
                    {s.n}
                  </span>
                  <span className="text-sm font-semibold text-foreground/95">{s.title}</span>
                </div>
                <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">
                  {s.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
