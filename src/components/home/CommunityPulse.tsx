import { Users, Star, Zap } from "lucide-react";

const stats = [
  { value: "12k+", label: "membres actifs", icon: Users, color: "var(--radar)" },
  { value: "4.9", label: "note moyenne", icon: Star, color: "var(--flash)" },
  { value: "< 2 min", label: "première réponse", icon: Zap, color: "var(--trust)" },
];

const voices = [
  {
    name: "Aïcha",
    role: "couturière · Akwa",
    text: "J'ai trouvé mes 3 premiers clients en une semaine. Le Radar, c'est du sérieux.",
    color: "var(--radar)",
  },
  {
    name: "Samir",
    role: "livreur express",
    text: "Flash m'a sauvé un samedi. Mission postée, prise en 4 minutes.",
    color: "var(--flash)",
  },
];

export function CommunityPulse() {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-medium text-muted-foreground">La communauté en chiffres</h2>
        <span className="text-[11px] text-muted-foreground">mis à jour en continu</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className="glass-surface relative overflow-hidden rounded-xl p-3 text-center"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  background: `radial-gradient(circle at 50% 0%, color-mix(in oklch, ${s.color} 20%, transparent), transparent 60%)`,
                }}
              />
              <Icon
                className="relative mx-auto mb-1 h-3.5 w-3.5"
                style={{ color: s.color }}
              />
              <p
                className="relative text-base font-bold tracking-tight"
                style={{ color: s.color }}
              >
                {s.value}
              </p>
              <p className="relative text-[10px] leading-tight text-muted-foreground">
                {s.label}
              </p>
            </div>
          );
        })}
      </div>

      <div className="space-y-2">
        {voices.map((v, i) => (
          <div
            key={i}
            className="glass-surface relative overflow-hidden rounded-2xl p-3"
          >
            <div
              className="pointer-events-none absolute left-0 top-0 h-full w-1"
              style={{ background: v.color }}
            />
            <p className="pl-2 text-[13px] italic leading-relaxed text-foreground/90">
              « {v.text} »
            </p>
            <p className="mt-1.5 pl-2 text-[11px] text-muted-foreground">
              <span className="font-semibold text-foreground/80">{v.name}</span> · {v.role}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
