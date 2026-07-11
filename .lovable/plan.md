
# 🗺️ Plan d'implémentation Vitala — État actuel → Production

> **Contrat de lecture** : ce plan est la référence exécutable. Chaque agent (IA ou humain) doit, avant de coder une tâche, lire (1) ce plan, (2) le doc listé dans la colonne "Docs source" de la tâche, (3) l'ADR-001. Aucune tâche ne démarre sans son `TASK-ID`, son domaine et ses critères de validation.

---

## 0. Règles d'or (non négociables, valables partout)

1. **Docs > code**. Priorité : AI-Constitution → Vision → Build Blueprint → API Contracts → DB Spec → AI Rules → demande utilisateur.
2. **Un domaine = un propriétaire = un dossier `src/domains/<name>/`**. Aucun accès inter-domaines hors API/events/projections.
3. **Frontend propre** : aucune logique métier dans les composants, aucun accès direct à Supabase depuis un composant, uniquement des hooks branchés sur les use-cases du domaine.
4. **Offline-first obligatoire** : toute mutation passe par l'Outbox Dexie, drainée par le sync engine. Anonymous sync interdit.
5. **DB** : RLS partout, `created_at` partout, index sur toutes les FK, migration versionnée, aucune écriture directe hors migration.
6. **API** : versionnée, contrat stable, un domaine par API, contrôleurs sans logique métier.
7. **Un fichier composant < 300 lignes**. Pas de dossiers `misc/`, `helpers/`, `temp/`.
8. **Aucune invention** : si un contrat manque, on stoppe et on demande. On ne devine ni le schéma, ni le nom, ni la règle métier.
9. **Gate de phase** : une phase se ferme uniquement si (features ✅ + tests ✅ + docs sync ✅ + audit archi ✅).
10. **Multi-agents** : chaque tâche est isolée par domaine + `TASK-ID`, pas deux agents sur le même domaine en parallèle sans découpe explicite.

---

## 1. État actuel (baseline)

**Stack en place** : TanStack Start (Vite) + Cloudflare Worker + Tailwind v4 + shadcn + Dexie + Lovable Cloud (Supabase managé).

**Fait** :
- Scaffold `src/domains/*` (16 domaines) + `src/packages/*` (offline/shared/auth/ai/graph/…), ADR-001.
- Offline core : Dexie (`vitala` DB), Outbox, Sync engine, BaseRepository — non branché aux domaines pour l'instant sauf `messaging`/`notification`/`identity` en shim.
- Auth Supabase (email + Google + placeholder SMS), tables `profiles`, `user_roles`, `flashes`, `needs`, `conversations`, `conversation_participants`, `messages`, `notifications`, `trust_verifications`, `profile_contacts`. RLS + fonctions `private.has_role` / `private.is_conversation_participant`, trigger `handle_new_user`.
- Hardening sécurité : assistant API auth + validation, phone privé, trust self-verify bloqué, security-definer déplacé en schéma `private`.
- Home / hub / scan / flash / radar / messages / notifications / profile / trust : UI présente, données majoritairement mockées, pas de use-cases.

**Écarts vs spec Vitala** (à combler) :
- Schéma DB partiel : manquent `opportunities`, `applications`, `organizations`, `organization_members`, `flash_responses`, `flash_reactions`, `radars`, `radar_matches`, `vita_goals`, `vita_memories`, `audit_logs`, `sync_operation`, `sync_checkpoint`, `sync_conflict`, `billing_*`, `support_tickets`, `conversation_members` (le modèle actuel `conversation_participants` doit s'aligner sur la spec).
- Domaines non peuplés : `trust`, `publication`, `opportunity`, `verification`, `network`, `community`, `knowledge`, `geo`, `search`, `marketplace`, `events`, `projects`, `achievements` sont des barrels vides.
- Aucune couche API v1 officielle (`/api/v1/*`) : les routes actuelles sont côté page + un `/api/assistant`. Pas de contrat REST versionné.
- Sync : Outbox opérationnel côté local, aucun handler `registerHandler` remote, pas de projection Supabase `sync_operation`.
- Intelligence : `packages/ai`, `packages/graph`, `domains/search` vides. Pas de projections lecture.
- Environnements : un seul (Lovable managed). Pas de staging isolé, pas de pipeline documenté, pas de DR playbook.
- Docs de domaine (README par domaine, matrice de dépendances côté code, journal des events) inexistants.

---

## 2. Phases de livraison (séquentielles, gates obligatoires)

### Phase 0 — Préparation & garde-fous (semaine 1)
Objet : figer les règles pour que N agents travaillent sans se marcher dessus.

| TASK-ID | Titre | Livrable | Docs source |
|---|---|---|---|
| P0-01 | ADR mise à jour "Multi-agent workflow" | `docs/architecture/ADR-002-multi-agent-workflow.md` (tableau : qui touche quoi, règle "un domaine = un agent à la fois", process de handover) | AI-Constitution, AI-Workflow, AI-Task-Lifecycle |
| P0-02 | Template de tâche | `docs/tasks/_TEMPLATE.md` (TASK-ID, domaine, objectif, docs, critères, dépendances) | AI-Task-Template |
| P0-03 | Journal de décisions | `docs/decisions/README.md` + convention ADR | AI-Rulebook |
| P0-04 | Matrice des dépendances au code | `docs/architecture/DEPENDENCY-MATRIX.md` (autorisées + interdites) | Build-Domains Annexe C |
| P0-05 | Lint archi | Règle ESLint `no-restricted-imports` : composants ne peuvent importer que `@/domains/*/index`, jamais `@/integrations/supabase/*` ni `@/packages/offline/*` directement | Build-Conventions |
| P0-06 | Env matrix | `docs/ops/environments.md` : Local / Dev / Staging / Prod, secrets, données | Build-Supabase B |

**Gate P0** : template + lint + matrice mergées ; tout PR suivant utilise le template.

---

### Phase 1 — Fondation domaine (semaines 2-3)
Objet : rendre les domaines déjà "posés" réellement propres avant d'en ajouter.

| TASK-ID | Domaine | Livrable | Critère |
|---|---|---|---|
| P1-01 | `identity` | Entities `Profile`, `Preferences`, repo Supabase (`profiles`, `profile_contacts`), use-cases `GetMyProfile`, `UpdateProfile`, hook `useProfile`. Supprimer accès direct Supabase depuis composants. | RLS ok, offline read via Dexie, aucun composant n'importe supabase. |
| P1-02 | `messaging` | Aligner schéma : renommer `conversation_participants` → `conversation_members`, ajouter `client_message_id UNIQUE` sur `messages`, projections read. Remote handler enregistré. | Envoi hors-ligne → outbox → drain en ligne, idempotent. |
| P1-03 | `notification` | Repo Supabase + realtime channel + handler outbox `MarkAsRead`. | Mark-as-read fonctionne offline puis sync. |
| P1-04 | `packages/offline` | Ajouter tables Dexie `outbox_conflicts`, `sync_meta` ; API `registerHandler` typée par domaine. | Tests unitaires sur outbox (drain, retry, conflict). |
| P1-05 | Design System | Barrels `src/components/ds/*` audités ; typographies + tokens dans `styles.css` ; suppression des couleurs hardcodées restantes. | 0 occurrence `text-white`/`bg-[#...]` hors tokens. |

**Gate P1** : `identity`, `messaging`, `notification` = domaines de référence (structure canonique + docs `src/domains/<x>/README.md`).

---

### Phase 2 — Infrastructure transverse (semaine 4)

| TASK-ID | Livrable | Docs |
|---|---|---|
| P2-01 | Migration `audit_logs` + service `audit.log(action, entity, id)` appelé par tous les use-cases sensibles | DB Spec §audit |
| P2-02 | Migration `sync_operation`, `sync_checkpoint`, `sync_conflict` côté Supabase + endpoints server functions `syncPush`, `syncPull`, `syncAck` | Build-Sync |
| P2-03 | `packages/notifications` : templates push/email (stubs), branchement notif domaine → outbox | Build-Overview |
| P2-04 | `packages/auth` : `roles.ts`, `policies.ts`, guard `requireRole('admin')` pour server functions | AI-Security-Rules |
| P2-05 | `packages/config` : constantes centralisées (limites, feature flags, versions API) | Build-Conventions |
| P2-06 | Observabilité : middleware server-fn qui log `X-Request-Id`, latence, erreurs (redaction PII) | Deployment Guide |

**Gate P2** : audit + sync tables opérationnels, chaque mutation majeure trace un log.

---

### Phase 3 — Domaines métier MVP (semaines 5-9)
Ordre imposé par la spec : **UDI → Flash → Mission → Trust**.

#### 3.A UDI (Unified Digital Identity)
| TASK-ID | Livrable |
|---|---|
| P3A-01 | Migration : compléter `profiles` (headline, bio, avatar_url, country, city, icv_score) + agréger providers (email, phone privé, google id) |
| P3A-02 | Domaine `identity` : entities complètes, repo, use-cases `UpsertProfile`, `RecomputeIcv`, `GetPublicProfile` |
| P3A-03 | UI Profile : édition, avatar upload (Supabase Storage bucket `avatars`, RLS), viewer public |
| P3A-04 | API v1 : `GET /api/v1/profiles/:id`, `PATCH /api/v1/profiles/me` (server routes sous `/api/v1/`) |

#### 3.B Flash
| P3B-01 | Migrations : `flashes` (aligner sur DB Spec — content, type, visibility, status, counts, soft delete), `flash_responses`, `flash_reactions` avec triggers de compte + RLS |
| P3B-02 | Domaine `publication` (owner: Flash) : entities `Flash`, `FlashResponse`, `FlashReaction` ; repo offline (Dexie tables `flashes`, `flash_responses`) + repo remote |
| P3B-03 | Use-cases : `PublishFlash`, `ListFeedFlashes`, `ReactToFlash`, `RespondToFlash` — tous via Outbox |
| P3B-04 | UI : route `/flash` branchée sur `useFlashFeed`, création offline-first, retrait des mocks home `LiveStrip/SmartFeed` remplacés par vraies données |
| P3B-05 | API v1 : `POST/GET/PATCH/DELETE /api/v1/flashes`, pagination `page/page_size`, tri `-created_at` |

#### 3.C Mission
| P3C-01 | Migrations : `organizations`, `organization_members` (unique `(org,profile)`), `opportunities`, `applications` (unique `(opp,profile)`) — RLS + index FK |
| P3C-02 | Domaine `opportunity` : entities, repo, use-cases `PublishOpportunity`, `RespondOpportunity`, `SelectCandidate`, `ValidateAction`, `CloseMission` |
| P3C-03 | Domaine `network` : membership org, invitations |
| P3C-04 | UI : refonte `radar` en "opportunités" côté conso, page `/organizations/[slug]`, dashboard org |
| P3C-05 | API v1 : `POST /api/v1/opportunities`, `POST /api/v1/opportunities/:id/applications`, `PATCH …/select`, `PATCH …/validate` |

#### 3.D Trust
| P3D-01 | Compléter `trust_verifications` + tables `trust_proofs`, `trust_events` ; fonction `private.recompute_trust_score(profile_id)` |
| P3D-02 | Domaine `trust` : entities, repo, use-cases `SubmitVerification`, `ReviewVerification` (moderator), `RecomputeScore` |
| P3D-03 | Domaine `verification` : workflow moderateur, files d'attente |
| P3D-04 | UI : page `/trust`, `TrustBadge` connecté au score réel, filtres modérateur |
| P3D-05 | API v1 : `POST /api/v1/trust/verifications`, `GET /api/v1/trust/profiles/:id` |

**Gate P3** : parcours complet **besoin → publication → réponse → sélection → validation → clôture** exécutable en démo, avec `icv_score` qui bouge.

---

### Phase 4 — Sync offline complet (semaine 10)

| TASK-ID | Livrable |
|---|---|
| P4-01 | Handlers Outbox enregistrés pour tous les use-cases mutants (identity, publication, opportunity, trust, messaging, notification) |
| P4-02 | Server functions `syncPush(ops[])`, `syncPull(since)`, `resolveConflict(id, strategy)` |
| P4-03 | Politiques de conflit par domaine documentées (`src/domains/<x>/README.md` : LWW / auto-merge / user / server) |
| P4-04 | UI : indicateur "hors ligne / en attente / synchronisé" dans `TopBar` |
| P4-05 | Tests scénarios : coupure réseau, doublons idempotents (`client_message_id`), reprise partielle |

**Gate P4** : démo offline 5 minutes → reconnexion → 0 perte, 0 doublon.

---

### Phase 5 — Intelligence (semaines 11-12)
Règle : **lecture seule, jamais d'écriture sur tables domaines.**

| TASK-ID | Livrable |
|---|---|
| P5-01 | Vues Postgres `v_flash_feed`, `v_opportunity_matches`, `v_profile_public` |
| P5-02 | Domaine `search` : `SearchAll(query, filters)` via vue matérialisée + `pg_trgm` |
| P5-03 | `packages/ai` : engine `RecommendationEngine` (règles heuristiques d'abord, LLM ensuite) branché à Lovable AI Gateway |
| P5-04 | `packages/graph` : trust graph (bfs 2 sauts), introductions |
| P5-05 | Domaine `radar` (moteur) : `radars` + `radar_matches` + job planifié (Supabase cron) |
| P5-06 | Domaine `knowledge` (Veille) : ingestion feeds + résumés |
| P5-07 | UI : Home `SmartSuggestions` + `SmartFeed` + `Opportunities` alimentés par ces moteurs |

**Gate P5** : chaque suggestion affichée est explicable (raison, source, score).

---

### Phase 6 — UX / accessibilité / i18n technique (semaine 13)

| TASK-ID | Livrable |
|---|---|
| P6-01 | Audit A11y (axe) : contrastes, focus visible, `aria-*`, navigation clavier |
| P6-02 | Skeletons unifiés + `errorComponent`/`notFoundComponent` sur toutes les routes avec loader |
| P6-03 | Setup i18n (structure `src/i18n/{fr,en}.json`) — FR par défaut, EN prêt pour V1 |
| P6-04 | Métadonnées SEO/OG par route (title + description + og:image leaf) |
| P6-05 | Perf : lazy routes, images `loading="lazy"`, budget < 200 kb JS home |

**Gate P6** : Lighthouse Home ≥ 90 (Perf/A11y/SEO/BP), 0 erreur axe critique.

---

### Phase 7 — Intégration end-to-end (semaine 14)

| P7-01 | Playwright E2E : sign-up email + Google, publier flash, répondre opportunité, valider mission, offline/online cycle |
| P7-02 | Contract tests API v1 (schema Zod) |
| P7-03 | Test de charge k6 sur `syncPush` + feed |
| P7-04 | Vérification matrice de dépendances par script (`scripts/check-arch.ts` grep sur imports interdits) |

**Gate P7** : suite E2E verte, contract tests verts, script archi = 0 violation.

---

### Phase 8 — Qualité & sécurité (semaine 15)

| P8-01 | Scan Supabase Linter (`supabase--linter`) : 0 warning critique |
| P8-02 | Revue RLS table par table, matrice `docs/security/RLS-MATRIX.md` |
| P8-03 | Rotation secrets, revue `add_secret` |
| P8-04 | Journalisation & rétention logs conforme (redaction PII) |
| P8-05 | Rate limiting sur `/api/v1/*` (middleware) |
| P8-06 | Politique de sauvegarde + procédure de restauration testée |

**Gate P8** : dernier scan sécu Lovable "clear", playbook DR exécuté au moins une fois.

---

### Phase 9 — Mise en production (semaine 16)

| P9-01 | Publication Lovable, custom domain, badge visibilité configurés |
| P9-02 | Monitoring : erreurs runtime, `analytics_project_analytics`, alertes seuil |
| P9-03 | Runbook incidents `docs/ops/RUNBOOK.md` |
| P9-04 | Documentation utilisateur minimale (`docs/user/`) |
| P9-05 | Post-mortem template |

**Gate P9 = Go-Live V1**.

---

## 3. Feuille d'ordonnancement pour agents parallèles

Règles de partage :

```text
Parallélisable :
- P3A ⨯ P3B ⨯ P3C ⨯ P3D peuvent avancer en parallèle SI :
  * chaque agent est propriétaire exclusif d'un domaine
  * les migrations DB sont sérialisées par un lead (revue avant merge)
  * aucun agent ne touche `src/routeTree.gen.ts`, `src/integrations/supabase/*`
    (fichiers auto-générés / réservés)

Non parallélisable :
- Phase 0, 4, 8, 9 = séquentielles
- P2-01 (audit_logs) doit précéder P3.* (chaque use-case l'utilise)
- Sync handlers (P4-01) nécessitent que tous les use-cases mutants existent
```

Attribution suggérée (N=4 agents) :
- Agent A : Infra (P0, P2, P4, P8)
- Agent B : UDI + Trust (P3A, P3D, P6 partie profil)
- Agent C : Flash + Publication (P3B, P5 partie feed)
- Agent D : Mission + Network (P3C, P5 partie opportunités)

Chaque agent ouvre une PR par `TASK-ID`, référence les docs source, met à jour :
- `src/domains/<x>/README.md`
- `docs/decisions/` si choix structurant
- Tests + fixtures

---

## 4. Détails techniques (annexe)

**Contrats API v1** — squelette identique pour toutes les routes :
```text
src/routes/api/v1/<domain>/<resource>.ts   → GET/POST list+create
src/routes/api/v1/<domain>/<resource>.$id.ts → GET/PATCH/DELETE
```
Réponses : `{ success, data, meta }` / erreurs : `{ success:false, error:{code,message,details} }`. Pagination `page`, `page_size`, tri `?sort=-created_at`.

**Layout d'un domaine (rappel canonique)** :
```text
src/domains/<name>/
  entities/     # DTO purs, zéro dépendance
  repositories/ # local (Dexie via BaseRepository) + remote (Supabase)
  services/     # orchestration intra-domaine
  use-cases/    # 1 fonction = 1 cas d'usage, enfile via outbox si mutation
  hooks/        # bindings React (SSR-safe)
  components/   # UI présentationnelle (<300 lignes)
  data/seed.ts  # seed isomorphique
  README.md     # responsabilité, events publiés, conflits sync
  index.ts      # barrel PUBLIC (seule surface autorisée)
```

**Interdits code (lint)** :
- Import `@/integrations/supabase/*` hors `src/domains/*/repositories/*.remote.ts` et `src/routes/api/v1/**`.
- Import `@/packages/offline/*` hors `src/domains/*/repositories/*.local.ts` et `src/packages/*`.
- Import cross-domain : `@/domains/A` → `@/domains/B/(entities|hooks|use-cases)` uniquement via `index.ts`.

**Environnements & secrets** :
- Local : `.env` géré, données factices.
- Dev / Staging / Prod : trois projets Supabase distincts (à provisionner via Lovable Cloud), secrets uniquement dans la plateforme, jamais dans le code.

**Definition of Done d'une tâche** :
1. Code + tests + docs domaine mis à jour.
2. Aucune violation de la matrice de dépendances (script archi).
3. Migration testée `down/up`.
4. RLS validée par `supabase--linter`.
5. Un scénario Playwright ou test unitaire couvre le happy path.
6. PR référence `TASK-ID` + docs source consultés.

---

## 5. Livrable de sortie

À la clôture de la Phase 9 :
- Vitala V1 en production, domaines UDI + Flash + Mission + Trust + Messaging + Notification opérationnels, offline-first vérifié, intelligence de base branchée.
- Toute la doc `docs/` reste la source de vérité ; ce plan est archivé comme `docs/roadmap/V1-DELIVERED.md`.
- Backlog V2 (Organizations avancé, API publique, Flutter, marketplace) ouvert.
