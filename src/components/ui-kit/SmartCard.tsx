import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SmartCard({
  children,
  className,
  glow,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  glow?: "flash" | "radar" | "scan" | "trust";
  onClick?: () => void;
}) {
  const glowStyle = glow ? { boxShadow: `0 0 40px -16px var(--${glow})` } : undefined;
  return (
    <div
      onClick={onClick}
      style={glowStyle}
      className={cn(
        "glass-surface group relative rounded-2xl p-4 transition-all duration-300",
        onClick && "cursor-pointer hover:-translate-y-0.5 active:scale-[0.99]",
        className
      )}
    >
      {children}
    </div>
  );
}
