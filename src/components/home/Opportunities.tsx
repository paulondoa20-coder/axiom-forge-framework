import { Link } from "@tanstack/react-router";
import { SmartCard } from "@/components/ui-kit/SmartCard";
import { TrustBadge } from "@/components/ui-kit/TrustBadge";
import { MapPin, ArrowUpRight } from "lucide-react";

const opportunities = [
  {
    to: "/scan",
    tag: "Service",
    color: "var(--scan)",
    title: "Plombier dispo ce soir — réparation rapide",
    by: "Marc · pro vérifié",
    place: "Akwa · 1,2 km",
    trust: 92,
  },
  {
    to: "/flash",
    tag: "Mission",
    color: "var(--flash)",
    title: "Livraison express samedi matin sur Bonanjo",
    by: "Atelier Lumen",
    place: "Bonanjo · 3 km",
    trust: 84,
  },
  {
    to: "/scan",
    tag: "Lieu",
    color: "var(--trust)",
    title: "Co-working calme · prises USB-C · café gratuit",
    by: "Espace Maéva",
    place: "Bonapriso · 2 km",
    trust: 96,
  },
] as const;

export function Opportunities() {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-medium text-muted-foreground">Opportunités proches</h2>
        <Link to="/scan" className="text-[11px] text-muted-foreground hover:text-foreground">
          Tout voir
        </Link>
      </div>
      <div className="space-y-2">
        {opportunities.map((o, i) => (
          <Link key={i} to={o.to} className="block">
            <SmartCard className="!p-3 transition-all hover:-translate-y-0.5 active:scale-[0.99]">
              <div className="flex items-start gap-3">
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
                  <div className="flex flex-wrap items-center gap-2">
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
                  <p className="mt-1 text-sm font-medium leading-snug text-foreground/90">
                    {o.title}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                    <span>{o.by}</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {o.place}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </div>
            </SmartCard>
          </Link>
        ))}
      </div>
    </section>
  );
}
