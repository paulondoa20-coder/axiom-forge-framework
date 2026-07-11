# ADR-002 — Workflow multi-agents (IA & humains)

- **Statut** : Accepté
- **Date** : 2026-07-11
- **Contexte** : Vitala est construit en parallèle par plusieurs agents IA et développeurs humains. Sans règles de partage, les domaines se chevauchent, les migrations SQL entrent en conflit et les fichiers auto-générés (`routeTree.gen.ts`, types Supabase) deviennent instables.

## Décision

### 1. Un domaine = un propriétaire à la fois
- Chaque dossier `src/domains/<name>/` a **un et un seul agent actif** pendant une tâche.
- Le propriétaire est déclaré via le `TASK-ID` (cf. `docs/tasks/_TEMPLATE.md`).
- Un second agent ne touche le domaine qu'après merge et handover explicite.

### 2. Zones exclusives (jamais deux agents en même temps)
| Zone | Règle |
|---|---|
| `supabase/migrations/*` | **Sérialisé**. Un seul agent ouvre une migration à la fois. Chaque migration = un `TASK-ID`. |
| `src/routeTree.gen.ts`, `src/integrations/supabase/{client,client.server,auth-*,types}.ts`, `.env`, `supabase/config.toml` | **Interdits en écriture**. Auto-générés / gérés par la plateforme. |
| `src/start.ts`, `src/router.tsx`, `src/routes/__root.tsx`, `src/routes/_authenticated/route.tsx` | **Édition coordonnée** uniquement par l'agent Infra (owner P0/P2). |
| `docs/**/*.pdf` | Lecture seule. Modifications passent par le repo docs source. |

### 3. Zones parallélisables
- `src/domains/A/**` et `src/domains/B/**` peuvent être édités en parallèle **si** :
  - Aucun import cross-domain hors barrel `index.ts`.
  - Aucune migration DB partagée sur le même turn.
  - Chaque PR référence son `TASK-ID` unique.
- `src/packages/<x>/**` : un propriétaire par package.

### 4. Cycle de vie d'une tâche
```
Backlog → TASK-ID assigné → Agent lit docs + plan → Édition → Tests → PR
       → Revue architecture (lint + matrice) → Merge → Handover documenté
```

### 5. Handover
En fin de tâche, l'agent met à jour :
- `src/domains/<x>/README.md` (state, events publiés, stratégie de conflit sync).
- `docs/decisions/YYYY-MM-DD-<slug>.md` si choix structurant.
- Statut du `TASK-ID` dans le plan (`.lovable/plan.md`).

### 6. Résolution de conflit inter-agent
Ordre d'arbitrage :
1. AI-Constitution (docs).
2. Ce plan (`.lovable/plan.md`).
3. ADR le plus récent.
4. Décision du lead humain.

Aucun agent ne peut invalider une règle plus haute dans la pile sans une nouvelle ADR mergée.

## Conséquences
- Latence : une migration bloque temporairement les autres agents → prévoir un lead migration.
- Traçabilité : chaque changement est identifiable par son `TASK-ID`.
- Sûreté : les fichiers auto-générés restent stables.
