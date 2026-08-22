# Plan d'Amélioration Axiom Forge Framework

**Date** : 2026-08-22  
**Version** : 1.0  
**Status** : En cours d'implémentation

---

## 📋 Vue d'ensemble

Ce document structure toutes les améliorations à apporter au projet **Axiom Forge Framework** en 6 phases majeures, avec dépendances et priorités claires.

### Contexte
- **Stack** : TanStack Start + React 19 + Supabase + Dexie + Zod
- **Architecture** : Domain-driven (identity, messaging, etc.)
- **Statut actuel** : Lot 1 (Profil éditable) terminé ✅

---

## 🎯 Phases d'implémentation

### **Phase 1 : Documentation & Architecture (Semaine 1)**
**Priorité** : CRITIQUE — Fondation pour toutes les autres phases

#### P1.1 — Refonte README principal
- [ ] Remplacer le README placeholder
- [ ] Ajouter : description, stack, structure, quick-start
- [ ] Ajouter badges (CI, version, license)

**Fichier** : `README.md`  
**Effort** : 2h

#### P1.2 — Créer ARCHITECTURE.md
- [ ] Diagramme architecture globale (domaines, sync, auth)
- [ ] Flux données (client → server → DB)
- [ ] Patterns : repository, use-case, hooks
- [ ] Dépendances entre domaines

**Fichier** : `ARCHITECTURE.md`  
**Effort** : 3h

#### P1.3 — Documenter chaque domaine
- [ ] `src/domains/identity/README.md` (mise à jour + exemples)
- [ ] `src/domains/messaging/README.md` (nouveau)
- [ ] Template : Responsabilité, API publique, patterns, tâches ouvertes

**Fichier** : `src/domains/*/README.md`  
**Effort** : 4h

#### P1.4 — Créer CONTRIBUTING.md
- [ ] Git workflow, branching strategy
- [ ] Code style, conventions, linting
- [ ] Comment ajouter un domaine, une route, un composant
- [ ] Processus de PR, code review

**Fichier** : `CONTRIBUTING.md`  
**Effort** : 2h

#### P1.5 — Créer DEPLOYMENT.md
- [ ] Environnements (dev, staging, prod)
- [ ] Variables d'env, secrets
- [ ] Build process, CI/CD setup
- [ ] Monitoring, logs

**Fichier** : `DEPLOYMENT.md`  
**Effort** : 2h

#### P1.6 — Mise à jour decision log
- [ ] Documenter décisions du Lot 1 (ajout `city` field)
- [ ] Ajouter ADR-003 pour patterns émergeants

**Fichier** : `docs/decisions/2026-08-22-*.md`  
**Effort** : 1h

---

### **Phase 2 : Infrastructure & Configuration (Semaine 1-2)**
**Priorité** : HAUTE — Bloque testing et déploiement

#### P2.1 — Env variables & .env setup
- [ ] Créer `.env.example` avec toutes les vars
- [ ] Documenter chaque variable (type, exemple, optionnel?)
- [ ] Setup local dev `.env.local` (Supabase, auth)

**Fichier** : `.env.example`, `.env.local`  
**Effort** : 1h

#### P2.2 — Setup Husky + lint-staged
- [ ] Installer Husky pour pre-commit hooks
- [ ] Ajouter lint + format checks
- [ ] Bloquer commits non-conformes

**Fichier** : `.husky/pre-commit`, `lint-staged.config.js`  
**Effort** : 1h

#### P2.3 — GitHub Actions CI/CD
- [ ] Lint workflow (ESLint, Prettier)
- [ ] Build workflow (vite build)
- [ ] Type-check workflow (tsc)
- [ ] Reporter sur PRs

**Fichier** : `.github/workflows/*.yml`  
**Effort** : 2h

#### P2.4 — Setup Vitest + test infrastructure
- [ ] Installer Vitest + @testing-library/react
- [ ] Créer config `vitest.config.ts`
- [ ] Ajouter test script `npm run test`
- [ ] Setup coverage thresholds (80%+)

**Fichier** : `vitest.config.ts`, `setup.ts`  
**Effort** : 2h

#### P2.5 — Setup Playwright (E2E)
- [ ] Installer Playwright
- [ ] Config `playwright.config.ts`
- [ ] Écrire 3-5 tests d'exemple (auth, profile, navigation)
- [ ] Ajouter script `npm run e2e`

**Fichier** : `playwright.config.ts`, `e2e/example.spec.ts`  
**Effort** : 3h

---

### **Phase 3 : Logging, Monitoring & Error Handling (Semaine 2)**
**Priorité** : HAUTE — Critical pour production

#### P3.1 — Centralized error handling
- [ ] Créer `src/packages/core/errors.ts` (AppError, ValidationError, etc.)
- [ ] Middleware d'erreur global dans `src/lib/error-handler.ts`
- [ ] ErrorBoundary React component
- [ ] Mapper erreurs Supabase → AppError

**Fichier** : `src/packages/core/errors.ts`, `src/lib/error-handler.ts`, `src/components/ErrorBoundary.tsx`  
**Effort** : 3h

#### P3.2 — Audit logging system
- [ ] Améliorer `src/packages/core/audit.server.ts`
- [ ] Logger : user action, resource, timestamp, changes
- [ ] Créer table Supabase `audit_logs`
- [ ] Implémenter audit pour tous les domaines

**Fichier** : `src/packages/core/audit.server.ts`, migrations SQL  
**Effort** : 3h

#### P3.3 — Observability (logging + metrics)
- [ ] Intégrer Pino ou Winston pour logging
- [ ] Setup structured logging (JSON)
- [ ] Log levels (debug, info, warn, error)
- [ ] Intégration avec Sentry (optionnel pour erreurs)

**Fichier** : `src/lib/logger.ts`  
**Effort** : 2h

#### P3.4 — Request/Response logging middleware
- [ ] Logger toutes les server functions
- [ ] Inclure: user_id, duration, status, errors
- [ ] Créer dashboard/query pour analyser logs

**Fichier** : `src/lib/logging.middleware.ts`  
**Effort** : 2h

---

### **Phase 4 : Security & Permissions (Semaine 2-3)**
**Priorité** : CRITIQUE — Non-négociable pour production

#### P4.1 — Supabase RLS (Row Level Security)
- [ ] Documenter stratégie RLS par domaine
- [ ] Implémenter RLS pour `profiles` (own profile only)
- [ ] Implémenter RLS pour `conversations` (participants only)
- [ ] Tester avec supabase-js sans `--unsafe`

**Fichier** : SQL migrations, `docs/SECURITY.md`  
**Effort** : 4h

#### P4.2 — Rate limiting
- [ ] Ajouter rate limiter sur server functions
- [ ] Limiter par user + endpoint
- [ ] Retourner 429 + retry-after header
- [ ] Configuration flexible (dev vs prod)

**Fichier** : `src/lib/rate-limit.ts`, middleware  
**Effort** : 2h

#### P4.3 — CSRF protection
- [ ] Valider origin sur server functions sensibles
- [ ] Ajouter token CSRF optionnel
- [ ] Documentation des vecteurs de risque

**Fichier** : `src/lib/csrf.ts`  
**Effort** : 1.5h

#### P4.4 — Input validation & sanitization
- [ ] Centraliser Zod validators
- [ ] Créer `src/lib/validation.ts`
- [ ] Sanitize tous les inputs (HTML, URLs, etc.)
- [ ] Documente patterns de validation

**Fichier** : `src/lib/validation.ts`, ADR-004  
**Effort** : 2h

#### P4.5 — Permissions & roles system
- [ ] Créer modèle permissions (admin, moderator, user)
- [ ] Ajouter colonne `role` à `profiles`
- [ ] Implement permission checks dans use-cases
- [ ] Créer helper `requireRole()` pour server fns

**Fichier** : `src/domains/identity/types/Permission.ts`, migrations  
**Effort** : 3h

---

### **Phase 5 : Data Layer & Caching (Semaine 3)**
**Priorité** : MOYENNE → HAUTE selon charge

#### P5.1 — Dexie database setup
- [ ] Configurer Dexie DB complètement
- [ ] Créer stores pour chaque domaine (profiles, conversations, etc.)
- [ ] Implémenter sync strategy (last-write-wins, avec timestamps)
- [ ] Offline-first fallback

**Fichier** : `src/lib/dexie.ts`, migrations  
**Effort** : 3h

#### P5.2 — Caching layer
- [ ] Créer `src/lib/cache.ts` (memory + Dexie)
- [ ] Cache key strategy (user-scoped)
- [ ] TTL configuration
- [ ] Invalidation on mutations

**Fichier** : `src/lib/cache.ts`  
**Effort** : 2h

#### P5.3 — Mutation optimism (React Query)
- [ ] Setup optimistic updates
- [ ] Rollback on error
- [ ] Debounce duplicate mutations
- [ ] Exemple dans profileEditDialog

**Fichier** : hooks, composants  
**Effort** : 2h

#### P5.4 — Query factories
- [ ] Créer factory pour les queries React Query
- [ ] Une query key strategy centralisée
- [ ] Reusable query + mutation definitions
- [ ] Exemple : `createProfileQueries()`

**Fichier** : `src/lib/queries.ts`, use-cases  
**Effort** : 2h

#### P5.5 — Schema migrations (Supabase)
- [ ] Documenter tous les schémas actuels
- [ ] Créer SQL migrations pour migration future
- [ ] Version schema (v1, v2, etc.)
- [ ] Script de migration local

**Fichier** : `supabase/migrations/*.sql`, `MIGRATIONS.md`  
**Effort** : 2h

---

### **Phase 6 : Testing & Quality (Semaine 3-4)**
**Priorité** : HAUTE — Code quality essential

#### P6.1 — Unit tests core utilities
- [ ] Tester `src/lib/validation.ts`
- [ ] Tester `src/packages/core/errors.ts`
- [ ] Tester `src/lib/cache.ts`
- [ ] Coverage > 80%

**Fichier** : `src/**/*.test.ts`  
**Effort** : 3h

#### P6.2 — Component tests (domains)
- [ ] Tester `ProfileEditDialog`
- [ ] Tester tous les domaine components
- [ ] Mock hooks + supabase
- [ ] Coverage > 80%

**Fichier** : `src/domains/**/*.test.tsx`  
**Effort** : 4h

#### P6.3 — E2E test suite
- [ ] Auth flow (login/logout)
- [ ] Profile view + edit
- [ ] Navigation entre domaines
- [ ] Error scenarios

**Fichier** : `e2e/*.spec.ts`  
**Effort** : 4h

#### P6.4 — Accessibility audit
- [ ] Audit avec axe-core
- [ ] Fixer issues WCAG 2.1 AA
- [ ] Test screen readers
- [ ] Créer accessibility checklist

**Fichier** : `.a11y-audit.md`, components fixes  
**Effort** : 3h

#### P6.5 — Performance audit
- [ ] Lighthouse audit (mobile + desktop)
- [ ] Bundle size analysis
- [ ] React DevTools profiler
- [ ] Créer performance targets

**Fichier** : `.perf-audit.md`, optimizations  
**Effort** : 2h

---

### **Phase 7 : Advanced Features (Semaine 4+)**
**Priorité** : MOYENNE — Nice-to-have

#### P7.1 — Real-time sync (WebSockets)
- [ ] Setup Supabase Realtime
- [ ] Subscribe à profile changes
- [ ] Sync across tabs
- [ ] Exemple : live conversation updates

**Fichier** : `src/lib/realtime.ts`, hooks  
**Effort** : 3h

#### P7.2 — Notifications system
- [ ] Créer domaine `notifications`
- [ ] Toast notifications (via Sonner)
- [ ] Persistent notifications (DB)
- [ ] Subscription management

**Fichier** : `src/domains/notifications/`, `src/lib/toast.ts`  
**Effort** : 3h

#### P7.3 — Search & filtering
- [ ] Full-text search (Supabase ou Algolia)
- [ ] Faceted filtering
- [ ] Search UI components
- [ ] Exemple : conversation search

**Fichier** : `src/lib/search.ts`, components  
**Effort** : 3h

#### P7.4 — Export & import
- [ ] Export profile data (JSON/CSV)
- [ ] Import user data
- [ ] GDPR compliance (data portability)
- [ ] Encryption for sensitive data

**Fichier** : `src/lib/export.ts`, server functions  
**Effort** : 2h

#### P7.5 — Analytics
- [ ] Setup PostHog ou Amplitude
- [ ] Track key user actions
- [ ] Custom events per domain
- [ ] Privacy-first approach

**Fichier** : `src/lib/analytics.ts`  
**Effort** : 2h

---

## 📊 Timeline & Dépendances

```
Phase 1 (Doc)     [████] Week 1      (Parallèle à Phase 2)
Phase 2 (Infra)   [████] Week 1-2    (Dépend de Phase 1)
Phase 3 (Logging) [████] Week 2      (Dépend de Phase 1, 2)
Phase 4 (Security)[████] Week 2-3    (Dépend de Phase 1, 2, 3)
Phase 5 (Data)    [████] Week 3      (Dépend de Phase 1, 2)
Phase 6 (Testing) [████] Week 3-4    (Dépend de toutes)
Phase 7 (Features)[████] Week 4+     (Optional, après Phase 6)
```

---

## 📈 Roadmap détaillé

| ID | Phase | Titre | Effort | Priorité | Status |
|---|---|---|---|---|---|
| P1.1 | 1 | README refont | 2h | CRITIQUE | ⬜ TODO |
| P1.2 | 1 | ARCHITECTURE.md | 3h | CRITIQUE | ⬜ TODO |
| P1.3 | 1 | Domain READMEs | 4h | HAUTE | ⬜ TODO |
| P1.4 | 1 | CONTRIBUTING.md | 2h | HAUTE | ⬜ TODO |
| P1.5 | 1 | DEPLOYMENT.md | 2h | MOYENNE | ⬜ TODO |
| P1.6 | 1 | Decision log P1 | 1h | HAUTE | ⬜ TODO |
| P2.1 | 2 | Env setup | 1h | HAUTE | ⬜ TODO |
| P2.2 | 2 | Husky + lint | 1h | MOYENNE | ⬜ TODO |
| P2.3 | 2 | GitHub Actions | 2h | HAUTE | ⬜ TODO |
| P2.4 | 2 | Vitest setup | 2h | HAUTE | ⬜ TODO |
| P2.5 | 2 | Playwright setup | 3h | HAUTE | ⬜ TODO |
| P3.1 | 3 | Error handling | 3h | CRITIQUE | ⬜ TODO |
| P3.2 | 3 | Audit logging | 3h | HAUTE | ⬜ TODO |
| P3.3 | 3 | Logger setup | 2h | MOYENNE | ⬜ TODO |
| P3.4 | 3 | Request logging | 2h | MOYENNE | ⬜ TODO |
| P4.1 | 4 | RLS setup | 4h | CRITIQUE | ⬜ TODO |
| P4.2 | 4 | Rate limiting | 2h | HAUTE | ⬜ TODO |
| P4.3 | 4 | CSRF protection | 1.5h | MOYENNE | ⬜ TODO |
| P4.4 | 4 | Input validation | 2h | CRITIQUE | ⬜ TODO |
| P4.5 | 4 | Permissions system | 3h | HAUTE | ⬜ TODO |
| P5.1 | 5 | Dexie setup | 3h | HAUTE | ⬜ TODO |
| P5.2 | 5 | Cache layer | 2h | MOYENNE | ⬜ TODO |
| P5.3 | 5 | Optimism updates | 2h | MOYENNE | ⬜ TODO |
| P5.4 | 5 | Query factories | 2h | MOYENNE | ⬜ TODO |
| P5.5 | 5 | SQL migrations | 2h | HAUTE | ⬜ TODO |
| P6.1 | 6 | Unit tests | 3h | HAUTE | ⬜ TODO |
| P6.2 | 6 | Component tests | 4h | HAUTE | ⬜ TODO |
| P6.3 | 6 | E2E tests | 4h | HAUTE | ⬜ TODO |
| P6.4 | 6 | A11y audit | 3h | MOYENNE | ⬜ TODO |
| P6.5 | 6 | Performance audit | 2h | MOYENNE | ⬜ TODO |
| P7.1 | 7 | Realtime sync | 3h | MOYENNE | ⬜ TODO |
| P7.2 | 7 | Notifications | 3h | MOYENNE | ⬜ TODO |
| P7.3 | 7 | Search | 3h | MOYENNE | ⬜ TODO |
| P7.4 | 7 | Export/Import | 2h | BASSE | ⬜ TODO |
| P7.5 | 7 | Analytics | 2h | BASSE | ⬜ TODO |

**Total estimé** : ~95 heures = 2-3 semaines en full-time

---

## 🎯 Critères de succès par phase

### Phase 1 ✅
- [ ] Tous les READMEs complets et à jour
- [ ] Contributors peuvent onboard en <30 min
- [ ] Architecture claire et documentée

### Phase 2 ✅
- [ ] CI/CD pipeline green ✓
- [ ] Tests runnable localement
- [ ] Hooks prevent bad commits

### Phase 3 ✅
- [ ] Tous les errors catchés globalement
- [ ] Audit log complet pour RGPD
- [ ] Structured logs exploitables

### Phase 4 ✅
- [ ] RLS policies tested
- [ ] No rate-limit bypasses
- [ ] Pen-test readiness

### Phase 5 ✅
- [ ] Offline-first fully working
- [ ] Cache hit rate > 70%
- [ ] Zero N+1 queries

### Phase 6 ✅
- [ ] Coverage > 80% globally
- [ ] 0 accessibility violations
- [ ] Lighthouse score > 90

### Phase 7 ✅
- [ ] Real-time features live
- [ ] Notifications working
- [ ] Analytics integrated

---

## 🚀 Prochaines étapes immédiates

**Pour démarrer Phase 1** :

1. [ ] Créer branche `docs/phase-1-setup`
2. [ ] Commencer par P1.1 (README refactoring)
3. [ ] Créer chaque fichier une par une
4. [ ] Valider avec `npm run lint`
5. [ ] Créer PR pour review

---

## 📝 Notes

- **Language** : Français pour docs destinées aux FR devs
- **Version control** : Chaque phase = PR séparée
- **Testing** : Phase 6 teste tous les changements précédents
- **Feedback loops** : Review après chaque phase majeure
- **Flexibility** : Ajuster priorités selon feedback utilisateur

---

**Créé par** : Copilot  
**Mise à jour** : 2026-08-22  
**Reviewed par** : -
