import { Link } from "@tanstack/react-router";
import { SmartCard } from "@/components/ui-kit/SmartCard";
import { MessageCircle, MapPin, Zap } from "lucide-react";
import { useFlashFeed, flashTitle, flashBody, flashAge } from "@/domains/publication";

const TYPE_TINT: Record<string, { label: string; color: string }> = {
  sale: { label: "Flash", color: "var(--flash)" },
  service: { label: "Service", color: "var(--scan)" },
  urgent: { label: "Urgent", color: "var(--live)" },
  offer: { label: "Offre", color: "var(--radar)" },
  promo: { label: "Promo", color: "var(--warning)" },
};

function tintFor(category: string | null) {
  return TYPE_TINT[category ?? ""] ?? { label: "Flash", color: "var(--flash)" };
}

export function SmartFeed() {
  const { flashes, loading } = useFlashFeed(5);

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between px-1">
        <h2 className="text-sm font-medium text-muted-foreground">Ça bouge près de chez toi</h2>
        <Link to="/flash" className="text-[11px] text-muted-foreground hover:text-foreground">
          Tout voir
        </Link>
      </div>

      {loading && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <SmartCard key={i} className="flex items-start gap-3">
              <div className="h-9 w-9 shrink-0 animate-pulse rounded-full bg-overlay" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/3 animate-pulse rounded bg-overlay" />
                <div className="h-3 w-4/5 animate-pulse rounded bg-overlay" />
                <div className="h-2.5 w-1/4 animate-pulse rounded bg-overlay" />
              </div>
            </SmartCard>
          ))}
        </div>
      )}

      {!loading && flashes.length === 0 && (
        <SmartCard className="flex flex-col items-center gap-2 p-6 text-center">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{
              background: "color-mix(in oklch, var(--flash) 18%, transparent)",
              color: "var(--flash)",
            }}
          >
            <Zap className="h-4 w-4" />
          </span>
          <p className="text-sm font-medium">Personne n'a encore parlé</p>
          <p className="max-w-[30ch] text-xs text-muted-foreground">
            Lance le premier Flash, le quartier répond vite.
          </p>
          <Link
            to="/flash"
            className="mt-1 rounded-full px-4 py-2 text-xs font-semibold text-[oklch(0.18_0.02_60)]"
            style={{ background: "var(--gradient-flash)" }}
          >
            Publier un Flash
          </Link>
        </SmartCard>
      )}

      {!loading && flashes.length > 0 && (
        <div className="space-y-3">
          {flashes.map((p) => {
            const tint = tintFor(p.category);
            const name = p.author?.displayName ?? "Voisin·e";
            const body = flashBody(p.content);
            const place = p.neighborhood ?? p.city;
            return (
              <Link key={p.id} to="/flash" className="block">
                <SmartCard className="transition-transform hover:-translate-y-0.5">
                  <div className="flex items-start gap-3">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold uppercase"
                      style={{
                        background: `color-mix(in oklch, ${tint.color} 18%, transparent)`,
                        color: tint.color,
                        boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${tint.color} 30%, transparent)`,
                      }}
                    >
                      {name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate text-sm font-semibold">{name}</span>
                        <span
                          className="rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider"
                          style={{
                            color: tint.color,
                            background: `color-mix(in oklch, ${tint.color} 14%, transparent)`,
                          }}
                        >
                          {tint.label}
                        </span>
                        {p.pending && (
                          <span className="text-[10px] text-muted-foreground">en attente</span>
                        )}
                      </div>
                      <p className="mt-1.5 text-sm font-medium leading-snug">
                        {flashTitle(p.content)}
                      </p>
                      {body && (
                        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-foreground/80">
                          {body}
                        </p>
                      )}
                      <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        {place && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {place}
                          </span>
                        )}
                        <span>{flashAge(p.createdAt)}</span>
                        <span className="ml-auto flex items-center gap-1">
                          <MessageCircle className="h-3.5 w-3.5" /> Répondre
                        </span>
                      </div>
                    </div>
                  </div>
                </SmartCard>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
