module.exports = {
  root: true, // Marks this as the root ESLint configuration file.
  extends: [
    "eslint:recommended", // Use recommended ESLint rules.
    "plugin:import/recommended", // Ensure proper handling of import/export syntax.
    "plugin:jsx-a11y/recommended", // Enforce accessibility best practices for JSX.
    "plugin:prettier/recommended", // Integrate Prettier with ESLint for consistent formatting.
  ],
  plugins: [
    "import", // Plugin to support linting of ES6+ import/export syntax.
    "jsx-a11y", // Plugin to enforce accessibility rules in JSX.
    "prettier", // Plugin to enforce Prettier formatting rules.
  ],
  env: {
    node: true, // Enable Node.js global variables and scope.
    es2024: true, // Enable support for ECMAScript 2024 features.
  },
  parser: "@babel/eslint-parser", // Use Babel parser to support modern JavaScript syntax.
  parserOptions: {
    ecmaVersion: "latest", // Use the latest ECMAScript version.
    sourceType: "module", // Enable ES module syntax.
    requireConfigFile: false, // Do not require a Babel configuration file.
  },
  rules: {
    "prettier/prettier": "error", // Enforce Prettier formatting as ESLint errors.
    "import/order": [
      "error", // Enforce a specific order for imports.
      {
        groups: ["builtin", "external", "internal"], // Group imports by type.
        alphabetize: {
          order: "asc", // Sort imports alphabetically.
          caseInsensitive: true, // Ignore case when sorting.
        },
        "newlines-between": "always", // Require newlines between import groups.
      },
    ],
    "import/no-unresolved": "error", // Report unresolved imports.
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".mjs", ".json"], // Resolve these file extensions for imports.
      },
    },
  },
};
