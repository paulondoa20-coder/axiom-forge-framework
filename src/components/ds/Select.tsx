import { useId, type ReactNode } from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  Select as RSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "@/lib/utils";

export type DSSelectOption = {
  value: string;
  label: ReactNode;
  description?: string;
};

type Props = {
  label?: string;
  hint?: string;
  error?: string;
  placeholder?: string;
  accent?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options: DSSelectOption[];
  disabled?: boolean;
  className?: string;
  id?: string;
};

export function DSSelect({
  label,
  hint,
  error,
  placeholder = "Sélectionner…",
  accent,
  value,
  defaultValue,
  onValueChange,
  options,
  disabled,
  className,
  id,
}: Props) {
  const autoId = useId();
  const triggerId = id ?? autoId;
  const ring = error ? "var(--destructive)" : (accent ?? "var(--primary)");

  return (
    <div className="ds-stack-xs w-full">
      {label && (
        <label htmlFor={triggerId} className="ds-eyebrow text-foreground/80">
          {label}
        </label>
      )}
      <RSelect value={value} defaultValue={defaultValue} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          id={triggerId}
          className={cn(
            "group flex items-center justify-between gap-2 w-full h-11 rounded-xl px-3.5",
            "bg-white/[0.03] backdrop-blur-md text-sm text-foreground outline-none",
            "transition-all data-[state=open]:bg-white/[0.06]",
            "disabled:opacity-40 disabled:cursor-not-allowed",
            "data-[placeholder]:text-foreground/35",
            className,
          )}
          style={{
            boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${ring} ${error ? 45 : 14}%, transparent)`,
          }}
        >
          <SelectValue placeholder={placeholder} />
          <SelectPrimitive.Icon asChild>
            <ChevronDown className="h-4 w-4 text-foreground/55 transition-transform group-data-[state=open]:rotate-180" />
          </SelectPrimitive.Icon>
        </SelectTrigger>

        <SelectPrimitive.Portal>
          <SelectContent
            position="popper"
            sideOffset={6}
            className={cn(
              "z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl p-1.5",
              "bg-[color-mix(in_oklch,var(--background)_85%,transparent)] backdrop-blur-xl",
              "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            )}
            style={{
              boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${ring} 18%, transparent), 0 12px 40px -12px color-mix(in oklch, ${ring} 30%, transparent)`,
            }}
          >
            <SelectPrimitive.Viewport className="ds-stack-xs">
              {options.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className={cn(
                    "relative flex items-start gap-2 rounded-lg px-2.5 py-2 text-sm outline-none cursor-pointer",
                    "text-foreground/80 transition-colors",
                    "data-[highlighted]:bg-white/[0.06] data-[highlighted]:text-foreground",
                    "data-[state=checked]:text-foreground",
                  )}
                >
                  <span className="mt-0.5 flex h-4 w-4 items-center justify-center">
                    <SelectPrimitive.ItemIndicator>
                      <Check className="h-3.5 w-3.5" style={{ color: ring }} />
                    </SelectPrimitive.ItemIndicator>
                  </span>
                  <span className="flex-1 min-w-0">
                    <SelectPrimitive.ItemText>{opt.label}</SelectPrimitive.ItemText>
                    {opt.description && (
                      <span className="block text-[11px] text-foreground/50 mt-0.5">{opt.description}</span>
                    )}
                  </span>
                </SelectItem>
              ))}
            </SelectPrimitive.Viewport>
          </SelectContent>
        </SelectPrimitive.Portal>
      </RSelect>
      {(hint || error) && (
        <p className={cn("ds-caption", error ? "text-[color:var(--destructive)]" : "text-foreground/55")}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
}
