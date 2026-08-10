# Plan final VITALA — de l'état actuel à la V1 en production

Ce plan reprend **toutes** les propositions listées précédemment, les ordonne, les complète, et les découpe en lots exécutables par plusieurs agents sans conflit. Chaque lot a un identifiant, un périmètre de fichiers, et un critère de validation.

---

## Principe d'exécution

- Un lot = un domaine = un agent à la fois. Pas deux agents sur `src/domains/<x>/`.
- Toute mutation passe par un use-case, jamais depuis un composant.
- Toute migration DB est sérialisée (revue avant application) : `CREATE TABLE` → `GRANT` → `ENABLE RLS` → `CREATE POLICY`.
- Chaque lot se termine par : code + doc de domaine (`README.md`) + vérification linter DB à 0 warning critique.

---

## Lot 1 — Quick wins UX (données réelles à la place des mocks)

Objectif : que l'app cesse d'afficher des données inventées. C'est le lot avec le meilleur rapport effort/effet visible.

| ID | Tâche | Détail |
|---|---|---|
| L1-1 | Feed Flash réel | Brancher `/flash` sur la table `flashes` via un domaine `publication` (repo remote + local Dexie), pagination `-created_at`. |
| L1-2 | Cloche temps réel | `TopBar` connecté au canal Realtime `notifications:{userId}` + badge non-lus. |
| L1-3 | Messages réels | `/messages` sur `conversations` + `messages` (déjà idempotents), scroll et accusé d'envoi. |
| L1-4 | Profil éditable | `/profile` branché sur `useProfile` : édition nom, bio, quartier, ville. |
| L1-5 | Home vivante | `LiveStrip`, `SmartFeed`, `RecentActivity` alimentés par les 20 derniers flashes/needs au lieu des tableaux en dur. |
| L1-6 | Indicateur de sync | Pastille « hors ligne / en attente / synchronisé » dans le `TopBar`, alimentée par l'outbox. |

Validation : plus aucun tableau de données factices importé dans `src/components/home/*` et `src/routes/flash.tsx`.

---

## Lot 2 — Domaine UDI (identité) complet

| ID | Tâche |
|---|---|
| L2-1 | Migration `profiles` : `headline`, `country`, `icv_score`, index sur `city`. |
| L2-2 | Bucket de stockage `avatars` + politiques (lecture publique, écriture propriétaire). |
| L2-3 | Use-cases `UpsertProfile`, `GetPublicProfile`, `RecomputeIcv`. |
| L2-4 | UI : page d'édition de profil, upload d'avatar avec recadrage simple, profil public en lecture. |
| L2-5 | API `GET /api/v1/profiles/:id`, `PATCH /api/v1/profiles/me`. |

Validation : un visiteur non connecté voit un profil public ; le propriétaire peut le modifier hors-ligne et la mutation se rejoue à la reconnexion.

---

## Lot 3 — Domaine Flash (publication)

| ID | Tâche |
|---|---|
| L3-1 | Migration : aligner `flashes` sur la spec (type, visibilité, statut, compteurs, suppression douce) + `flash_responses` + `flash_reactions` avec triggers de comptage, RLS et GRANT. |
| L3-2 | Entités `Flash`, `FlashResponse`, `FlashReaction` ; repos local (Dexie) + remote. |
| L3-3 | Use-cases `PublishFlash`, `ListFeedFlashes`, `ReactToFlash`, `RespondToFlash` — tous via l'outbox. |
| L3-4 | UI : composition d'un flash (texte, catégorie, quartier, image), fil, réactions, réponses en fil. |
| L3-5 | API `POST/GET/PATCH/DELETE /api/v1/flashes`. |

Validation : publier un flash en mode avion, revenir en ligne, le flash apparaît une seule fois.

---

## Lot 4 — Domaine Mission (opportunités & organisations)

| ID | Tâche |
|---|---|
| L4-1 | Migrations `organizations`, `organization_members`, `opportunities`, `applications` (unicité, index FK, RLS, GRANT). |
| L4-2 | Use-cases `PublishOpportunity`, `RespondOpportunity`, `SelectCandidate`, `ValidateAction`, `CloseMission`. |
| L4-3 | Domaine `network` : invitations et rôles d'organisation. |
| L4-4 | UI : `/radar` transformé en vue « opportunités », page organisation, tableau de bord organisation. |
| L4-5 | API `/api/v1/opportunities` + sous-ressources candidature / sélection / validation. |

Validation : parcours besoin → publication → réponse → sélection → validation → clôture jouable en démo.

---

## Lot 5 — Domaine Trust (confiance)

| ID | Tâche |
|---|---|
| L5-1 | Tables `trust_proofs`, `trust_events` + fonction `private.recompute_trust_score(profile_id)`. |
| L5-2 | Use-cases `SubmitVerification`, `ReviewVerification` (modérateur), `RecomputeScore`. |
| L5-3 | File d'attente de modération (domaine `verification`). |
| L5-4 | UI : page `/trust`, `TrustBadge` branché au score réel, filtres modérateur. |
| L5-5 | API `/api/v1/trust/*`. |

Validation : le score bouge après une mission validée et une vérification approuvée ; un utilisateur ne peut jamais s'auto-approuver.

---

## Lot 6 — Sync offline complet

| ID | Tâche |
|---|---|
| L6-1 | Handler outbox enregistré pour **chaque** use-case mutant des lots 2 à 5. |
| L6-2 | Politique de conflit documentée par domaine (dernier écrivain / fusion / arbitrage utilisateur). |
| L6-3 | UI de résolution de conflit (liste, aperçu local vs serveur, choix). |
| L6-4 | Tests scénarios : coupure réseau, doublons, reprise partielle, expiration de session. |

Validation : 5 minutes hors ligne, reconnexion, zéro perte et zéro doublon.

---

## Lot 7 — Intelligence (lecture seule)

| ID | Tâche |
|---|---|
| L7-1 | Vues `v_flash_feed`, `v_opportunity_matches`, `v_profile_public`. |
| L7-2 | Recherche globale (`pg_trgm`) : personnes, flashes, opportunités, organisations. |
| L7-3 | Moteur de recommandation : heuristiques d'abord (proximité, catégorie, confiance), IA ensuite. |
| L7-4 | Graphe de confiance : chemin en 2 sauts, mises en relation suggérées. |
| L7-5 | Radars sauvegardés + correspondances calculées par tâche planifiée. |
| L7-6 | Home : `SmartSuggestions` et `Opportunities` alimentés par ces moteurs, chaque suggestion explicable (raison + score). |

---

## Lot 8 — PWA & mobile (finition)

| ID | Tâche |
|---|---|
| L8-1 | Notifications push réelles (abonnement, envoi serveur, préférences par type). |
| L8-2 | Écran hors-ligne dédié + file d'attente visible. |
| L8-3 | Partage natif (Web Share) sur flash, profil, opportunité. |
| L8-4 | Raccourcis manifeste vers Flash / Messages / Scan. |
| L8-5 | Retour haptique et gestes (tirer pour rafraîchir, glisser pour archiver). |

---

## Lot 9 — Qualité, accessibilité, i18n

| ID | Tâche |
|---|---|
| L9-1 | Audit accessibilité : contrastes, focus visible, navigation clavier, libellés ARIA. |
| L9-2 | Squelettes de chargement unifiés + `errorComponent`/`notFoundComponent` sur toutes les routes à loader. |
| L9-3 | Internationalisation FR/EN (structure `src/i18n/`), FR par défaut. |
| L9-4 | SEO : titre, description, OG par route ; image OG absolue quand la page a une couverture. |
| L9-5 | Performance : routes paresseuses, images différées, budget JS accueil < 200 ko. |

---

## Lot 10 — Sécurité & mise en production

| ID | Tâche |
|---|---|
| L10-1 | Revue RLS table par table + matrice de sécurité documentée. |
| L10-2 | Limitation de débit sur `/api/v1/*` et sur les fonctions serveur sensibles. |
| L10-3 | Modération : signalement de contenu, blocage d'utilisateur, file admin. |
| L10-4 | Sauvegarde et procédure de restauration testée une fois. |
| L10-5 | Tests bout en bout (inscription, flash, mission, cycle hors-ligne) + tests de contrat API. |
| L10-6 | Publication, domaine personnalisé, supervision des erreurs, runbook incidents. |

---

## Ajouts que je recommande en plus de la liste initiale

1. **Modération et signalement** (L10-3) : indispensable dès qu'il y a du contenu public de quartier.
2. **Onboarding contextuel** : à la première connexion, demander quartier + centres d'intérêt pour que le feed ne soit jamais vide.
3. **État vide travaillé partout** : chaque liste vide propose une action (« Sois le premier à lancer un flash ici »).
4. **Journal d'activité utilisateur** : page « mon activité » alimentée par `audit_logs` filtré propriétaire.
5. **Invitations & parrainage** : lien d'invitation par quartier, mesure de croissance.
6. **Tableau de bord interne** : nombre de flashes/jour, missions clôturées, taux de sync en échec.

---

## Ordonnancement conseillé

```text
Semaine 1-2 : Lot 1 (quick wins) — 1 agent, effet immédiat
Semaine 3-6 : Lots 2, 3, 4, 5 en parallèle (1 agent par domaine, migrations sérialisées)
Semaine 7   : Lot 6 (sync) — séquentiel, dépend des lots 2-5
Semaine 8-9 : Lot 7 (intelligence) + Lot 8 (PWA) en parallèle
Semaine 10  : Lot 9 (qualité) puis Lot 10 (sécurité + prod), séquentiels
```

---

## Détails techniques

- API : `src/routes/api/v1/<domaine>/<ressource>.ts`, réponses `{ success, data, meta }`, erreurs `{ success:false, error:{code,message,details} }`, pagination `page`/`page_size`, tri `?sort=-created_at`.
- Domaine : `entities/`, `repositories/` (`*.local.ts` Dexie, `*.remote.ts` Supabase), `use-cases/`, `hooks/`, `components/`, `index.ts` barrel unique.
- Interdits : import Supabase hors `*.remote.ts` et routes API ; import offline hors `*.local.ts` ; import cross-domaine hors barrel.
- Définition de « terminé » par lot : code + tests du chemin nominal + doc domaine + migration testée + linter DB propre.

---

## Prochaine étape

Dis-moi par quel lot on commence (je recommande le **Lot 1**), et je l'exécute tâche par tâche.
