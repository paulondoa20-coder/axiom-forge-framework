import { forwardRef, useId, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: string;
  error?: string;
  accent?: string;
  maxLength?: number;
  showCount?: boolean;
};

export const DSTextarea = forwardRef<HTMLTextAreaElement, Props>(function DSTextarea(
  { label, hint, error, accent, className, id, showCount, maxLength, value, style, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const ring = error ? "var(--destructive)" : (accent ?? "var(--primary)");
  const count = typeof value === "string" ? value.length : 0;

  return (
    <div className="ds-stack-xs w-full">
      {label && (
        <label htmlFor={inputId} className="ds-eyebrow text-foreground/80">
          {label}
        </label>
      )}
      <div
        className="relative rounded-xl bg-white/[0.03] backdrop-blur-md transition-all focus-within:bg-white/[0.05]"
        style={{
          boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${ring} ${error ? 45 : 14}%, transparent)`,
          ...style,
        }}
      >
        <textarea
          ref={ref}
          id={inputId}
          value={value}
          maxLength={maxLength}
          className={cn(
            "block w-full bg-transparent outline-none border-0 resize-none",
            "px-3.5 py-3 text-sm text-foreground placeholder:text-foreground/35",
            "min-h-[88px]",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            className,
          )}
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
        {showCount && maxLength && (
          <span className="absolute bottom-2 right-3 text-[10px] tabular-nums text-foreground/45">
            {count}/{maxLength}
          </span>
        )}
      </div>
      {(hint || error) && (
        <p className={cn("ds-caption", error ? "text-[color:var(--destructive)]" : "text-foreground/55")}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
});
