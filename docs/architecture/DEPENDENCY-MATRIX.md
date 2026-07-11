# Matrice des dépendances de code

> Source : Build-Domains Annexe C. Sens des flèches : "peut importer".
> Toute violation est bloquante (lint + revue archi).

## Règle générale
```text
Présentation → Application → Domaine → Infrastructure → Plateforme
```
Aucune flèche inverse. Aucun raccourci.

## Matrice détaillée

| Couche / Module | Peut importer | NE PEUT PAS importer |
|---|---|---|
| `src/components/**` (UI présentationnelle) | `src/domains/*/index.ts` (hooks, composants publics), `src/components/ds/**`, `src/lib/utils` | `@/integrations/supabase/*`, `@/packages/offline/*`, autre domaine en profondeur |
| `src/routes/**` (pages) | Hooks de domaine via barrel, composants DS, `useServerFn` sur `*.functions.ts` | Repo/entities d'un domaine (passer par le hook) |
| `src/routes/api/v1/**` (server fn / routes) | `src/domains/*/use-cases`, `@/integrations/supabase/*` | `src/components/**`, `src/routes/**` (pages) |
| `src/domains/<X>/components/**` | `src/domains/<X>/hooks`, `src/components/ds/**` | Un autre domaine directement, `@/integrations/supabase/*` |
| `src/domains/<X>/hooks/**` | `src/domains/<X>/use-cases` | Composants, autre domaine |
| `src/domains/<X>/use-cases/**` | `src/domains/<X>/services`, `src/domains/<X>/repositories`, `@/packages/offline` (outbox), `@/packages/shared` | Un autre domaine (passer par event/API) |
| `src/domains/<X>/services/**` | `src/domains/<X>/entities`, `src/domains/<X>/repositories` | UI, autre domaine |
| `src/domains/<X>/repositories/*.remote.ts` | `@/integrations/supabase/*` | UI, autre domaine, `@/packages/offline` |
| `src/domains/<X>/repositories/*.local.ts` | `@/packages/offline`, Dexie | `@/integrations/supabase/*` |
| `src/domains/<X>/entities/**` | Types purs | TOUT le reste |
| `src/packages/**` | `src/packages/*` (sauf cycles), Dexie, libs tierces | `src/domains/*`, `src/components/*`, `src/routes/*` |
| Intelligence (`search`, `radar`, `knowledge`, `packages/ai`, `packages/graph`) | Vues/projections read-only, APIs officielles | Écriture directe sur tables d'un autre domaine |

## Communication inter-domaines

Autorisée **uniquement** via :
1. Barrel public `src/domains/<X>/index.ts` (surface stable).
2. Événements métier (à venir : `src/packages/events`).
3. Projections en lecture (vues Postgres).

Interdit :
- Import direct `@/domains/A/repositories/*` depuis `@/domains/B/**`.
- Cycle A → B → A.
- Domaine qui référence un autre domaine dans son `entities/`.

## Fichiers réservés (aucun agent ne les édite hors owner Infra)
- `src/routeTree.gen.ts` (généré).
- `src/integrations/supabase/{client,client.server,auth-middleware,auth-attacher,types}.ts` (gérés).
- `.env`, `supabase/config.toml` (plateforme).

## Vérification
- Lint ESLint `no-restricted-imports` (voir `eslint.config.js`) bloque les imports directs interdits pour les composants.
- Script à venir `scripts/check-arch.ts` (TASK P7-04) : parcourt AST, échoue sur toute violation cross-domain.
