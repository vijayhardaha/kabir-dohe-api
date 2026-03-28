/**
 * ======================================================================
 * Prettier Configuration
 * ======================================================================
 * Purpose: Defines code formatting rules to ensure consistent style across the
 * repository. Use `npx prettier --write .` to apply these rules.
 * Docs: https://prettier.io/docs/configuration
 * ======================================================================
 */

import defaultConfig from '@vijayhardaha/dev-config/prettier';

const config = {
  ...defaultConfig,
  // ---- Plugins ----
  plugins: ['prettier-plugin-tailwindcss'],
};

export default config;
