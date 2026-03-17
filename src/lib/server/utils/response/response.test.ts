/**
 * Unit tests for response helpers, verifying status codes and payload shapes for API outputs.
 * @package vitest
 */

import { describe, it, expect } from 'vitest';

import { success, failure } from '@/lib/server/utils/response/response';

// Keep success and failure branches isolated to verify shared response contract consistency.
describe('response utilities', () => {
  // Group related test behavior in this suite.
  describe('success', () => {
    // Define a focused test case for one behavior.
    it('should return NextResponse with 200 status', () => {
      const response = success({ message: 'test' });

      // Assert the expected outcome for this scenario.
      expect(response.status).toBe(200);
    });

    // Define a focused test case for one behavior.
    it('should include success: true in body', async () => {
      const response = success({ id: 1 });
      const body = await response.json();

      // Assert the expected outcome for this scenario.
      expect(body.success).toBe(true);
    });

    // Define a focused test case for one behavior.
    it('should include data in body', async () => {
      const testData = { id: 1, name: 'test' };
      const response = success(testData);
      const body = await response.json();

      // Assert the expected outcome for this scenario.
      expect(body.data).toEqual(testData);
    });
  });

  // Group related test behavior in this suite.
  describe('failure', () => {
    // Define a focused test case for one behavior.
    it('should return NextResponse with custom status', () => {
      const response = failure('Not found', 404);

      // Assert the expected outcome for this scenario.
      expect(response.status).toBe(404);
    });

    // Define a focused test case for one behavior.
    it('should return 500 by default', () => {
      const response = failure('Server error');

      // Assert the expected outcome for this scenario.
      expect(response.status).toBe(500);
    });

    // Define a focused test case for one behavior.
    it('should include error message in body', async () => {
      const response = failure('Validation failed');
      const body = await response.json();

      // Assert the expected outcome for this scenario.
      expect(body.error).toBe('Validation failed');
    });

    // Define a focused test case for one behavior.
    it('should include status code in body', async () => {
      const response = failure('Unauthorized', 401);
      const body = await response.json();

      // Assert the expected outcome for this scenario.
      expect(body.code).toBe(401);
    });
  });
});
