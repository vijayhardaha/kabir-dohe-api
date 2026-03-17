/**
 * Unit tests for environment loading and validation.
 * @package vitest
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { loadScriptEnv, type ScriptEnv } from './env';

vi.mock('dotenv', () => ({ default: { config: vi.fn() } }));

// Test suite for environment loading functionality
describe('env', () => {
  // Tests for loadScriptEnv function
  describe('loadScriptEnv', () => {
    let originalEnv: NodeJS.ProcessEnv;

    const setNodeEnv = (value: string | undefined): void => {
      Object.defineProperty(process.env, 'NODE_ENV', { value, writable: true, configurable: true, enumerable: true });
    };

    // Store original env before each test
    beforeEach(() => {
      vi.resetModules();
      originalEnv = { ...process.env };
    });

    // Restore original env after each test
    afterEach(() => {
      process.env = originalEnv;
    });

    // Verify development mode loads from .env.local
    it('should load environment variables from .env.local in development mode', () => {
      setNodeEnv('development');
      process.env.SUPABASE_URL = 'https://example.supabase.co';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
      process.env.GOOGLE_SERVICE_ACCOUNT_BASE64 = 'eyJjbGllbnRfZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIn0=';
      process.env.GOOGLE_SHEET_ID = 'test-sheet-id';

      const env = loadScriptEnv();

      // Assert the expected outcome for this scenario.
      expect(env.NODE_ENV).toBe('development');
      // Assert the expected outcome for this scenario.
      expect(env.SUPABASE_URL).toBe('https://example.supabase.co');
      // Assert the expected outcome for this scenario.
      expect(env.SUPABASE_SERVICE_ROLE_KEY).toBe('test-service-key');
      // Assert the expected outcome for this scenario.
      expect(env.GOOGLE_SERVICE_ACCOUNT_BASE64).toBe('eyJjbGllbnRfZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIn0=');
      // Assert the expected outcome for this scenario.
      expect(env.GOOGLE_SHEET_ID).toBe('test-sheet-id');
    });

    // Test default value when NODE_ENV is not set
    it('should default NODE_ENV to development when not set', () => {
      setNodeEnv(undefined);
      process.env.SUPABASE_URL = 'https://example.supabase.co';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-key';
      process.env.GOOGLE_SERVICE_ACCOUNT_BASE64 = 'eyJjbGllbnRfZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIn0=';
      process.env.GOOGLE_SHEET_ID = 'test-sheet-id';

      const env = loadScriptEnv();

      // Assert the expected outcome for this scenario.
      expect(env.NODE_ENV).toBe('development');
    });

    // Test production mode loads from .env.production
    it('should use production .env file when NODE_ENV is production', () => {
      setNodeEnv('production');
      process.env.SUPABASE_URL = 'https://prod.supabase.co';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'prod-service-key';
      process.env.GOOGLE_SERVICE_ACCOUNT_BASE64 = 'eyJjbGllbnRfZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIn0=';
      process.env.GOOGLE_SHEET_ID = 'prod-sheet-id';

      const env = loadScriptEnv();

      // Assert the expected outcome for this scenario.
      expect(env.NODE_ENV).toBe('production');
    });

    // Test URL validation rejects invalid URLs
    it('should validate SUPABASE_URL as a valid URL', () => {
      setNodeEnv('development');
      process.env.SUPABASE_URL = 'not-a-valid-url';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';
      process.env.GOOGLE_SERVICE_ACCOUNT_BASE64 = 'eyJjbGllbnRfZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIn0=';
      process.env.GOOGLE_SHEET_ID = 'test-id';

      // Assert the expected outcome for this scenario.
      expect(() => loadScriptEnv()).toThrow();
    });

    // Test validation rejects empty service role key
    it('should require SUPABASE_SERVICE_ROLE_KEY to be non-empty', () => {
      setNodeEnv('development');
      process.env.SUPABASE_URL = 'https://example.supabase.co';
      process.env.SUPABASE_SERVICE_ROLE_KEY = '';
      process.env.GOOGLE_SERVICE_ACCOUNT_BASE64 = 'eyJjbGllbnRfZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIn0=';
      process.env.GOOGLE_SHEET_ID = 'test-id';

      // Assert the expected outcome for this scenario.
      expect(() => loadScriptEnv()).toThrow();
    });

    // Test validation rejects empty service account base64
    it('should require GOOGLE_SERVICE_ACCOUNT_BASE64 to be non-empty', () => {
      setNodeEnv('development');
      process.env.SUPABASE_URL = 'https://example.supabase.co';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';
      process.env.GOOGLE_SERVICE_ACCOUNT_BASE64 = '';
      process.env.GOOGLE_SHEET_ID = 'test-id';

      // Assert the expected outcome for this scenario.
      expect(() => loadScriptEnv()).toThrow();
    });

    // Test validation rejects empty sheet ID
    it('should require GOOGLE_SHEET_ID to be non-empty', () => {
      setNodeEnv('development');
      process.env.SUPABASE_URL = 'https://example.supabase.co';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';
      process.env.GOOGLE_SERVICE_ACCOUNT_BASE64 = 'eyJjbGllbnRfZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIn0=';
      process.env.GOOGLE_SHEET_ID = '';

      // Assert the expected outcome for this scenario.
      expect(() => loadScriptEnv()).toThrow();
    });

    // Test that returned type matches ScriptEnv interface
    it('should return correct type ScriptEnv', () => {
      setNodeEnv('development');
      process.env.SUPABASE_URL = 'https://example.supabase.co';
      process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';
      process.env.GOOGLE_SERVICE_ACCOUNT_BASE64 = 'eyJjbGllbnRfZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIn0=';
      process.env.GOOGLE_SHEET_ID = 'test-id';

      const env = loadScriptEnv();

      const expected: ScriptEnv = {
        NODE_ENV: 'development',
        SUPABASE_URL: 'https://example.supabase.co',
        SUPABASE_SERVICE_ROLE_KEY: 'test-key',
        GOOGLE_SERVICE_ACCOUNT_BASE64: 'eyJjbGllbnRfZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIn0=',
        GOOGLE_SHEET_ID: 'test-id',
      };

      // Assert the expected outcome for this scenario.
      expect(env).toEqual(expected);
    });
  });
});
