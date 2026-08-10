# Domain — publication (Flash)

Owner : Agent C (Flash + feed). Voir `.lovable/plan.md` §3.B / Lot 1.

## Responsabilité
Publications courtes du quartier (`public.flashes`) : feed public, flashes de
l'utilisateur, publication offline-first.

## Surface publique (barrel `index.ts`)
- Types : `Flash`, `FlashDraft`, `FlashAuthor`
- Helpers purs : `toFlash`, `flashAge`
- Hooks : `useFlashFeed`, `useMyFlashes`
- Use-cases : `listFeedFlashes`, `listCachedFlashes`, `listMyFlashesUseCase`,
  `listMyCachedFlashes`, `publishFlash`, `deleteFlash`
- Sync : `registerPublicationSync`

## Lecture / écriture
| Chemin | Client Supabase | Auth |
|---|---|---|
| `listPublicFlashes` | publishable (anon) | non |
| `listMyFlashes` | `requireSupabaseAuth` | oui |
| `createFlashRemote` | `requireSupabaseAuth` | oui |
| `deleteFlashRemote` | `requireSupabaseAuth` | oui |

Fichier serveur : `src/lib/publication.functions.ts`.
Miroir local : table Dexie `flashes` (v3), champs `mine` / `pending`.

## Politique de conflit sync
`create_flash` : **idempotence par `id` client**. Le serveur vérifie l'existence
avant insert ; un rejeu outbox est un no-op. Pas de merge (server-wins).

## Événements
- `vitala:flashes-updated` (window) — émis après drain outbox réussi.

## Tâches ouvertes
- P3B-01 : colonnes `type`, `price`, `visibility`, `expires_at`, compteurs de
  réactions/réponses (le formulaire les collecte déjà côté UI).
- P3B-03 : `flash_responses`, `flash_reactions`.
