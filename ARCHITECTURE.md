# Architecture — Axiom Forge Framework

**Document technique** pour comprendre la structure globale, les patterns, et les flux de données.

---

## 📐 Vue d'ensemble

Axiom Forge Framework utilise une **architecture domain-driven** (DDD) avec séparation claire des responsabilités :

```
┌─────────────────────────────────────┐
│       React Components              │  (Presentational)
│       (routes, UI, hooks)           │
└──────────────────┬──────────────────┘
                   │
┌──────────────────v──────────────────┐
│    Use-cases & Business Logic       │  (Application)
│    (getMyProfile, updateProfile)    │
└──────────────────┬──────────────────┘
                   │
┌──────────────────v──────────────────┐
│    Repositories & Data Access       │  (Domain)
│    (ProfileRepository)              │
└──────────────────┬──────────────────┘
                   │
┌──────────────────v──────────────────┐
│  External Services (Supabase, DB)   │  (Infrastructure)
└─────────────────────────────────────┘
```

---

## 🏛️ Architecture par domaines

### Concept : Domain-Driven Design (DDD)

Chaque **domaine** métier (identity, messaging, etc.) est une unité autonome avec :

```
domain/
├── entities/          # Types TypeScript (DTOs, aucune dépendance)
├── repositories/      # Abstraction données (Supabase, Dexie, cache)
├── use-cases/         # Logique métier purs (testables)
├── hooks/             # Intégration React (useProfile, useConversation)
├── components/        # UI spécifique au domaine
├── services/          # Contextes React, état partagé
├── index.ts           # Barrel export (API publique)
└── README.md          # Documentation domaine
```

### Exemple : Identity Domain

**Responsabilité** : Gestion profils utilisateur + préférences

```
src/domains/identity/
├── entities/
│   └── Profile.ts              # type Profile { id, displayName, bio, city, ... }
│
├── repositories/
│   └── ProfileRepository.ts     # class ProfileRepository {
│                                #   async me(): Profile
│                                #   async updateMe(input): Profile
│                                # }
│
├── use-cases/
│   ├── GetMyProfile.ts         # async getMyProfile(): Profile
│   └── UpdateProfile.ts        # async updateProfile(input): Profile
│
├── hooks/
│   └── useProfile.ts           # function useProfile(): {
│                                #   profile, loading, error, refresh, save
│                                # }
│
├── components/
│   └── ProfileEditDialog.tsx   # Dialog form (nom, bio, quartier, ville)
│
├── services/
│   └── PreferencesContext.tsx  # React Context (thème, langue)
│
├── index.ts                    # export * from "./entities/Profile"
│                               # export { useProfile } from "./hooks/..."
│
└── README.md                   # Documentation : responsabilité, API publique
```

### Pattern : Repository

**Pourquoi ?** Abstrait la source de données (Supabase, Dexie, cache).

```typescript
// Sans Repository : couplage direct
const profile = await supabase
  .from("profiles")
  .select("*")
  .eq("id", userId);

// Avec Repository : abstraction propre
const profile = await profileRepository.me();
```

**Implémentation** :

```typescript
// src/domains/identity/repositories/ProfileRepository.ts
type Row = { id: string; display_name: string; /* ... */ };

function toDto(row: Row): Profile {
  return { id: row.id, displayName: row.display_name /* ... */ };
}

export class ProfileRepository {
  async me(): Promise<Profile | null> {
    // Peut venir de Supabase, Dexie, cache, ou seed
    const row = await getMyProfile() as Row | null;
    return toDto(row);
  }
}
```

---

## 🔄 Flux données

### Flux 1 : Lecture (Get Profile)

```
User loads /profile
    ↓
routes/profile.tsx calls useProfile()
    ↓
useProfile() → getMyProfile() (use-case)
    ↓
getMyProfile() → profileRepository.me()
    ↓
ProfileRepository.me() → getMyProfile() (server fn)
    ↓
Server fn → Supabase auth check → DB query
    ↓
← Row { id, display_name, bio, ... }
    ↓
toDto(row) → Profile { id, displayName, bio, ... }
    ↓
← setProfile(profile) in useProfile hook
    ↓
Component re-render avec profile.displayName
```

**Cache** (Phase 5) :
- Dexie cache check AVANT Supabase
- Fallback offline : read from Dexie
- Sync in background (SWR pattern)

---

### Flux 2 : Écriture (Update Profile)

```
User clicks "Enregistrer" dans ProfileEditDialog
    ↓
handleSubmit(data) → save({ displayName, bio, city })
    ↓
save() → updateProfile(input) (use-case)
    ↓
updateProfile() → profileRepository.updateMe(input)
    ↓
ProfileRepository.toRow() converts:
  { displayName: "Sophie" } → { display_name: "Sophie" }
    ↓
updateMyProfile(serverFnPayload) (server fn)
    ↓
Server fn validates input (Zod schema)
    ↓
Supabase RLS checks (own profile? → allow)
    ↓
UPDATE profiles SET display_name = ... WHERE id = userId
    ↓
← { id, display_name, bio, city, updated_at }
    ↓
Audit log: "user updated profile" + { fields: ['display_name', 'bio', 'city'] }
    ↓
← toDto(row) → Profile
    ↓
← setProfile(profile) (optimistic update reverted or confirmed)
    ↓
Toast: "Profil enregistré ✓"
```

**Conflict resolution** (Phase 5) :
- Last-write-wins : updated_at comparison
- No merge logic
- Sync after drain completes

---

## 🛡️ Sécurité & Middleware

### Server Functions

Tous les accès données passent par Supabase server functions :

```typescript
// src/lib/identity.functions.ts
export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])           // ← Auth check
  .inputValidator((input) => updateSchema.parse(input))  // ← Zod validation
  .handler(async ({ data, context }) => {
    // context.userId = authenticated user ID
    // context.supabase = auth-scoped client
    
    const { data: row, error } = await context.supabase
      .from("profiles")
      .update(data)
      .eq("id", context.userId)               // ← Own profile only
      .select("*")
      .single();
    
    // Audit log
    await audit.log(context.userId, "update", "profile", ...);
    
    return row;
  });
```

### Middleware : requireSupabaseAuth

```typescript
// src/integrations/supabase/auth-middleware.ts
export const requireSupabaseAuth: Middleware = async (opts) => {
  const { context } = opts;
  const user = context.user;
  
  if (!user) throw new Error("Unauthorized (401)");
  
  // Inject authenticated client
  context.supabase = createServerClient(
    // with user's session
  );
  context.userId = user.id;
};
```

**Implication** : Aucun composant React ne peut accéder `client.server` directement.

---

## 🗂️ Fichiers clés

### Routing (TanStack Router)

```typescript
// src/routes/profile.tsx
export const Route = createFileRoute("/profile")({
  component: ProfilePage,  // React component
});

function ProfilePage() {
  const { profile } = useProfile();  // ← Hook domain
  
  return <div>{profile.displayName}</div>;
}
```

Routes loader-less (CSR) : data fetching via hooks + React Query.

---

### Forms & Validation

```typescript
// src/lib/identity.functions.ts
const updateSchema = z.object({
  display_name: z.string().min(1).max(80).nullish(),
  bio: z.string().max(2000).nullish(),
  city: z.string().max(120).nullish(),
}).strict();

// src/domains/identity/components/ProfileEditDialog.tsx
const profileEditSchema = z.object({
  displayName: z.string().min(1, "Required"),
  bio: z.string().max(2000).optional().nullable(),
  city: z.string().max(120).optional().nullable(),
});

const form = useForm({
  resolver: zodResolver(profileEditSchema),
  defaultValues: { displayName: profile?.displayName || "" },
});
```

**Note** : Deux schemas :
- Client schema (camelCase, strict validation)
- Server schema (snake_case, business rules)

---

### État global (React Context)

Utilisé **uniquement** pour :
- Préférences utilisateur (thème, langue)
- État auth (user, isAuthenticated)

**Pas** pour les données métier (utilise React Query + domain hooks).

```typescript
// src/domains/identity/services/PreferencesContext.tsx
const PrefsContext = createContext<PrefsCtx | null>(null);

export function usePrefs(): PrefsCtx {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error("usePrefs must be inside PrefsProvider");
  return ctx;
}
```

---

## 🔌 Intégrations externes

### Supabase

**Deux clients** :
1. `client.ts` — Client-side (navigateur)
   - Auth avec Lovable Cloud Auth
   - Reads avec RLS
   - Pas de mutations directes
   
2. `client.server.ts` — Server-only
   - Admin queries si besoin
   - Injected dans server functions via middleware
   - Never exposed au client

### Dexie (IndexedDB)

```typescript
// src/lib/dexie.ts
export const db = new Dexie("axiom-forge-db");

db.version(1).stores({
  profiles: "id",           // Table avec index sur id
  conversations: "id",
  messages: "id, conversationId",
});

export interface ProfileTable {
  id: string;
  displayName: string | null;
  bio: string | null;
  syncedAt: number;
}
```

**Stratégie** (Phase 5) :
- Cache local après chaque fetch Supabase
- TTL configurable (5 min par défaut)
- Background sync avec Supabase Realtime
- Fallback offline

---

## 📊 État & React Query

### Query strategy

Utilise **React Query** pour server state :

```typescript
// src/lib/queries.ts (à créer Phase 5)
export function createProfileQueries() {
  return {
    // Query key
    keys: {
      all: ["profile"] as const,
      detail: (id: string) => [...keys.all, "detail", id] as const,
    },
    
    // Queries
    useMyProfile: () =>
      useQuery({
        queryKey: keys.all,
        queryFn: () => getMyProfile(),
        staleTime: 5 * 60 * 1000,  // 5 minutes
      }),
    
    // Mutations
    useUpdateProfile: () =>
      useMutation({
        mutationFn: (input) => updateProfile(input),
        onSuccess: (data) => {
          queryClient.setQueryData(keys.all, data);
        },
      }),
  };
}
```

Avantages :
- Caching automatique
- Refetch on focus/reconnect
- Deduplication
- Error handling centralisé

---

## 🎬 Patterns courants

### 1. Ajouter un champ au profil

```
1. src/domains/identity/entities/Profile.ts
   → Ajouter city?: string | null

2. src/lib/identity.functions.ts
   → Ajouter city: z.string().max(120).nullish() au schema

3. src/domains/identity/repositories/ProfileRepository.ts
   → Ajouter city mapping (toDto + toRow)

4. src/domains/identity/components/ProfileEditDialog.tsx
   → Ajouter <FormField name="city" />

5. Supabase migration (Phase 5)
   → ALTER TABLE profiles ADD COLUMN city VARCHAR(120);
```

### 2. Créer un nouveau domaine

```
1. mkdir -p src/domains/[domain]/
   mkdir -p {entities,repositories,hooks,components,use-cases}

2. Create: entities/[Entity].ts
   → export interface [Entity] { ... }

3. Create: repositories/[Entity]Repository.ts
   → class [Entity]Repository { async me(): ... }

4. Create: use-cases/Get[Entity].ts
   → export async function get[Entity](): ...

5. Create: hooks/use[Entity].ts
   → export function use[Entity](): ...

6. Create: index.ts (barrel export)

7. Create: README.md with responsibility + API
```

### 3. Ajouter une validation

```
// Côté serveur
const mySchema = z.object({
  field: z.string().min(1).max(100),
});

// Dans server function :
.inputValidator((input) => mySchema.parse(input))

// Côté client (optionnel)
const myClientSchema = z.object({
  field: z.string().min(1, "Required").max(100),
});
```

---

## 🔄 Gestion d'erreurs

**À implémenter (Phase 3)** :

```typescript
// src/packages/core/errors.ts
export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500,
    public context?: Record<string, unknown>
  ) {
    super(message);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public errors: Record<string, string[]>) {
    super("VALIDATION_ERROR", message, 400, { errors });
  }
}

// Middleware global
export const errorHandler = (error: unknown) => {
  if (error instanceof AppError) {
    return { code: error.code, message: error.message, statusCode: error.statusCode };
  }
  return { code: "INTERNAL_ERROR", message: "Something went wrong", statusCode: 500 };
};
```

---

## 🧪 Testing strategy (Phase 6)

### Unit tests
- Entities (DTOs) : minimal
- Repositories : mock Supabase
- Use-cases : mock repositories
- Validation : Zod schemas

### Component tests
- ProfileEditDialog : mock useProfile
- Forms : test validation + submission
- Hooks : test loading/error states

### E2E tests
- Auth flow
- Profile view + edit
- Navigation

---

## 📚 Références

- [Domain-Driven Design - Eric Evans](https://www.domainlanguage.com/ddd/)
- [TanStack Router Docs](https://tanstack.com/router/latest)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [React Query Patterns](https://tkdodo.eu/blog/react-query-as-a-state-manager)

---

**Mise à jour** : 2026-08-22  
**Mainteneur** : [@paulondoa20-coder](https://github.com/paulondoa20-coder)
