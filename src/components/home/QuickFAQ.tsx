import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "C'est gratuit pour publier ?",
    a: "Oui. Publier un Flash, lancer un Radar ou explorer le Scan, c'est zéro franc. Tu payes seulement les services que tu décides de prendre.",
  },
  {
    q: "Comment je sais qu'un profil est sérieux ?",
    a: "Le score Trust te le dit en un coup d'œil : identité, vérifications, avis de la commu. Plus c'est haut, plus tu peux foncer tranquille.",
  },
  {
    q: "Ça marche partout ?",
    a: "On démarre fort à Douala (Akwa, Bonanjo, Bonapriso…) et on se déploie ville par ville, quartier par quartier. Plus on est, plus ça bouge.",
  },
  {
    q: "Je peux supprimer ce que je publie ?",
    a: "À tout moment. Tes Flashs, demandes Radar et profils — tu gardes la main. Pas de piège, pas de prise d'otage.",
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
