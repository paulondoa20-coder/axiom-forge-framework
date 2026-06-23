import { type ReactNode, type CSSProperties } from "react";
import { useReveal } from "@/hooks/useReveal";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  as?: "div" | "section";
  className?: string;
}

/**
 * Lightweight wrapper that fades + lifts its children on scroll-into-view.
 * No layout shift, no JS animations — pure CSS transitions.
 */
export function Reveal({ children, delay = 0, as = "div", className = "" }: RevealProps) {
  const ref = useReveal<HTMLDivElement>();
  const style: CSSProperties = { transitionDelay: `${delay}ms` };
  const Tag = as;
  return (
    <Tag ref={ref as never} className={`reveal ${className}`} style={style}>
      {children}
    </Tag>
  );
}
