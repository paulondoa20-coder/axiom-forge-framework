import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Eyebrow({ children, className, accent }: { children: ReactNode; className?: string; accent?: string }) {
  return (
    <p className={cn("ds-eyebrow", className)} style={accent ? { color: accent } : undefined}>
      {children}
    </p>
  );
}

export function Display({ children, className, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2 className={cn("ds-display", className)} {...rest}>
      {children}
    </h2>
  );
}

export function Title({ children, className, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("ds-title", className)} {...rest}>
      {children}
    </h3>
  );
}

export function Body({ children, className, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("ds-body", className)} {...rest}>
      {children}
    </p>
  );
}

export function Caption({ children, className, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("ds-caption", className)} {...rest}>
      {children}
    </p>
  );
}

export function Pill({
  children,
  color = "var(--primary)",
  className,
}: {
  children: ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        className,
      )}
      style={{
        background: `color-mix(in oklch, ${color} 18%, transparent)`,
        boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${color} 32%, transparent)`,
        color,
      }}
    >
      {children}
    </span>
  );
}
