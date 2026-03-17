/**
 * Unit tests for server string helpers, ensuring normalization logic stays predictable across input variants.
 * @package vitest
 */

import { describe, it, expect } from 'vitest';

import { sanitize, sanitizeKey, sanitizeTitle, toSentenceCase } from '@/lib/server/utils';

// Separate suites mirror each exported helper to keep failures tied to one transformation rule.
describe('sanitize', () => {
  // Define a focused test case for one behavior.
  it('should convert to lowercase', () => {
    // Assert the expected outcome for this scenario.
    expect(sanitize('HELLO')).toBe('hello');
  });

  // Define a focused test case for one behavior.
  it('should replace spaces with hyphens', () => {
    // Assert the expected outcome for this scenario.
    expect(sanitize('hello world')).toBe('hello-world');
  });

  // Define a focused test case for one behavior.
  it('should remove special characters', () => {
    // Assert the expected outcome for this scenario.
    expect(sanitize('hello world!')).toBe('hello-world');
  });

  // Define a focused test case for one behavior.
  it('should handle custom separator', () => {
    // Assert the expected outcome for this scenario.
    expect(sanitize('hello world', '_')).toBe('hello_world');
  });
});

// Group related test behavior in this suite.
describe('sanitizeKey', () => {
  // Define a focused test case for one behavior.
  it('should use snake_case', () => {
    // Assert the expected outcome for this scenario.
    expect(sanitizeKey('hello world')).toBe('hello_world');
  });
});

// Group related test behavior in this suite.
describe('sanitizeTitle', () => {
  // Define a focused test case for one behavior.
  it('should use kebab-case', () => {
    // Assert the expected outcome for this scenario.
    expect(sanitizeTitle('Hello World')).toBe('hello-world');
  });

  // Define a focused test case for one behavior.
  it('should handle whitespace', () => {
    // Assert the expected outcome for this scenario.
    expect(sanitizeTitle('  spaces  ')).toBe('spaces');
  });
});

// Group related test behavior in this suite.
describe('toSentenceCase', () => {
  // Define a focused test case for one behavior.
  it('should capitalize first letter', () => {
    // Assert the expected outcome for this scenario.
    expect(toSentenceCase('hello')).toBe('Hello');
  });

  // Define a focused test case for one behavior.
  it('should lowercase the rest', () => {
    // Assert the expected outcome for this scenario.
    expect(toSentenceCase('HELLO WORLD')).toBe('Hello world');
  });

  // Define a focused test case for one behavior.
  it('should handle empty string', () => {
    // Assert the expected outcome for this scenario.
    expect(toSentenceCase('')).toBe('');
  });
});
