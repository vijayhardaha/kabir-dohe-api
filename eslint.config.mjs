import path from "node:path";
import { fileURLToPath } from "node:url";

import { fixupPluginRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import importPlugin from "eslint-plugin-import";
import jsxA11Y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import globals from "globals";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  globalIgnores([
    "**/node_modules/",
    "**/build/",
    "**/dist/",
    "**/coverage/",
    "**/.env",
    "**/.env.local",
    "**/*.log",
    "**/bower_components/",
    "**/*.tsbuildinfo",
    "test/**/*.js",
    "spec/**/*.js",
    "**/*.generated.js",
  ]),
  {
    extends: compat.extends(
      "next",
      "next/core-web-vitals",
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:jsx-a11y/recommended",
      "plugin:prettier/recommended",
      "plugin:@typescript-eslint/recommended"
    ),

    plugins: {
      react,
      "jsx-a11y": jsxA11Y,
      importPlugin: fixupPluginRules(importPlugin),
      prettier,
      typescript: tseslint.plugin,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      parser: tseslint.parser,
      ecmaVersion: "latest",
      sourceType: "module",

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: "./tsconfig.json",
      },
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      "react/react-in-jsx-scope": "off",
      "prettier/prettier": "error",

      "react/no-unknown-property": [
        "error",
        {
          ignore: ["jsx", "global"],
        },
      ],

      "importPlugin/order": [
        "error",
        {
          groups: ["builtin", "external", "internal"],

          pathGroups: [
            {
              pattern: "react",
              group: "external",
              position: "before",
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
    },
  },
]);
