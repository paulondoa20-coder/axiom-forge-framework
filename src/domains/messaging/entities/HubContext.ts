export type HubContext = "flash" | "radar" | "scan" | "trust";

export const HUB_META: Record<HubContext, { label: string; color: string; gradient: string }> = {
  flash: { label: "Flash", color: "var(--flash)", gradient: "var(--gradient-flash)" },
  radar: { label: "Radar", color: "var(--radar)", gradient: "var(--gradient-radar)" },
  scan: { label: "Scan", color: "var(--scan)", gradient: "var(--gradient-scan)" },
  trust: { label: "Trust", color: "var(--trust)", gradient: "var(--gradient-trust)" },
};
