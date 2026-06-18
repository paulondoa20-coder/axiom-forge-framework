import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "surface" | "glass" | "hub";

type Props = HTMLAttributes<HTMLDivElement> & {
  variant?: Variant;
  hubColor?: string;
  interactive?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
};

const PAD = { none: "", sm: "p-3", md: "p-4", lg: "p-5" } as const;

export const DSCard = forwardRef<HTMLDivElement, Props>(function DSCard(
  { variant = "surface", hubColor, interactive, padding = "md", className, style, ...rest },
  ref,
) {
  const accent = hubColor ?? "var(--primary)";
  const variantStyle =
    variant === "hub"
      ? {
          background: `color-mix(in oklch, ${accent} 10%, transparent)`,
          boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${accent} 24%, transparent)`,
        }
      : variant === "glass"
        ? undefined
        : undefined;

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl transition-all",
        variant === "glass" && "glass-surface",
        variant === "surface" && "ds-card",
        PAD[padding],
        interactive && "cursor-pointer hover:translate-y-[-1px] active:scale-[0.99]",
        className,
      )}
      style={{ ...variantStyle, ...style }}
      {...rest}
    />
  );
});

export function CardHeader({ eyebrow, title, icon }: { eyebrow?: string; title: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 mb-2">
      {icon}
      <div className="min-w-0">
        {eyebrow && <p className="ds-eyebrow">{eyebrow}</p>}
        <p className="ds-title truncate">{title}</p>
      </div>
    </div>
  );
}
