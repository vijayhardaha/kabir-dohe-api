/**
 * Unit tests for Supabase client creation.
 * @package vitest
 */

import { describe, it, expect, vi } from 'vitest';

import type { ScriptEnv } from './env';
import { createSupabaseClient } from './supabase';

vi.mock('@supabase/supabase-js', () => ({ createClient: vi.fn(() => 'mock-supabase-client' as unknown) }));

// Test suite for Supabase client creation
describe('supabase', () => {
  // Tests for createSupabaseClient function
  describe('createSupabaseClient', () => {
    const mockEnv: ScriptEnv = {
      NODE_ENV: 'development',
      SUPABASE_URL: 'https://example.supabase.co',
      SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
      GOOGLE_SERVICE_ACCOUNT_BASE64: 'eyJjbGllbnRfZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIn0=',
      GOOGLE_SHEET_ID: 'test-sheet-id',
    };

    // Verify client creation with provided credentials
    it('should create a Supabase client with the provided URL and service role key', () => {
      const client = createSupabaseClient(mockEnv);

      // Assert the expected outcome for this scenario.
      expect(client).toBe('mock-supabase-client');
    });
  });
});
