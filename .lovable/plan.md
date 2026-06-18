## Import du repo `axiom-scape` → projet Lovable actuel

Le repo a été cloné et inspecté. Bonne nouvelle : **même stack** (TanStack Start v1, React 19, Tailwind v4, shadcn/ui, bun) — aucune adaptation de code nécessaire. Toutes les dépendances runtime sont déjà installées dans le projet actuel.

### Ce qui sera importé (95 fichiers sous `src/`)

Structure conservée à l'identique :

```text
src/
├── components/
│   ├── ai/           AIAssistant
│   ├── ds/           Design system (Button, Card, Input, Select, Textarea, Typography)
│   ├── home/         HubGrid, LiveStrip, Opportunities, RecentActivity, SmartFeed,
│   │                 SmartHero, SmartSuggestions, TrustHint
│   ├── hub/          HubHeader
│   ├── layout/       AppShell, CategoriesSheet, FloatingDock, TopBar
│   ├── onboarding/   Onboarding
│   ├── preferences/  PrefsProvider
│   ├── scan/         ScanReady, ScanWaves
│   ├── ui/           shadcn (45 composants)
│   └── ui-kit/       SmartCard, TrustBadge
├── hooks/            use-mobile
├── lib/              error-capture, error-page, messaging, notifications, preferences, utils
├── routes/
│   ├── __root.tsx
│   ├── index.tsx     (remplace le placeholder actuel)
│   ├── flash.tsx, messages.tsx, notifications.tsx, profile.tsx,
│   ├── radar.tsx, scan.tsx, trust.tsx
│   └── api/assistant.ts
├── router.tsx, server.ts, start.ts, styles.css
```

### Étapes d'exécution

1. **Sauvegarder** le `src/routes/__root.tsx`, `src/router.tsx`, `src/server.ts`, `src/start.ts`, `src/styles.css` actuels (au cas où on doive revenir en arrière), puis les **remplacer** par ceux du repo.
2. **Copier** récursivement tout `src/components/`, `src/hooks/`, `src/lib/` depuis le clone vers `/dev-server/src/` (les dossiers `ui/` et `hooks/` existants sont écrasés par les versions du repo — c'est intentionnel).
3. **Copier** toutes les routes (`src/routes/*.tsx` + `src/routes/api/assistant.ts`).
4. **Ne pas copier** : `routeTree.gen.ts` (régénéré auto), `package.json`, `bun.lock`, `vite.config.ts`, `tsconfig.json`, `wrangler.jsonc`, `components.json`, `eslint.config.js`, `.lovable/`, `.git/` — la config du projet courant reste autoritaire.
5. **Dépendances** : aucune installation nécessaire — toutes les libs utilisées par axiom-scape sont déjà dans le `package.json` actuel. Les 2 packages absents (`@cloudflare/vite-plugin`, `nitro`) ne sont pas importés par le code source (config build legacy).
6. **Vérification** : laisser le build TanStack régénérer `routeTree.gen.ts`, puis ouvrir le preview pour valider que `/`, `/flash`, `/radar`, `/scan`, `/trust`, `/messages`, `/notifications`, `/profile` rendent correctement.

### Points d'attention techniques

- La route `src/routes/api/assistant.ts` sera examinée : si elle utilise des secrets (clé API LLM), il faudra les ajouter via le gestionnaire de secrets avant qu'elle fonctionne en runtime.
- `styles.css` du repo définit des tokens custom (`--color-flash`, `--color-radar`, `--color-scan`, `--color-trust`, surfaces, glass) — le fichier est remplacé en entier pour préserver la cohérence du design system.
- Aucune migration DB / Lovable Cloud requise (le repo n'utilise pas Supabase d'après l'inventaire).

### Hors scope

- Réorganisation des dossiers (vous avez choisi de garder la structure d'origine).
- Modification du design ou des features.
- Connexion à un backend / activation de Cloud (à demander séparément si besoin).
