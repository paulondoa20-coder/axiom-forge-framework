# Axiom Forge Framework

**Une plateforme communautaire confiance-first, construite avec TanStack Start + React 19 + Supabase**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb.svg)](https://react.dev)
[![TanStack Start](https://img.shields.io/badge/TanStack%20Start-1.167-yellow.svg)](https://tanstack.com/start)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🎯 À propos

**Axiom Forge Framework** est une refonte architected du projet [Axiom Scape](https://github.com/stamdollar/axiom-scape), conçue avec une architecture **domain-driven** moderne pour supporter :

- ✅ **Messagerie décentralisée** : Conversations temps réel entre utilisateurs
- ✅ **Système d'identité flexible** : Profils, préférences, niveau de confiance
- ✅ **Confiance progressive** : Vérification, scoring, permissions granulaires
- ✅ **Offline-first** : Sync via Dexie + Supabase avec fallback hors-ligne
- ✅ **Scalable & maintenable** : Séparation des domaines, tests, patterns clairs

**Status** : En développement actif (Phase 1 : Profil éditable ✅)

---

## 🚀 Quick Start

### Prérequis
- **Node.js** : 18+ (installez avec [nvm](https://github.com/nvm-sh/nvm))
- **npm** : 9+
- **Supabase CLI** : `brew install supabase/tap/supabase` (optionnel, pour local dev)

### Installation

```bash
# Clone le repo
git clone https://github.com/paulondoa20-coder/axiom-forge-framework.git
cd axiom-forge-framework

# Install dépendances
npm install

# Configure env local
cp .env.example .env.local
# Édite .env.local avec tes credentials Supabase

# Démarre le dev server
npm run dev
```

**L'app est maintenant disponible sur** : http://localhost:5173

### Scripts disponibles

```bash
# Développement
npm run dev          # Start Vite + dev server (HMR activé)

# Build & deploy
npm run build        # Build optimisé pour production
npm run build:dev    # Build en mode développement (debugging)
npm run preview      # Preview du build production localement

# Quality
npm run lint         # ESLint check
npm run format       # Prettier format + fix

# Testing (à venir)
npm run test         # Vitest unit tests
npm run test:watch   # Watch mode
npm run e2e          # Playwright E2E tests
```

---

## 📁 Structure du projet

```
axiom-forge-framework/
├── src/
│   ├── routes/                    # TanStack Router routes
│   │   ├── profile.tsx           # /profile page + ProfileEditDialog
│   │   ├── messages.tsx          # /messages (inbox, chat)
│   │   └── ...
│   │
│   ├── domains/                   # Domain-driven architecture
│   │   ├── identity/             # Gestion des profils et préférences
│   │   │   ├── entities/         # Types (Profile, ProfileUpdateInput)
│   │   │   ├── repositories/     # ProfileRepository (Supabase + Dexie)
│   │   │   ├── hooks/            # useProfile, usePrefs
│   │   │   ├── components/       # ProfileEditDialog
│   │   │   ├── use-cases/        # getMyProfile, updateProfile
│   │   │   ├── services/         # PreferencesContext
│   │   │   ├── index.ts          # Barrel export
│   │   │   └── README.md         # Documentation domaine
│   │   │
│   │   ├── messaging/            # Conversations, messages (TODO)
│   │   └── [autres domaines]/
│   │
│   ├── components/
│   │   ├── layout/               # AppShell, Headers, etc.
│   │   ├── ui/                   # Primitives (Button, Dialog, etc. - Radix UI)
│   │   ├── ui-kit/               # Custom components (SmartCard, TrustBadge)
│   │   └── ErrorBoundary.tsx     # (TODO) Error handling
│   │
│   ├── lib/                       # Utilities & services
│   │   ├── identity.functions.ts # Server functions pour identity (Supabase RPC)
│   │   ├── dexie.ts              # IndexedDB setup (Dexie)
│   │   ├── cache.ts              # (TODO) Client-side caching
│   │   ├── validation.ts         # (TODO) Centralized Zod schemas
│   │   ├── logger.ts             # (TODO) Structured logging
│   │   ├── error-handler.ts      # (TODO) Global error handling
│   │   └── ...
│   │
│   ├── integrations/
│   │   └── supabase/             # Supabase config & utilities
│   │       ├── client.ts         # Client JS
│   │       ├── client.server.ts  # Server-only client
│   │       └── auth-middleware.ts
│   │
│   ├── packages/
│   │   └── core/                 # Shared packages
│   │       ├── errors.ts         # (TODO) Custom error types
│   │       └── audit.server.ts   # Audit logging
│   │
│   └── app.tsx                   # Root App component
│
├── docs/
│   ├── ARCHITECTURE.md           # Architecture overview (TODO)
│   ├── CONTRIBUTING.md           # Dev guidelines (TODO)
│   ├── DEPLOYMENT.md             # Env setup & deployment (TODO)
│   ├── SECURITY.md               # Security best practices (TODO)
│   ├── MIGRATIONS.md             # Database migrations (TODO)
│   ├── decisions/                # ADR & Decision log
│   │   ├── README.md
│   │   ├── YYYY-MM-DD-*.md      # Decision entries
│   │   └── ...
│   └── architecture/             # Detailed ADRs
│       ├── ADR-001-domain-package-separation.md
│       ├── ADR-002-multi-agent-workflow.md
│       └── ...
│
├── e2e/                          # Playwright tests (TODO)
│   └── example.spec.ts
│
├── .github/
│   └── workflows/                # CI/CD (TODO)
│       ├── lint.yml
│       ├── test.yml
│       └── deploy.yml
│
├── supabase/
│   ├── migrations/               # SQL migrations (TODO)
│   └── config.toml
│
├── .env.example                  # Environment template (TODO)
├── IMPROVEMENT_PLAN.md           # Phase implementation roadmap
├── README.md                      # This file
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.ts
```

### Architecture par domaines

Chaque **domaine** est une unité autonome avec :
- **Entities** : Types TypeScript (DTOs, purs)
- **Repositories** : Abstraction Supabase/Dexie
- **Use-cases** : Logique métier (isolée de React)
- **Hooks** : Intégration React (useProfile, useConversation)
- **Components** : UI spécifique au domaine
- **Services** : Contextes React, état global
- **API public** : Barrel export `index.ts`

**Contrainte clé** : Zéro import direct de `@/integrations/supabase/*` en dehors des repositories.

---

## 🏗️ Stack technique

| Couche | Tech |
|--------|------|
| **Runtime** | Node.js 18+ |
| **Framework** | TanStack Start (Full-stack React) |
| **React** | 19.2 (latest stable) |
| **Routing** | TanStack Router 1.168 |
| **Styling** | Tailwind CSS 4 + Radix UI |
| **Backend** | Supabase (PostgreSQL + Auth + Realtime) |
| **State** | React Query 5.83 (server state) + React Hooks (UI state) |
| **Local DB** | Dexie 4.4 (IndexedDB wrapper) |
| **Validation** | Zod 3.24 |
| **Forms** | React Hook Form 7.71 + @hookform/resolvers |
| **Logging** | (TODO) Pino/Winston |
| **Testing** | (TODO) Vitest + Playwright |
| **Linting** | ESLint 9.32 + Prettier 3.7 |

---

## 📚 Documentation

### Pour les développeurs
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** — Design global, flux données, patterns (TODO)
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** — Git workflow, code style, conventions (TODO)
- **[Domaine READMEs](./src/domains/*/README.md)** — Responsabilités, API, patterns par domaine

### Pour les ops
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** — Env setup, CI/CD, secrets (TODO)
- **[MIGRATIONS.md](./docs/MIGRATIONS.md)** — Database schema, migrations (TODO)
- **[SECURITY.md](./docs/SECURITY.md)** — RLS, auth, rate-limiting (TODO)

### Décisions techniques
- **[Decision Log](./docs/decisions/README.md)** — ADRs et decisions par phase
- **[IMPROVEMENT_PLAN.md](./IMPROVEMENT_PLAN.md)** — Roadmap 7 phases, 95h de travail

---

## 🔐 Sécurité

> **Status** : En mise en place (Phase 4 du plan). Voir [IMPROVEMENT_PLAN.md](./IMPROVEMENT_PLAN.md).

Actuellement couverts :
- ✅ Auth via Lovable Cloud Auth (SSO, 2FA optionnel)
- ✅ Server functions avec `requireSupabaseAuth` middleware
- ❌ RLS (Row Level Security) — TODO Phase 4
- ❌ Rate limiting — TODO Phase 4
- ❌ Input sanitization — TODO Phase 4
- ❌ CSRF protection — TODO Phase 4

### Secrets

Ne jamais commit les secrets ! Utilise `.env.local` :

```bash
# .env.local (jamais commit, voir .gitignore)
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxx
VITE_AUTH_REDIRECT_URL=http://localhost:5173
```

Voir `.env.example` pour le template.

---

## 🧪 Testing

> **Status** : À venir (Phase 2). Voir [IMPROVEMENT_PLAN.md](./IMPROVEMENT_PLAN.md).

```bash
# Unit tests (Vitest)
npm run test

# E2E tests (Playwright)
npm run e2e

# Coverage
npm run test:coverage
```

---

## 📊 Phases implémentation

Voir **[IMPROVEMENT_PLAN.md](./IMPROVEMENT_PLAN.md)** pour le roadmap détaillé.

**Status actuel** :
- ✅ **Lot 1 — Profil éditable** (2026-08-22)
- 🔄 **Phase 1 — Documentation** (en cours)
- ⬜ Phase 2 — Infrastructure & CI/CD
- ⬜ Phase 3 — Logging & Monitoring
- ⬜ Phase 4 — Security & Permissions
- ⬜ Phase 5 — Data caching & sync
- ⬜ Phase 6 — Testing & Quality
- ⬜ Phase 7 — Advanced features (WebSocket, notifications, search)

---

## 🤝 Contribution

Voir **[CONTRIBUTING.md](./CONTRIBUTING.md)** (TODO) pour :
- Git workflow (branching strategy)
- Code style (ESLint, Prettier)
- Comment ajouter un domaine
- Processus de PR & code review

**TL;DR** :
```bash
git checkout -b feat/my-feature
npm run lint && npm run format
git push origin feat/my-feature
# → Créer PR sur GitHub
```

---

## 📝 Licence

MIT License. Voir [LICENSE](./LICENSE).

---

## 📞 Support

- **Issues** : [GitHub Issues](https://github.com/paulondoa20-coder/axiom-forge-framework/issues)
- **Discussions** : [GitHub Discussions](https://github.com/paulondoa20-coder/axiom-forge-framework/discussions)
- **Email** : paulondoa20@gmail.com

---

## 🙏 Remerciements

- Inspiration : [Axiom Scape](https://github.com/stamdollar/axiom-scape)
- Built with ❤️ using [Lovable](https://lovable.dev)
- UI powered by [Radix UI](https://radix-ui.com/) & [Tailwind CSS](https://tailwindcss.com/)
- Backend : [Supabase](https://supabase.com/)

---

**Last updated** : 2026-08-22  
**Maintainer** : [@paulondoa20-coder](https://github.com/paulondoa20-coder)
