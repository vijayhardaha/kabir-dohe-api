/**
 * =====================================================================
 * Eslint Configuration (Flat)
 * =====================================================================
 * Purpose: Project-wide ESLint configuration for Next.js, TypeScript, and
 *          React. Enforces code quality, accessibility, and consistent styling.
 * Docs: https://eslint.org/docs/latest/use/configure/configuration-files-new
 * Usage: npx eslint .
 * =====================================================================
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';

// ---- Context setup ----
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname, recommendedConfig: js.configs.recommended });

export default defineConfig([
  // ---- Global ignores ----
  // Files and folders that should never be linted
  globalIgnores([
    // Version Control & IDEs
    '**/.git/',
    '**/.idea/',
    '**/.vscode/',
    '**/.husky/',

    // Dependencies
    '**/node_modules/',

    // Build Outputs & Cache
    '**/.next/',
    '**/dist/',
    '**/build/',
    '**/out/',
    '**/.vercel/',
    '**/.cache/',
    '**/.turbo/',
    '**/*.tsbuildinfo',

    // Testing & Coverage
    '**/coverage/',
    '**/test-results/',
    '**/.playwright-report/',

    // Static Assets & Configs
    '**/public/',
    '**/.env*',
    '**/next-env.d.ts',

    // Logs & System Files
    '**/*.log',
    '**/.DS_Store',
    '**/Thumbs.db',

    // Temporary/Backup Files
    '**/*.tmp',
  ]),

  // ---- Base extends & plugins ----
  // Extend Next.js, React, TypeScript, a11y and Prettier recommended configs.
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended' // Keep Prettier last to delegate formatting concerns
  ),

  {
    // ---- Target files ----
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],

    // ---- Language & parser options ----
    // Short, in-line explanations are provided for each key so developers
    // understand what changes in lint behavior to expect when altering
    // these values.
    languageOptions: {
      // Enables parsing of modern JavaScript syntax features used across
      // the codebase (optional chaining, nullish coalescing, private class
      // fields, top-level await).
      ecmaVersion: 'latest',

      // Use ECMAScript modules so the parser accepts `import`/`export` syntax
      // and ESLint treats files as module scope (affects hoisting and globals).
      sourceType: 'module',

      // Provide common runtime globals from both browser and Node.js so
      // references like `window`, `fetch`, or `process` do not raise undefined
      // errors.
      globals: { ...globals.browser, ...globals.node },

      // Use the TypeScript parser to support .ts/.tsx syntax and enable
      // @typescript-eslint based rules and type-aware linting when configured.
      parser: tsParser,

      // Enable JSX parsing and point parser at the project's tsconfig so
      // parser/semantic features (when available) resolve correctly.
      parserOptions: { ecmaFeatures: { jsx: true }, tsconfigRootDir: __dirname },
    },

    // ---- Shared settings ----
    // Let plugins automatically detect framework/runtime specifics
    settings: { react: { version: 'detect' } },

    // ---- Custom rules ----
    // Purpose: Project-specific overrides to enforce import order, TypeScript
    // hygiene, Prettier integration and React best-practices. Below each
    // rule or option includes a concise comment explaining its effect.
    rules: {
      // --- React Specific ---
      // Solves 'React' must be in scope when using JSX error in Next.js 12+
      // where React import is not required.
      'react/react-in-jsx-scope': 'off',
      'react/no-unknown-property': ['error', { ignore: ['jsx', 'global'] }],

      // --- Prettier Integration ---
      'prettier/prettier': 'warn',

      // --- Import Organization ---
      // Enforces a predictable import order and spacing between groups.
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'index', 'object'],
          // `pathGroups` lets you treat certain import patterns as their own
          // group
          pathGroups: [
            // Place `react` at the top of external imports
            { pattern: 'react', group: 'external', position: 'before' },
            // Treat `@/` alias as internal imports (keeps app imports grouped)
            { pattern: '@/**', group: 'internal', position: 'after' },
          ],
          pathGroupsExcludedImportTypes: ['react'],

          // Sort imports alphabetically within each group for predictable
          // ordering
          alphabetize: { order: 'asc', caseInsensitive: true },

          // `newlines-between: "always"` enforces a blank line between import
          // groups
          'newlines-between': 'always',

          // Warn when an import is used only for side-effects (no local
          // binding). Helps catch accidental imports like `import 'setup';`
          // that may be unintended.
          warnOnUnassignedImports: true,
        },
      ],

      // --- TypeScript Quality Control ---
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          varsIgnorePattern: '^_', // Allow intentionally-unused variables prefixed with `_`
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          caughtErrors: 'all',
        },
      ],
    },
  },
]);
