# Guide de contribution

Merci d'être intéressé par la contribution à **Axiom Forge Framework** ! 🙏

Ce guide explique comment contribuer efficacement au projet.

---

## 📋 Table des matières

1. [Code of Conduct](#code-of-conduct)
2. [Avant de commencer](#avant-de-commencer)
3. [Git Workflow](#git-workflow)
4. [Code Style](#code-style)
5. [Ajouter un domaine](#ajouter-un-domaine)
6. [Ajouter une route](#ajouter-une-route)
7. [Ajouter un composant](#ajouter-un-composant)
8. [Processus de PR](#processus-de-pr)
9. [Conventions](#conventions)

---

## 🤝 Code of Conduct

- **Respectueux** : Traite les contributeurs avec respect
- **Inclusif** : Bienvenue aux expériences et perspectives différentes
- **Constructif** : Donne du feedback actionnable et bienveillant
- **Honnête** : Admets les erreurs, apprends et progresse

Voir [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) (TODO) pour plus de détails.

---

## 👀 Avant de commencer

### Setup local

```bash
# 1. Fork le repo sur GitHub
# 2. Clone ton fork
git clone https://github.com/[ton-username]/axiom-forge-framework.git
cd axiom-forge-framework

# 3. Ajoute upstream pour rester à jour
git remote add upstream https://github.com/paulondoa20-coder/axiom-forge-framework.git

# 4. Install dépendances
npm install

# 5. Configure .env.local
cp .env.example .env.local
# Édite avec tes credentials Supabase
```

### Vérification du setup

```bash
# Vérifie que tout fonctionne
npm run lint
npm run dev

# L'app doit être disponible sur http://localhost:5173
```

### Docs utiles

Avant de coder, lis :
- [README.md](./README.md) — Vue d'ensemble
- [ARCHITECTURE.md](./ARCHITECTURE.md) — Design et patterns
- [IMPROVEMENT_PLAN.md](./IMPROVEMENT_PLAN.md) — Roadmap des phases

---

## 🌳 Git Workflow

### Branching Strategy

Utilise **GitHub Flow** simplifié :

```
main (protected)
  ↑
  └─ feature/[nom-feature]  → PR → review → merge
  └─ fix/[nom-bug]
  └─ docs/[nom-doc]
  └─ chore/[nom-task]
```

**Format du nom** : `type/description-en-kebab-case`

Types acceptés :
- `feat/` — Nouvelle fonctionnalité
- `fix/` — Correction de bug
- `docs/` — Documentation seulement
- `refactor/` — Refactoring (zero new features)
- `perf/` — Optimisation performance
- `chore/` — Config, deps, tooling
- `test/` — Tests seulement

**Exemples** :
```bash
git checkout -b feat/profile-edit-dialog
git checkout -b fix/profile-city-validation
git checkout -b docs/architecture-update
```

### Commits

**Format** : `type(scope): description`

```
feat(identity): add city field to profile
fix(profile-dialog): handle null bio correctly
docs(architecture): update domain patterns
chore(deps): upgrade react to 19.2.1
```

**Bonnes pratiques** :
- ✅ Commits atomiques (une idée = un commit)
- ✅ Messages descriptifs (50 chars titre + détail)
- ✅ Référence issues : `fix #123` ou `closes #123`
- ❌ Pas de merge commits (rebase avant PR)

```bash
# Exemple : 3 commits pour une feature
git commit -m "feat(identity): add city field to entity"
git commit -m "feat(identity): update ProfileRepository mapping"
git commit -m "feat(identity): add city input to ProfileEditDialog"
```

### Push & Pull Request

```bash
# Update ta branche avec upstream
git fetch upstream
git rebase upstream/main

# Push ta branche
git push origin feat/my-feature

# Crée une PR sur GitHub
# → Le CI/CD check va lancer automatiquement
```

---

## 🎨 Code Style

### ESLint & Prettier

```bash
# Check linting
npm run lint

# Fix + format
npm run format

# Format un fichier spécifique
npx prettier --write src/my-file.ts
```

**Setup IDE** (VSCode) :

```json
// .vscode/settings.json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### TypeScript

- ✅ Types explicites sur API publiques
- ✅ `interface` pour contracts, `type` pour unions
- ✅ Évite `any`, utilise `unknown` + type guard
- ❌ Pas de `@ts-ignore` sans justification

```typescript
// ✅ Bon
export function getProfile(id: string): Promise<Profile | null> {
  // ...
}

// ❌ Mauvais
export function getProfile(id: any): any {
  // ...
}
```

### React & Components

- ✅ Functional components + hooks
- ✅ Props interfaces explicites
- ✅ Destructure props
- ✅ Comments pour logique complexe

```typescript
// ✅ Bon
interface ProfileEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileEditDialog({ open, onOpenChange }: ProfileEditDialogProps) {
  // ...
}

// ❌ Mauvais
export function ProfileEditDialog(props) {
  const { open, onOpenChange } = props;
  // ...
}
```

### Import Order

```typescript
// 1. External libraries
import { useState } from "react";
import { useForm } from "react-hook-form";

// 2. Internal (from @/)
import { useProfile, ProfileEditDialog } from "@/domains/identity";
import { Button } from "@/components/ui/button";

// 3. Relative imports
import { helper } from "./helper";

// 4. Empty line before exports
export function MyComponent() {
  // ...
}
```

### Naming Conventions

| Type | Convention | Exemple |
|------|-----------|---------|
| Files | kebab-case | `profile-edit-dialog.tsx` |
| Directories | kebab-case | `src/domains/identity/` |
| Components | PascalCase | `ProfileEditDialog` |
| Functions | camelCase | `getMyProfile()` |
| Constants | UPPER_SNAKE_CASE | `MAX_BIO_LENGTH = 2000` |
| Interfaces | PascalCase + suffix | `ProfileUpdateInput` |
| Types | PascalCase | `type Profile = { ... }` |
| React hooks | useXxx | `useProfile()` |

---

## 🏛️ Ajouter un domaine

**Template** pour un nouveau domaine (ex: `notifications`).

### 1. Structure

```bash
mkdir -p src/domains/notifications/{entities,repositories,hooks,components,use-cases,services}
touch src/domains/notifications/{index.ts,README.md}
```

### 2. Entity

```typescript
// src/domains/notifications/entities/Notification.ts
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationCreateInput {
  title: string;
  message: string;
}
```

### 3. Repository

```typescript
// src/domains/notifications/repositories/NotificationRepository.ts
import { createNotification, getMyNotifications } from "@/lib/notifications.functions";
import type { Notification } from "../entities/Notification";

type Row = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
};

function toDto(row: Row): Notification {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    message: row.message,
    read: row.read,
    createdAt: row.created_at,
  };
}

export class NotificationRepository {
  async getMyNotifications(): Promise<Notification[]> {
    const rows = (await getMyNotifications()) as Row[] | null;
    return rows ? rows.map(toDto) : [];
  }
}

export const notificationRepository = new NotificationRepository();
```

### 4. Use-cases

```typescript
// src/domains/notifications/use-cases/GetMyNotifications.ts
import { notificationRepository } from "../repositories/NotificationRepository";
import type { Notification } from "../entities/Notification";

export async function getMyNotifications(): Promise<Notification[]> {
  return notificationRepository.getMyNotifications();
}
```

### 5. Hooks

```typescript
// src/domains/notifications/hooks/useNotifications.ts
import { useCallback, useEffect, useState } from "react";
import { getMyNotifications } from "../use-cases/GetMyNotifications";
import type { Notification } from "../entities/Notification";

interface UseNotificationsState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useNotifications(): UseNotificationsState {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyNotifications();
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { notifications, loading, error, refresh };
}
```

### 6. Barrel Export

```typescript
// src/domains/notifications/index.ts
export * from "./entities/Notification";
export { NotificationRepository, notificationRepository } from "./repositories/NotificationRepository";
export { getMyNotifications } from "./use-cases/GetMyNotifications";
export { useNotifications } from "./hooks/useNotifications";
```

### 7. Documentation

```markdown
# Domain — notifications

Owner : [Ton nom ou Team].

## Responsabilité
Gestion des notifications utilisateur (push, in-app, email).

## Surface publique (barrel `index.ts`)
- Types : `Notification`, `NotificationCreateInput`
- Hooks : `useNotifications`
- Use-cases : `getMyNotifications`, `createNotification`

## Fichiers touchant Supabase
- `src/lib/notifications.functions.ts` (server functions)
- `src/domains/notifications/repositories/NotificationRepository.ts`

## Tâches ouvertes
- [ ] Implémenter créer notification
- [ ] Ajouter marquer comme lue
```

---

## 🛤️ Ajouter une route

**Exemple** : Ajouter `/notifications` page.

```typescript
// src/routes/notifications.tsx
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { HubHeader } from "@/components/hub/HubHeader";
import { useNotifications } from "@/domains/notifications";
import { Bell } from "lucide-react";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — VITALA" },
      { name: "description", content: "Tes notifications récentes." },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const { notifications, loading } = useNotifications();

  if (loading) return <div>Chargement...</div>;

  return (
    <AppShell>
      <HubHeader
        eyebrow="Notifications"
        title="Tes messages"
        icon={<Bell className="h-5 w-5" />}
      />
      
      <div className="space-y-2">
        {notifications.map((n) => (
          <div key={n.id} className="rounded border p-3">
            <h3 className="font-semibold">{n.title}</h3>
            <p className="text-sm text-muted-foreground">{n.message}</p>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
```

---

## 🧩 Ajouter un composant

**Où** :
- UI primitives (Button, Dialog) → `src/components/ui/`
- Custom UI (SmartCard, TrustBadge) → `src/components/ui-kit/`
- Layout (AppShell, Header) → `src/components/layout/`
- Spécifiques au domaine → `src/domains/[domain]/components/`

**Template** :

```typescript
// src/components/ui-kit/MyComponent.tsx
import { ReactNode } from "react";
import { cn } from "@/lib/utils"; // Si besoin de class merging

interface MyComponentProps {
  title: string;
  children: ReactNode;
  variant?: "default" | "outlined";
  className?: string;
}

/**
 * MyComponent — Description courte.
 * 
 * @example
 * <MyComponent title="Hello">
 *   <p>Content</p>
 * </MyComponent>
 */
export function MyComponent({
  title,
  children,
  variant = "default",
  className,
}: MyComponentProps) {
  return (
    <div className={cn("rounded border p-4", variant === "outlined" && "border-2", className)}>
      <h2 className="font-semibold">{title}</h2>
      {children}
    </div>
  );
}
```

---

## 📝 Processus de PR

### Avant de créer une PR

1. ✅ Rebase sur `upstream/main`
```bash
git fetch upstream
git rebase upstream/main
```

2. ✅ Tests & linting
```bash
npm run lint && npm run format
```

3. ✅ Build check
```bash
npm run build
```

### Template de PR

```markdown
## 📝 Description
Brève description de ce que cette PR fait.

## 🎯 Pourquoi
Pourquoi cette change est nécessaire (problème résolu, feature ajoutée).

## 📋 Checklist
- [ ] Tests ajoutés ou modifiés
- [ ] Docs mises à jour (si besoin)
- [ ] Pas de breaking changes
- [ ] Lint & format passent

## 🔗 Liens
Référence issues : fixes #123

## 📸 Screenshots (si UI)
Avant/après si pertinent.
```

### Code Review

**Reviewer** va vérifier :
- ✅ Architecture et patterns respectés
- ✅ Code style conforme
- ✅ Tests adéquats
- ✅ Docs à jour
- ✅ Pas de régression

**Contributor** va :
- 💬 Répondre aux questions respectueusement
- 🔧 Faire les changements demandés
- ✅ Re-request review quand prêt

### Merge

PR mergée seulement si :
- ✅ CI/CD pipeline green
- ✅ 1+ approval de reviewer
- ✅ 0 conflits

---

## 📐 Conventions spéciales

### Server Functions

Tous les accès données transitent par server functions :

```typescript
// ✅ Bon : server function avec middleware auth
export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => updateSchema.parse(input))
  .handler(async ({ data, context }) => {
    // context.userId est injecté par middleware
    // context.supabase est le client auth-scoped
    return await context.supabase
      .from("profiles")
      .update(data)
      .eq("id", context.userId);
  });

// ❌ Mauvais : import direct client.server dans composant
import { client } from "@/integrations/supabase/client.server";
export function MyComponent() {
  // N'appelle JAMAIS client directement ici
}
```

### Zod Schemas

Deux niveaux :

```typescript
// Server : snake_case, règles métier
// src/lib/identity.functions.ts
const updateSchema = z.object({
  display_name: z.string().min(1).max(80),
  city: z.string().max(120).nullish(),
});

// Client : camelCase, UX validation
// src/domains/identity/components/ProfileEditDialog.tsx
const profileEditSchema = z.object({
  displayName: z.string().min(1, "Name required"),
  city: z.string().max(120).optional(),
});
```

### Error Handling

```typescript
// À venir (Phase 3) : utiliser AppError centralisé
try {
  const result = await updateProfile(data);
} catch (err) {
  if (err instanceof ValidationError) {
    showToast.error("Données invalides");
  } else if (err instanceof AppError) {
    showToast.error(err.message);
  } else {
    showToast.error("Erreur inconnue");
  }
}
```

---

## 📚 Ressources

- [TanStack Router Docs](https://tanstack.com/router/latest)
- [React Hook Form Docs](https://react-hook-form.com/)
- [Zod Docs](https://zod.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Radix UI Docs](https://radix-ui.com/docs)
- [Supabase Docs](https://supabase.com/docs)

---

## ❓ Questions ?

- 📖 Consulte [ARCHITECTURE.md](./ARCHITECTURE.md)
- 💬 Ouvre une [Discussion](https://github.com/paulondoa20-coder/axiom-forge-framework/discussions)
- 🐛 Signale un bug via [Issues](https://github.com/paulondoa20-coder/axiom-forge-framework/issues)

---

**Merci de contribuer !** 🚀
