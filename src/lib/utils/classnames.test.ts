/**
 * Unit tests for classnames utility function.
 * @package vitest
 */

import { describe, it, expect } from 'vitest';

import { cn } from './classnames';

describe('classnames', () => {
  describe('cn', () => {
    // Verify basic string input
    it('should handle single string class', () => {
      expect(cn('px-4')).toBe('px-4');
    });

    // Verify multiple string classes
    it('should handle multiple string classes', () => {
      expect(cn('px-4', 'py-2', 'bg-red-500')).toBe('px-4 py-2 bg-red-500');
    });

    // Verify handling of undefined
    it('should ignore undefined values', () => {
      expect(cn('px-4', undefined, 'py-2')).toBe('px-4 py-2');
    });

    // Verify handling of boolean false
    it('should ignore boolean false values', () => {
      expect(cn('px-4', false, 'py-2')).toBe('px-4 py-2');
    });

    // Verify handling of boolean true
    it('should include class when condition is true', () => {
      const isActive = true;
      expect(cn('px-4', isActive && 'active', 'py-2')).toBe('px-4 active py-2');
    });

    // Verify object syntax for conditional classes
    it('should handle object with boolean values', () => {
      const isActive = true;
      const isDisabled = false;
      expect(cn('px-4', { active: isActive, disabled: isDisabled })).toBe('px-4 active');
    });

    // Verify array input
    it('should handle array of strings', () => {
      expect(cn(['px-4', 'py-2'], 'bg-red-500')).toBe('px-4 py-2 bg-red-500');
    });

    // Verify mixed inputs
    it('should handle mixed inputs', () => {
      const isActive = true;
      const isDisabled = false;
      expect(cn('px-4', ['py-2', 'bg-red-500'], { active: isActive, disabled: isDisabled })).toBe(
        'px-4 py-2 bg-red-500 active'
      );
    });

    // Verify tailwind-merge functionality (same class later wins)
    it('should merge duplicate tailwind classes correctly', () => {
      expect(cn('px-4 py-2', 'py-2')).toBe('px-4 py-2');
    });

    // Verify empty string handling
    it('should handle empty string', () => {
      expect(cn('')).toBe('');
    });

    // Verify handling of null (if passed)
    it('should ignore null values', () => {
      expect(cn('px-4', null as unknown as string, 'py-2')).toBe('px-4 py-2');
    });
  });
});
