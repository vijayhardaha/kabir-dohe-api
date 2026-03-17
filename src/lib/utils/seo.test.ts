/**
 * Unit tests for SEO utilities, validating canonical normalization and base URL fallback behavior.
 * @package vitest
 */

import { describe, it, expect } from 'vitest';

import { safeCanonical, getBaseUrl } from '@/lib/utils/seo';

// Validate canonical cleanup cases before checking base URL environment fallback behavior.
describe('safeCanonical', () => {
  // Define a focused test case for one behavior.
  it('should remove leading slashes', () => {
    // Assert the expected outcome for this scenario.
    expect(safeCanonical('/about')).toBe('about');
  });

  // Define a focused test case for one behavior.
  it('should remove trailing slashes', () => {
    // Assert the expected outcome for this scenario.
    expect(safeCanonical('about/')).toBe('about');
  });

  // Define a focused test case for one behavior.
  it('should handle slashes on both sides', () => {
    // Assert the expected outcome for this scenario.
    expect(safeCanonical('/about/')).toBe('about');
  });

  // Define a focused test case for one behavior.
  it('should return empty string for root', () => {
    // Assert the expected outcome for this scenario.
    expect(safeCanonical('')).toBe('');
    // Assert the expected outcome for this scenario.
    expect(safeCanonical('/')).toBe('');
  });

  // Define a focused test case for one behavior.
  it('should handle whitespace', () => {
    // Assert the expected outcome for this scenario.
    expect(safeCanonical('  about  ')).toBe('about');
  });
});

// Group related test behavior in this suite.
describe('getBaseUrl', () => {
  // Define a focused test case for one behavior.
  it('should return localhost when no env vars set', () => {
    const url = getBaseUrl();
    // Assert the expected outcome for this scenario.
    expect(url).toMatch(/^https?:\/\/localhost/);
  });
});
