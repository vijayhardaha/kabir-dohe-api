/**
 * Unit tests for classnames utility function.
 * @package vitest
 */

import { describe, it, expect } from 'vitest';

import { cn } from './classnames';

// Group classnames assertions to catch regressions in CSS class composition.
describe('classnames', () => {
  // Group related test behavior in this suite.
  describe('cn', () => {
    // Define a focused test case for one behavior.
    it('should handle single string class', () => {
      // Assert the expected outcome for this scenario.
      expect(cn('px-4')).toBe('px-4');
    });

    // Define a focused test case for one behavior.
    it('should handle multiple string classes', () => {
      // Assert the expected outcome for this scenario.
      expect(cn('px-4', 'py-2', 'bg-red-500')).toBe('px-4 py-2 bg-red-500');
    });

    // Define a focused test case for one behavior.
    it('should ignore undefined values', () => {
      // Assert the expected outcome for this scenario.
      expect(cn('px-4', undefined, 'py-2')).toBe('px-4 py-2');
    });

    // Define a focused test case for one behavior.
    it('should ignore boolean false values', () => {
      // Assert the expected outcome for this scenario.
      expect(cn('px-4', false, 'py-2')).toBe('px-4 py-2');
    });

    // Define a focused test case for one behavior.
    it('should include class when condition is true', () => {
      const isActive = true;
      // Assert the expected outcome for this scenario.
      expect(cn('px-4', isActive && 'active', 'py-2')).toBe('px-4 active py-2');
    });

    // Define a focused test case for one behavior.
    it('should handle object with boolean values', () => {
      const isActive = true;
      const isDisabled = false;
      // Assert the expected outcome for this scenario.
      expect(cn('px-4', { active: isActive, disabled: isDisabled })).toBe('px-4 active');
    });

    // Define a focused test case for one behavior.
    it('should handle array of strings', () => {
      // Assert the expected outcome for this scenario.
      expect(cn(['px-4', 'py-2'], 'bg-red-500')).toBe('px-4 py-2 bg-red-500');
    });

    // Define a focused test case for one behavior.
    it('should handle mixed inputs', () => {
      const isActive = true;
      const isDisabled = false;
      // Assert the expected outcome for this scenario.
      expect(cn('px-4', ['py-2', 'bg-red-500'], { active: isActive, disabled: isDisabled })).toBe(
        'px-4 py-2 bg-red-500 active'
      );
    });

    // Define a focused test case for one behavior.
    it('should merge duplicate tailwind classes correctly', () => {
      // Assert the expected outcome for this scenario.
      expect(cn('px-4 py-2', 'py-2')).toBe('px-4 py-2');
    });

    // Define a focused test case for one behavior.
    it('should handle empty string', () => {
      // Assert the expected outcome for this scenario.
      expect(cn('')).toBe('');
    });

    // Define a focused test case for one behavior.
    it('should ignore null values', () => {
      // Assert the expected outcome for this scenario.
      expect(cn('px-4', null as unknown as string, 'py-2')).toBe('px-4 py-2');
    });
  });
});
