import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "soft" | "hub";
type Size = "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  hubColor?: string; // CSS color/var for hub variant
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  loading?: boolean;
  block?: boolean;
};

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-full",
  md: "h-10 px-4 text-sm gap-1.5 rounded-full",
  lg: "h-12 px-5 text-[15px] gap-2 rounded-full",
};

export const DSButton = forwardRef<HTMLButtonElement, Props>(function DSButton(
  { variant = "primary", size = "md", hubColor, iconLeft, iconRight, loading, block, className, children, disabled, style, ...rest },
  ref,
) {
  const accent = hubColor ?? "var(--primary)";
  const variantStyle =
    variant === "primary"
      ? {
          background: `color-mix(in oklch, ${accent} 22%, transparent)`,
          boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${accent} 45%, transparent), 0 0 16px -4px ${accent}`,
          color: accent,
        }
      : variant === "soft"
        ? {
            background: `color-mix(in oklch, ${accent} 12%, transparent)`,
            boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${accent} 28%, transparent)`,
            color: accent,
          }
        : variant === "hub"
          ? {
              background: `color-mix(in oklch, ${accent} 18%, transparent)`,
              boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${accent} 40%, transparent), 0 0 20px -6px ${accent}`,
              color: accent,
            }
          : {
              background: "transparent",
              color: "var(--foreground)",
            };

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "group inline-flex items-center justify-center font-medium transition-all duration-200",
        "active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed",
        "focus-visible:ds-focus-ring",
        SIZES[size],
        variant === "ghost" && "hover:bg-white/5",
        block && "w-full",
        className,
      )}
      style={{ ...variantStyle, ...style }}
      {...rest}
    >
      {loading ? (
        <span className="inline-flex gap-1">
          <span className="h-1.5 w-1.5 rounded-full animate-pulse bg-current" />
          <span className="h-1.5 w-1.5 rounded-full animate-pulse bg-current [animation-delay:120ms]" />
          <span className="h-1.5 w-1.5 rounded-full animate-pulse bg-current [animation-delay:240ms]" />
        </span>
      ) : (
        <>
          {iconLeft}
          {children}
          {iconRight}
        </>
      )}
    </button>
  );
});
