import { SmartCard } from "@/components/ui-kit/SmartCard";
import { TrustBadge } from "@/components/ui-kit/TrustBadge";
import { MapPin, ArrowUpRight } from "lucide-react";

const opportunities = [
  {
    tag: "Service",
    color: "var(--scan)",
    title: "Plombier disponible ce soir",
    by: "Marc · pro vérifié",
    place: "Akwa · 1.2 km",
    trust: 92,
  },
  {
    tag: "Mission",
    color: "var(--flash)",
    title: "Livraison express samedi matin",
    by: "Atelier Lumen",
    place: "Bonanjo · 3 km",
    trust: 84,
  },
  {
    tag: "Lieu",
    color: "var(--trust)",
    title: "Co-working calme · prises USB-C",
    by: "Espace Maéva",
    place: "Bonapriso · 2 km",
    trust: 96,
  },
];

export function Opportunities() {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-medium text-muted-foreground">Opportunités proches</h2>
        <button className="text-[11px] text-muted-foreground hover:text-foreground">
          Découvrir
        </button>
      </div>
      <div className="space-y-2">
        {opportunities.map((o, i) => (
          <SmartCard key={i} className="!p-3">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[11px] font-semibold uppercase"
                style={{
                  background: `color-mix(in oklch, ${o.color} 18%, transparent)`,
                  color: o.color,
                  boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${o.color} 30%, transparent)`,
                }}
              >
                {o.tag[0]}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className="rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider"
                    style={{
                      color: o.color,
                      background: `color-mix(in oklch, ${o.color} 14%, transparent)`,
                    }}
                  >
                    {o.tag}
                  </span>
                  <TrustBadge score={o.trust} />
                </div>
                <p className="mt-1 truncate text-sm font-medium text-foreground/90">
                  {o.title}
                </p>
                <div className="mt-0.5 flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="truncate">{o.by}</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {o.place}
                  </span>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </div>
          </SmartCard>
        ))}
      </div>
    </section>
  );
}
