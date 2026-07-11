import js from "@eslint/js";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", ".output", ".vinxi"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "server-only",
              message:
                "TanStack Start does not use the Next.js `server-only` package. Rename the module to `*.server.ts` or mark it with `@tanstack/react-start/server-only`.",
            },
          ],
          patterns: [
            {
              group: ["@/integrations/supabase/client", "@/integrations/supabase/client.server"],
              message:
                "Architecture rule: Supabase clients ne sont accessibles que depuis src/domains/*/repositories/*.remote.ts, src/routes/api/**, ou les fichiers *.server.ts / *.functions.ts. Les composants et hooks doivent passer par un domaine (voir docs/architecture/DEPENDENCY-MATRIX.md).",
            },
            {
              group: ["@/packages/offline/*"],
              message:
                "Architecture rule: @/packages/offline est réservé aux repositories locaux (*.local.ts) et aux packages internes. Les composants doivent passer par les hooks du domaine (voir docs/architecture/DEPENDENCY-MATRIX.md).",
            },
            {
              group: ["@/domains/*/repositories/*", "@/domains/*/services/*", "@/domains/*/use-cases/*", "@/domains/*/entities/*"],
              message:
                "Architecture rule: les imports cross-domain passent uniquement par le barrel public @/domains/<name> (index.ts). Voir docs/architecture/DEPENDENCY-MATRIX.md.",
            },
          ],
        },
      ],
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  eslintPluginPrettier,
);
