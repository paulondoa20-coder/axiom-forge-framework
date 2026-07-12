---
task_id: P1-05b
phase: 1
domain: design-system
priority: P2
complexity: M
status: todo
depends_on: [P1-05]
---

# P1-05b — Migrate remaining hardcoded overlay colors to semantic tokens

## Contexte
P1-05 a introduit les tokens `--overlay-scrim`, `--overlay-hover`,
`--overlay-strong`, `--overlay-invert` et les utilitaires Tailwind
correspondants (`bg-scrim`, `bg-overlay`, `bg-overlay-strong`). Les overlays
shadcn (dialog/drawer/sheet/alert-dialog) sont migrés.

Il reste ~50 occurrences `bg-white/N`, `text-white`, `bg-black/N`, `bg-[#…]`
dans `src/routes/*` (radar, scan, trust, messages, notifications, profile,
flash) et quelques composants. Elles cassent le dark/light toggle et
contournent la charte.

## Livrables
- 0 occurrence de `bg-white/`, `text-white`, `bg-black/`, `bg-[#…]`,
  `text-[#…]` dans `src/` (hors `src/components/ui/*` généré si non
  migrable, à documenter cas par cas).
- Remplacements canoniques :
  - `bg-white/5`  → `bg-overlay`
  - `bg-white/10` → `bg-overlay-strong`
  - `bg-white/[0.03]` → `bg-overlay`
  - `text-white` sur fond gradient hub → `text-primary-foreground` ou
    couleur dédiée du hub.
  - Thumb de switch `bg-white` → `bg-[var(--overlay-invert)]`.
- Vérification visuelle en dark + light.

## Definition of Done
- `rg "bg-white/|text-white|bg-black/|bg-\[#|text-\[#" src` retourne vide
  (ou uniquement des faux positifs documentés).
- Aucun régression visuelle rapportée en dark ET light.
- Lint `no-restricted-syntax` (à ajouter) bloque toute réintroduction.
