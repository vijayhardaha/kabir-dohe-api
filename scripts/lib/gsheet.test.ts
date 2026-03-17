/**
 * Unit tests for Google Sheets integration.
 * @package vitest
 */

import { describe, it, expect, vi, afterEach } from 'vitest';

vi.mock('google-auth-library', () => ({ JWT: vi.fn(() => ({})) }));

vi.mock('google-spreadsheet', () => ({
  GoogleSpreadsheet: vi
    .fn()
    .mockImplementation(() => ({
      loadInfo: vi.fn().mockResolvedValue(undefined),
      sheetsByTitle: { 'kabir-ke-dohe': { getRows: vi.fn().mockResolvedValue([]) } },
    })),
}));

vi.mock('@/lib/server/utils', () => ({ toSentenceCase: vi.fn((str: string) => str) }));

import type { ScriptEnv } from './env';
import { sheetToJson } from './gsheet';

// Test suite for Google Sheets integration
describe('gsheet', () => {
  const mockEnv: ScriptEnv = {
    NODE_ENV: 'development',
    SUPABASE_URL: 'https://example.supabase.co',
    SUPABASE_SERVICE_ROLE_KEY: 'test-service-key',
    GOOGLE_SERVICE_ACCOUNT_BASE64: Buffer.from(
      JSON.stringify({ client_email: 'test@example.com', private_key: 'test-private-key' })
    ).toString('base64'),
    GOOGLE_SHEET_ID: 'test-sheet-id',
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Verify error thrown when spreadsheet ID is not configured
  it('should throw error when spreadsheet ID is not configured', async () => {
    const envWithoutSheetId: ScriptEnv = { ...mockEnv, GOOGLE_SHEET_ID: '' };

    await expect(sheetToJson(envWithoutSheetId, 'kabir-ke-dohe')).rejects.toThrow('Spreadsheet ID not configured');
  });

  // Verify error thrown when service account is not configured
  it('should throw error when service account is not configured', async () => {
    const envWithoutServiceAccount: ScriptEnv = { ...mockEnv, GOOGLE_SERVICE_ACCOUNT_BASE64: '' };

    await expect(sheetToJson(envWithoutServiceAccount, 'kabir-ke-dohe')).rejects.toThrow(
      'Service account not configured'
    );
  });

  // Verify error thrown when service account has invalid credentials
  it('should throw error when service account has invalid credentials', async () => {
    const envWithInvalidCreds: ScriptEnv = {
      ...mockEnv,
      GOOGLE_SERVICE_ACCOUNT_BASE64: Buffer.from(JSON.stringify({})).toString('base64'),
    };

    await expect(sheetToJson(envWithInvalidCreds, 'kabir-ke-dohe')).rejects.toThrow(
      'Invalid service account credentials'
    );
  });

  // Verify error thrown when service account missing client_email
  it('should throw error when service account missing client_email', async () => {
    const envMissingEmail: ScriptEnv = {
      ...mockEnv,
      GOOGLE_SERVICE_ACCOUNT_BASE64: Buffer.from(JSON.stringify({ private_key: 'key' })).toString('base64'),
    };

    await expect(sheetToJson(envMissingEmail, 'kabir-ke-dohe')).rejects.toThrow('Invalid service account credentials');
  });

  // Verify error thrown when service account missing private_key
  it('should throw error when service account missing private_key', async () => {
    const envMissingKey: ScriptEnv = {
      ...mockEnv,
      GOOGLE_SERVICE_ACCOUNT_BASE64: Buffer.from(JSON.stringify({ client_email: 'test@test.com' })).toString('base64'),
    };

    await expect(sheetToJson(envMissingKey, 'kabir-ke-dohe')).rejects.toThrow('Invalid service account credentials');
  });
});
