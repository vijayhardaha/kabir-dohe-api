/**
 * Unit tests for SEO utilities, verifying URL sanitization and base URL generation.
 * @package vitest
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { safeCanonical, getBaseUrl } from './seo';

// Group SEO utility assertions to catch regressions in URL handling logic.
describe('safeCanonical', () => {
  // Group related test behavior in this suite.
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

// Group base URL generation assertions in a dedicated suite.
describe('getBaseUrl', () => {
  // Preserve and restore environment variables around tests.
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Preserve the original environment variables before each test.
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    // Restore the original environment variables after each test.
    process.env = originalEnv;
  });

  // Define a focused test case for one behavior.
  it('should return localhost when no env vars set', () => {
    const url = getBaseUrl();
    // Assert the expected outcome for this scenario.
    expect(url).toMatch(/^https?:\/\/localhost/);
  });

  // Define a focused test case for one behavior.
  it('should add https:// prefix to URL without scheme', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'example.com';
    const url = getBaseUrl();
    // Assert the expected outcome for this scenario.
    expect(url).toBe('https://example.com');
  });

  // Define a focused test case for one behavior.
  it('should keep http:// scheme when already present', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'http://example.com';
    const url = getBaseUrl();
    // Assert the expected outcome for this scenario.
    expect(url).toBe('http://example.com');
  });

  // Define a focused test case for one behavior.
  it('should keep https:// scheme when already present', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com';
    const url = getBaseUrl();
    // Assert the expected outcome for this scenario.
    expect(url).toBe('https://example.com');
  });

  // Define a focused test case for one behavior.
  it('should remove trailing slash from URL', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'example.com/';
    const url = getBaseUrl();
    // Assert the expected outcome for this scenario.
    expect(url).toBe('https://example.com');
  });

  // Define a focused test case for one behavior.
  it('should trim whitespace from URL', () => {
    process.env.NEXT_PUBLIC_SITE_URL = '  example.com  ';
    const url = getBaseUrl();
    // Assert the expected outcome for this scenario.
    expect(url).toBe('https://example.com');
  });
});
