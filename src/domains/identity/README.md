# Domain — identity

Owner : Agent B (UDI + Trust). Voir `.lovable/plan.md` §3.A.

## Responsabilité
Identité utilisateur (`public.profiles`, `public.profile_contacts`) + préférences client (thème, langue).

## Surface publique (barrel `index.ts`)
- Types : `Profile`, `ProfileUpdateInput`, `Preferences`, `Theme`, `Lang`
- Contexte React : `PrefsContext`, `usePrefs`
- Hooks : `useProfile`
- Use-cases (appelables depuis un autre agent) : `getMyProfile`, `updateProfile`

## Événements publiés
_(à venir — Phase 4)_ `identity.profile.updated`, `identity.icv.recomputed`.

## Politique de conflit sync
`updateProfile` : **last-write-wins côté serveur** (updated_at). Pas de merge — la vue reflète l'état DB après drain.

## Fichiers touchant Supabase
- `src/lib/identity.functions.ts` (server functions, `requireSupabaseAuth`)
- `src/domains/identity/repositories/ProfileRepository.ts` (wrapper client-safe)

Aucun composant n'importe `@/integrations/supabase/*`. Toute mutation transite par un use-case.

## Tâches ouvertes
- P3A-01 : migration compléments `profiles` (headline, bio, country, city, icv_score) — champs déjà consommés par l'entité, à confirmer côté DB.
- P3A-03 : UI édition + upload avatar (bucket `avatars`).
