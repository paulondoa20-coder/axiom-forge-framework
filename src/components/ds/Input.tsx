import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  accent?: string;
};

export const DSInput = forwardRef<HTMLInputElement, Props>(function DSInput(
  { label, hint, error, iconLeft, iconRight, accent, className, id, style, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const ring = error ? "var(--destructive)" : (accent ?? "var(--primary)");

  return (
    <div className="ds-stack-xs w-full">
      {label && (
        <label htmlFor={inputId} className="ds-eyebrow text-foreground/80">
          {label}
        </label>
      )}
      <div
        className={cn(
          "group relative flex items-center gap-2 h-11 rounded-xl px-3.5 transition-all",
          "bg-white/[0.03] backdrop-blur-md",
          "focus-within:bg-white/[0.05]",
        )}
        style={{
          boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${ring} ${error ? 45 : 14}%, transparent)`,
          ...style,
        }}
      >
        {iconLeft && (
          <span className="text-foreground/50 group-focus-within:text-foreground/80 transition-colors">
            {iconLeft}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "flex-1 min-w-0 bg-transparent outline-none border-0 text-sm text-foreground",
            "placeholder:text-foreground/35",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            className,
          )}
          style={{
            // soft focus glow via accent
            ["--tw-ring-color" as never]: ring,
          }}
          onFocus={(e) => {
            e.currentTarget.parentElement!.style.boxShadow = `inset 0 0 0 1px color-mix(in oklch, ${ring} 55%, transparent), 0 0 0 4px color-mix(in oklch, ${ring} 14%, transparent)`;
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            e.currentTarget.parentElement!.style.boxShadow = `inset 0 0 0 1px color-mix(in oklch, ${ring} ${error ? 45 : 14}%, transparent)`;
            rest.onBlur?.(e);
          }}
          {...rest}
        />
        {iconRight && <span className="text-foreground/50">{iconRight}</span>}
      </div>
      {(hint || error) && (
        <p
          className={cn("ds-caption", error ? "text-[color:var(--destructive)]" : "text-foreground/55")}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
});
