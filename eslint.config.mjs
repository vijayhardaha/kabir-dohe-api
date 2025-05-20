import path from "node:path";
import { fileURLToPath } from "node:url";

import { fixupPluginRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import pluginNext from "@next/eslint-plugin-next";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import { defineConfig, globalIgnores } from "eslint/config";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import globals from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores([
    "**/.git/",
    "**/node_modules/",
    "**/build/",
    "**/dist/",
    "**/.env",
    "**/.env.local",
    "**/*.log",
    "**/*.tsbuildinfo",
  ]),
  { files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"] },
  {
    ...compat.extends(
      "next",
      "next/core-web-vitals",
      "next/typescript",
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:jsx-a11y/recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:prettier/recommended"
    )[0],

    plugins: {
      "@next/next": fixupPluginRules(pluginNext),
      react: fixupPluginRules(react),
      "jsx-a11y": fixupPluginRules(jsxA11y),
      "@typescript-eslint": fixupPluginRules(tsPlugin),
      import: fixupPluginRules(importPlugin),
      prettier: fixupPluginRules(prettier),
    },

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        tsconfigRootDir: __dirname,
      },
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      "react/react-in-jsx-scope": "off",
      "prettier/prettier": ["warn", {}, { usePrettierrc: true }],

      "react/no-unknown-property": [
        "error",
        {
          ignore: ["jsx", "global"],
        },
      ],

      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index", "object"],

          pathGroups: [
            {
              pattern: "react",
              group: "external",
              position: "before",
            },
            {
              pattern: "@/**",
              group: "internal",
              position: "after",
            },
          ],

          pathGroupsExcludedImportTypes: ["react"],

          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },

          "newlines-between": "always",
          warnOnUnassignedImports: true,
        },
      ],

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          vars: "all",
          varsIgnorePattern: "^_", // Keep ignoring variables starting with "_"
          args: "after-used",
          argsIgnorePattern: "^_",
          ignoreRestSiblings: true,
          caughtErrors: "all", // Ensure caught errors are also checked
        },
      ],
    },
  },
]);
