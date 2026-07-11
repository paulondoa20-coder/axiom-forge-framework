# TASK-<ID> — <Titre court>

> Copier ce fichier vers `docs/tasks/TASK-<ID>-<slug>.md` avant de commencer.

## Métadonnées
- **TASK-ID** : `P<phase>-<num>` (ex. `P3B-02`)
- **Phase** : 0 · 1 · 2 · 3 · 4 · 5 · 6 · 7 · 8 · 9
- **Domaine propriétaire** : `src/domains/<name>` (ou `infra` / `ds` / `sync`)
- **Agent / dev assigné** :
- **Priorité** : P0 (bloquant) · P1 · P2
- **Complexité** : S · M · L · XL
- **Statut** : `todo` · `in-progress` · `review` · `done` · `blocked`

## Objectif
Une phrase claire. Ce que doit permettre la tâche, pas comment la coder.

## Docs sources à lire AVANT de coder
- [ ] `.lovable/plan.md` § phase concernée
- [ ] `docs/architecture/ADR-002-multi-agent-workflow.md`
- [ ] `docs/<chemin-doc-métier>.pdf`
- [ ] `src/domains/<name>/README.md` (si existe)

## Dépendances
- **Précède** : TASK-...
- **Bloque** : TASK-...
- **Fichiers touchés (annonce)** :
  - `src/domains/<name>/**`
  - `supabase/migrations/<n>_<slug>.sql` (si migration)

## Livrables
- [ ] Code
- [ ] Migration SQL (avec RLS + GRANT + index FK)
- [ ] Tests (unitaires / e2e)
- [ ] MàJ `src/domains/<name>/README.md`
- [ ] Entrée `docs/decisions/` si choix structurant

## Critères de validation (Definition of Done)
- [ ] Compile (typecheck + build).
- [ ] Aucun import interdit (script `scripts/check-arch.ts`).
- [ ] `supabase--linter` = 0 nouveau warning critique.
- [ ] Scénario happy path testé (unit ou Playwright).
- [ ] Docs synchronisées.
- [ ] PR référence ce `TASK-ID` en titre.

## Notes / décisions prises pendant l'exécution
<!-- L'agent écrit ici au fur et à mesure -->
