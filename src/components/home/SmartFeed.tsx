import { SmartCard } from "@/components/ui-kit/SmartCard";
import { TrustBadge } from "@/components/ui-kit/TrustBadge";
import { Heart, MessageCircle, MapPin } from "lucide-react";

const posts = [
  {
    user: "Camille",
    handle: "@cami",
    type: "Flash",
    color: "var(--flash)",
    time: "2m",
    place: "Belleville",
    text: "Golden hour rooftop. Open invite for a chill evening ✨",
    trust: 92,
    likes: 24,
    comments: 4,
  },
  {
    user: "Arno",
    handle: "@arno",
    type: "Radar",
    color: "var(--radar)",
    time: "8m",
    place: "République",
    text: "Looking for a guitarist for an acoustic set tonight.",
    trust: 78,
    likes: 12,
    comments: 9,
  },
  {
    user: "Nina",
    handle: "@nina",
    type: "Scan",
    color: "var(--scan)",
    time: "16m",
    place: "Le Marais",
    text: "Tiny coffee spot — clean vibes, fast service, great matcha.",
    trust: 88,
    likes: 41,
    comments: 6,
  },
];

export function SmartFeed() {
  return (
    <section className="space-y-3">
      <h2 className="px-1 text-sm font-medium text-muted-foreground">For you</h2>
      <div className="space-y-3">
        {posts.map((p, i) => (
          <SmartCard key={i}>
            <div className="flex items-start gap-3">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                style={{
                  background: `color-mix(in oklch, ${p.color} 18%, transparent)`,
                  color: p.color,
                  boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${p.color} 30%, transparent)`,
                }}
              >
                {p.user[0]}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold">{p.user}</span>
                  <span className="truncate text-xs text-muted-foreground">{p.handle}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span
                    className="rounded-full px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider"
                    style={{
                      color: p.color,
                      background: `color-mix(in oklch, ${p.color} 14%, transparent)`,
                    }}
                  >
                    {p.type}
                  </span>
                  <TrustBadge score={p.trust} />
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">{p.text}</p>
                <div className="mt-2.5 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {p.place}
                  </span>
                  <span>{p.time}</span>
                  <span className="ml-auto flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5" /> {p.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3.5 w-3.5" /> {p.comments}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </SmartCard>
        ))}
      </div>
    </section>
  );
}
