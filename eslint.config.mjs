/**
 * ###############################################################################
 * ______  _____ _      _____ _   _ _______
 * |  ____|/ ____| |    |_   _| \ | |__   __|
 * | |__  | (___ | |      | | |  \| |  | |
 * |  __|  \___ \| |      | | | . ` |  | |
 * | |____ ____) | |____ _| |_| |\  |  | |
 * |______|_____/|______|_____|_| \_|  |_|
 * * THE CODE GUARDIAN (Flat Config)
 * ###############################################################################
 * * PURPOSE:
 * Static analysis for Next.js, TypeScript, and React. It catches bugs,
 * enforces accessibility (a11y), and keeps imports tidy.
 * * WORKFLOW:
 * - Check: `npx eslint .`
 * - Fix:   `npx eslint . --fix`
 * * ###############################################################################
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";

// --- Context Setup ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
});

export default defineConfig([
	// ==========================================
	// 🚫 GLOBAL IGNORES
	// ==========================================
	// Files that should never be touched by the linter
	globalIgnores([
		"**/.next/",
		"**/node_modules/",
		"**/build/",
		"**/dist/",
		"**/.env*",
		"**/*.log",
		"**/*.tsbuildinfo",
		"**/public/",
	]),

	// ==========================================
	// 🏗️ BASE EXTENSIONS & PLUGINS
	// ==========================================
	...compat.extends(
		"next",
		"next/core-web-vitals",
		"next/typescript",
		"plugin:react/recommended",
		"plugin:jsx-a11y/recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:prettier/recommended" // Must be last to override formatting rules
	),

	{
		// ==========================================
		// 📂 TARGET FILES
		// ==========================================
		files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],

		// ==========================================
		// ⚙️ LANGUAGE & PARSER OPTIONS
		// ==========================================
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			globals: {
				...globals.browser,
				...globals.node,
			},
			parser: tsParser,
			parserOptions: {
				ecmaFeatures: { jsx: true },
				tsconfigRootDir: __dirname,
			},
		},

		// ==========================================
		// 🛠️ SHARED SETTINGS
		// ==========================================
		settings: {
			react: { version: "detect" },
		},

		// ==========================================
		// 📏 CUSTOM RULES
		// ==========================================
		rules: {
			// --- React Specific ---
			"react/react-in-jsx-scope": "off", // Not needed in Next.js
			"react/no-unknown-property": ["error", { ignore: ["jsx", "global"] }],

			// --- Prettier Integration ---
			"prettier/prettier": "warn",

			// --- Import Organization ---
			"import/order": [
				"error",
				{
					groups: ["builtin", "external", "internal", ["parent", "sibling"], "index", "object"],
					pathGroups: [
						{ pattern: "react", group: "external", position: "before" },
						{ pattern: "@/**", group: "internal", position: "after" },
					],
					pathGroupsExcludedImportTypes: ["react"],
					alphabetize: { order: "asc", caseInsensitive: true },
					"newlines-between": "always",
					warnOnUnassignedImports: true,
				},
			],

			// --- TypeScript Quality Control ---
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					vars: "all",
					args: "after-used",
					varsIgnorePattern: "^_",
					argsIgnorePattern: "^_",
					ignoreRestSiblings: true,
					caughtErrors: "all",
				},
			],
		},
	},
]);
