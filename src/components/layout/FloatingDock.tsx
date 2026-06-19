import { Link, useLocation } from "@tanstack/react-router";
import { useState } from "react";
import { Home, Zap, Radar, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { CategoriesSheet } from "./CategoriesSheet";

const items = [
  { to: "/", label: "Home", icon: Home, color: "var(--primary)" },
  { to: "/flash", label: "Flash", icon: Zap, color: "var(--flash)" },
  { to: "/radar", label: "Radar", icon: Radar, color: "var(--radar)" },
] as const;

const ESPACES = {
  default: { label: "Espaces", color: "var(--trust)" },
  "/talents": { label: "Talents", color: "var(--radar)" },
  "/creation": { label: "Création", color: "var(--flash)" },
} as const;

export function FloatingDock() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const espace = ESPACES[pathname as keyof typeof ESPACES] || ESPACES.default;
  const active = pathname === "/talents" || pathname === "/creation";
  const expanded = active || open;

  return (
    <>
      <nav
        aria-label="Primary"
        className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 px-3"
      >
        <div className="glass-surface flex items-center gap-1 rounded-full p-1.5 shadow-[var(--shadow-float)]">
          {items.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative flex h-11 items-center justify-center overflow-hidden rounded-full transition-all duration-300 ease-[var(--ease-spring)]",
                  active ? "gap-1.5 px-4" : "w-11 hover:scale-105 active:scale-95"
                )}
                style={
                  active
                    ? {
                        background: `color-mix(in oklch, ${item.color} 18%, transparent)`,
                        boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${item.color} 45%, transparent), 0 0 22px -6px ${item.color}`,
                      }
                    : undefined
                }
              >
                {active && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-full opacity-60"
                    style={{
                      background: `radial-gradient(60% 100% at 50% 50%, color-mix(in oklch, ${item.color} 30%, transparent), transparent 70%)`,
                      animation: "pulse-soft 2.6s ease-in-out infinite",
                    }}
                  />
                )}
                <Icon
                  className={cn(
                    "relative h-5 w-5 transition-all duration-300 ease-[var(--ease-spring)]",
                    active ? "scale-110" : "text-muted-foreground group-hover:text-foreground group-hover:-translate-y-0.5"
                  )}
                  style={active ? { color: item.color } : undefined}
                  strokeWidth={active ? 2.4 : 2}
                />
                {active && (
                  <span
                    className="relative text-[12px] font-semibold tracking-tight animate-[fade-in_0.25s_var(--ease-spring)_both]"
                    style={{ color: item.color }}
                  >
                    {item.label}
                  </span>
                )}
                <span
                  className={cn(
                    "pointer-events-none absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full transition-all duration-300",
                    active ? "opacity-100" : "opacity-0"
                  )}
                  style={{ background: item.color, boxShadow: `0 0 8px ${item.color}` }}
                />
              </Link>
            );
          })}

          {/* Espaces — opens categories sheet */}
          <button
            type="button"
            aria-label={espace.label}
            aria-expanded={open}
            aria-current={active ? "page" : undefined}
            onClick={() => setOpen(true)}
            className={cn(
              "group relative flex h-11 items-center justify-center overflow-hidden rounded-full transition-all duration-300 ease-[var(--ease-spring)]",
              expanded ? "gap-1.5 px-4" : "w-11 hover:scale-105 active:scale-95"
            )}
            style={
              expanded
                ? {
                    background: `color-mix(in oklch, ${espace.color} 18%, transparent)`,
                    boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${espace.color} 45%, transparent), 0 0 22px -6px ${espace.color}`,
                  }
                : undefined
            }
          >
            {expanded && (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-full opacity-60"
                style={{
                  background: `radial-gradient(60% 100% at 50% 50%, color-mix(in oklch, ${espace.color} 30%, transparent), transparent 70%)`,
                  animation: "pulse-soft 2.6s ease-in-out infinite",
                }}
              />
            )}
            <LayoutGrid
              className={cn(
                "relative h-5 w-5 transition-all duration-300 ease-[var(--ease-spring)]",
                expanded ? "scale-110" : "text-muted-foreground group-hover:text-foreground group-hover:-translate-y-0.5"
              )}
              style={expanded ? { color: espace.color } : undefined}
              strokeWidth={expanded ? 2.4 : 2}
            />
            {expanded && (
              <span
                className="relative text-[12px] font-semibold tracking-tight animate-[fade-in_0.25s_var(--ease-spring)_both]"
                style={{ color: espace.color }}
              >
                {open ? "Espaces" : espace.label}
              </span>
            )}
            <span
              className={cn(
                "pointer-events-none absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full transition-all duration-300",
                active ? "opacity-100" : "opacity-0"
              )}
              style={{ background: espace.color, boxShadow: `0 0 8px ${espace.color}` }}
            />
          </button>
        </div>
      </nav>

      {open && <CategoriesSheet onClose={() => setOpen(false)} />}
    </>
  );
}
