import { Link, useLocation } from "@tanstack/react-router";
import { Home, ChevronRight } from "lucide-react";

const PAGE: Record<string, { label: string; accent: string }> = {
  "/talents": { label: "Talents & Savoir Vivant", accent: "var(--radar)" },
  "/creation": { label: "Espace de création", accent: "var(--flash)" },
};

export function PageBreadcrumb() {
  const { pathname } = useLocation();
  const current = PAGE[pathname];

  if (!current) return null;

  return (
    <nav aria-label="Fil d'Ariane" className="w-full">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs">
        <li>
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only">Accueil</span>
          </Link>
        </li>
        <li className="flex items-center gap-1.5 text-muted-foreground">
          <ChevronRight className="h-3 w-3" />
          <span>Espaces</span>
        </li>
        <li className="flex items-center gap-1.5">
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
          <span
            className="font-medium"
            style={{ color: current.accent }}
            aria-current="page"
          >
            {current.label}
          </span>
        </li>
      </ol>
    </nav>
  );
}
