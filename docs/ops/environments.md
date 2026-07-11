# Environnements Vitala

> Source : Build-Supabase Partie B, Deployment Guide.

## Vue d'ensemble

| Env | Cible | Données | Accès | Utilisation |
|---|---|---|---|---|
| **Local** | machine dev | Fake seeds uniquement | Dev individuel | Développement quotidien, tests unitaires |
| **Development** | Lovable Cloud (projet dédié, à venir) | Fake seeds + fixtures E2E | Équipe | Intégration continue, tests migrations |
| **Staging** | Lovable Cloud (projet dédié, à venir) | Copie anonymisée de prod | Équipe + PO | Recette fonctionnelle, tests de charge |
| **Production** | Lovable Cloud (projet actuel) | Données réelles utilisateurs | Utilisateurs finaux | Live |

**État actuel** : un seul environnement (Production Lovable Cloud). Les envs Dev/Staging seront provisionnés lors de la Phase 9 (P9-01).

## Règles inviolables
1. **Aucune donnée réelle** en Local ou Development.
2. **Aucun secret** commité — uniquement dans la plateforme (variables Lovable, `add_secret`).
3. **Aucun accès direct** à la DB de prod hors migration approuvée.
4. **Chaque env a son propre projet Supabase** — pas de partage de base.
5. **Les migrations remontent** : Local → Dev → Staging → Prod. Jamais de "quick fix" écrit directement en Prod.

## Secrets & variables

| Nom | Portée | Où le lire |
|---|---|---|
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID` | Client (browser) | `import.meta.env.*` |
| `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` | Server (server fn / route) | `process.env.*` |
| `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_URL` | Server privilégié uniquement | `process.env.*`, dans `client.server.ts` |
| `LOVABLE_API_KEY` | Server (AI Gateway) | `process.env.*` |

**Interdits** :
- Renommer une clé service en `VITE_*`.
- Lire `process.env.*` dans du code partagé importé côté navigateur.
- Copier une clé de prod dans `.env` local.

## Sauvegardes & DR
- Backups Postgres : gérés par Lovable Cloud (à documenter en P8-06).
- Storage : bucket-level backup (à définir quand les buckets seront créés).
- Playbook de restauration : `docs/ops/RUNBOOK.md` (P9-03).

## Pipeline de déploiement (cible)
```
Local commit → PR → CI (lint + typecheck + tests + archi-check)
             → Merge → Deploy Dev → Validation
             → Promote Staging → Recette
             → Promote Prod (Lovable publish)
```

## Provisioning à faire (P9)
- [ ] Projet Supabase Dev
- [ ] Projet Supabase Staging
- [ ] Séparation des secrets par env
- [ ] Custom domain Prod
- [ ] Alertes monitoring
