# ADR-001 — Architecture cible Vitala (adaptée à Lovable / TanStack Start)

**Statut** : accepté — 2026-07-08
**Réf. source** : `Architecture.txt` fourni par le propriétaire.

## Contexte

L'architecture cible décrit un monorepo Turbo (`apps/web` en Next.js 15,
`apps/mobile` en Capacitor, `packages/*` partagés). Le projet tourne
actuellement sur **TanStack Start (Vite) + Cloudflare Workers**, single app.

Contraintes non négociables retenues :

1. Offline First obligatoire.
2. Aucun accès direct à Supabase depuis les composants.
3. Toute logique métier passe par un **use case**.
4. Toute donnée doit être accessible hors ligne.
5. Base locale : **Dexie**.
6. Synchronisation : **Outbox pattern**.
7. Aucun dossier `misc`, `helpers`, `temp`, `random`.
8. Un domaine = une responsabilité métier.
9. Aucun composant > 300 lignes.
10. Toute nouvelle fonctionnalité = un domaine extensible.

## Décision

On adopte **l'esprit** de la cible dans une **single app TanStack**,
sans monorepo Turbo (non supporté dans Lovable). Mapping :

```
apps/web/domains/*   →  src/domains/*
packages/*           →  src/packages/*
docs/*               →  docs/*
apps/mobile/         →  N/A (PWA seulement — Capacitor n'est pas géré ici)
```

### Structure interne d'un domaine

```
src/domains/<name>/
  entities/       # types / interfaces métier (DTO)
  repositories/   # accès données (Dexie + remote), offline-first
  services/       # orchestration transverse au domaine
  use-cases/      # une fonction = un cas d'usage métier (SendMessage, etc.)
  hooks/          # bindings React → use cases (SSR-safe, seed initial)
  components/     # UI présentationnelle du domaine (< 300 lignes)
  types/          # types utilitaires locaux
  data/seed.ts    # données seed isomorphiques (SSR + first-run offline)
  index.ts        # barrel public
```

### Domaines

Les 16 domaines de la cible sont scaffoldés dans `src/domains/`. Migrés :

- `identity` (préférences, contexte utilisateur)
- `messaging` (conversations, messages, envoi offline-first)
- `notification` (feed notifications, mark-as-read via outbox)

Scaffolds vides (extension progressive) :

- `trust`, `network`, `publication`, `opportunity`, `community`,
  `verification`, `knowledge`, `geo`, `search`, `marketplace`,
  `events`, `projects`, `achievements`.

### Packages

```
src/packages/offline/      # Dexie DB + Outbox + Sync engine + BaseRepository
src/packages/shared/       # analytics, formatters, constants (transverse)
src/packages/auth/         # roles / permissions / policies / guards (stub)
src/packages/ai/           # opportunity/people/trust engines (stub)
src/packages/graph/        # trust/recommendation/introduction graphs (stub)
src/packages/notifications/# push / email / sms templates (stub)
src/packages/config/       # constants, tokens (stub)
src/packages/core/         # noyau transverse (stub)
src/packages/ui/           # atomes UI transverses (stub)
```

### Offline First

- **Dexie** (`src/packages/offline/dexie/db.ts`) — tables `conversations`,
  `notifications`, `outbox`, `preferences`, `meta`. SSR-safe (`getDb()`
  retourne `null` côté serveur).
- **Outbox** (`src/packages/offline/outbox/outbox.ts`) — toutes les
  mutations sont enfilées localement puis drainées par le sync engine.
- **Sync engine** (`src/packages/offline/sync/sync.ts`) — draine l'outbox,
  déclenchement automatique sur `online` + interval, handlers enregistrés
  par domaine.
- **Repositories** — pattern read-through Dexie + fallback seed pour SSR
  et first-run. Voir `ConversationRepository`, `NotificationRepository`.

### Hooks (règle de propreté frontend)

Les composants et routes **n'importent que** les hooks / entités d'un
domaine — jamais Dexie, jamais Supabase, jamais une fonction serveur
directement. Exemple :

```ts
// ✅ correct
import { useConversations, sendMessage } from "@/domains/messaging";
// ❌ interdit
import { getDb } from "@/packages/offline";
```

## Écart avec la cible

| Cible                       | Ici                              | Raison                        |
| --------------------------- | -------------------------------- | ----------------------------- |
| Monorepo Turbo              | Single app + `src/{domains,packages}` | Non supporté par Lovable |
| Next.js 15 App Router       | TanStack Start / Vite            | Stack imposée par le template |
| `apps/mobile` Capacitor     | Non provisionné                  | Hors périmètre Lovable        |
| Roles/policies (auth pkg)   | Scaffold vide                    | À brancher quand Cloud activé |
| AI/Graph engines            | Scaffold vide                    | Domaines à peupler ensuite    |
| Test DB Supabase migrations | À créer via Cloud tool           | Pas encore activé             |

## Migration progressive

1. ✅ Scaffold complet + Dexie + Outbox
2. ✅ `identity`, `messaging`, `notification` migrés
3. À venir : `trust`, `opportunity`, `community`, `publication` — quand
   les composants existants (`TrustBadge`, `home/*`, `hub/*`) doivent être
   étendus avec de la logique métier.
4. Activation Lovable Cloud → écrire les repositories remote et
   enregistrer les handlers dans `registerHandler(...)`.
