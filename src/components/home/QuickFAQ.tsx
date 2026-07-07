import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "C'est gratuit ?",
    a: "Oui. Publier, chercher, explorer — zéro franc.",
  },
  {
    q: "Un profil sérieux ?",
    a: "Le score Trust te le dit direct : identité, avis, vérifs.",
  },
  {
    q: "Ça marche où ?",
    a: "Douala d'abord (Akwa, Bonanjo…), puis d'autres villes.",
  },
  {
    q: "Je peux supprimer ?",
    a: "À tout moment. Tu gardes la main.",
  },

];

export function QuickFAQ() {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-sm font-medium text-muted-foreground">Questions rapides</h2>
        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
          <HelpCircle className="h-3 w-3" /> on te dit tout
        </span>
      </div>
      <div className="glass-surface overflow-hidden rounded-2xl px-3">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className={i === faqs.length - 1 ? "border-0" : ""}
            >
              <AccordionTrigger className="text-left text-[13px] font-medium leading-snug hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-[12px] leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
