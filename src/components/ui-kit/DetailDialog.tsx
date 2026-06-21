import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export interface DetailDialogProps {
  trigger: ReactNode;
  title: string;
  eyebrow?: string;
  summary: string;
  steps?: string[];
  meta?: { label: string; value: string }[];
  accent?: string;
  primaryCta?: { label: string; onClick?: () => void };
  secondaryCta?: { label: string; onClick?: () => void };
  children?: ReactNode;
}

export function DetailDialog({
  trigger,
  title,
  eyebrow,
  summary,
  steps,
  meta,
  accent = "var(--primary)",
  primaryCta,
  secondaryCta,
  children,
}: DetailDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader className="space-y-2 text-left">
          {eyebrow && (
            <span
              className="inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider"
              style={{
                background: `color-mix(in oklch, ${accent} 15%, transparent)`,
                color: accent,
              }}
            >
              {eyebrow}
            </span>
          )}
          <DialogTitle className="text-lg leading-snug">{title}</DialogTitle>
          <DialogDescription className="text-sm leading-relaxed">
            {summary}
          </DialogDescription>
        </DialogHeader>

        {meta && meta.length > 0 && (
          <div className="grid grid-cols-2 gap-2 rounded-xl border border-white/10 p-3 text-xs">
            {meta.map((m) => (
              <div key={m.label} className="space-y-0.5">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {m.label}
                </p>
                <p className="font-medium">{m.value}</p>
              </div>
            ))}
          </div>
        )}

        {steps && steps.length > 0 && (
          <div className="space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Comment ça se passe
            </p>
            <ol className="space-y-2">
              {steps.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold"
                    style={{
                      background: `color-mix(in oklch, ${accent} 18%, transparent)`,
                      color: accent,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span className="leading-relaxed text-muted-foreground">{s}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {children}

        {(primaryCta || secondaryCta) && (
          <DialogFooter className="gap-2 sm:gap-2">
            {secondaryCta && (
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-white/10"
                onClick={secondaryCta.onClick}
              >
                {secondaryCta.label}
              </Button>
            )}
            {primaryCta && (
              <Button
                size="sm"
                className="rounded-xl"
                style={{ background: accent, color: "var(--background)" }}
                onClick={primaryCta.onClick}
              >
                <CheckCircle2 className="h-3.5 w-3.5" /> {primaryCta.label}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
