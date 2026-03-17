/**
 * ======================================================================
 * Vitest Configuration
 * ======================================================================
 * Purpose: Defines test execution, coverage, and alias resolution for the
 * project test suite.
 * Docs: https://vitest.dev/config/
 * ======================================================================
 */

import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  // ---- Plugins ----
  // Enable React transformation support for component tests.
  plugins: [react()],

  // ---- Test Runtime ----
  test: {
    // Use a browser-like DOM environment for React component rendering.
    environment: 'jsdom',

    // Expose describe/it/expect globally without explicit imports.
    globals: true,

    // Register shared test setup logic before each test file runs.
    setupFiles: ['./vitest.setup.ts'],

    // Limit discovery to test and spec files written in TS/TSX.
    include: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],

    // ---- Coverage ----
    coverage: {
      // Use V8 native instrumentation for fast coverage collection.
      provider: 'v8',

      // Generate terminal, machine-readable, and browsable reports.
      reporter: ['text', 'json', 'html'],

      // Write generated coverage artifacts into the project coverage folder.
      reportsDirectory: './coverage',

      // Exclude setup, generated, build, and non-target files from coverage.
      exclude: [
        'node_modules/',
        'vitest.config.ts',
        'vitest.setup.ts',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.spec.ts',
        '**/*.spec.tsx',
        '**/dist/',
        '**/build/',
        '**/.next/',
        'src/lib/server/utils/errors/**',
        'src/lib/server/utils/index.ts',
      ],
    },
  },

  // ---- Module Resolution ----
  // Resolve @ alias to the src directory for absolute-style imports.
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
});
