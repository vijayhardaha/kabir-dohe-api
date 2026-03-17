import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names into a single string, merging Tailwind CSS classes
 * to avoid conflicts and redundancies.
 *
 * @param {(string | string[] | boolean | undefined | { [key: string]: boolean })[]} inputs - A list of class name inputs, which can include strings,
 * arrays, or objects. These inputs are processed by `clsx` to handle conditional
 * class names and then merged by `twMerge` to resolve Tailwind CSS conflicts.
 * @returns {string} - A single string of combined and merged class names.
 *
 * @example
 * cn('px-4', { 'hidden': isHidden }, ['text-gray-500', 'md:text-black'])
 */
export function cn(...inputs: (string | string[] | boolean | undefined | { [key: string]: boolean })[]): string {
  return twMerge(clsx(inputs));
}
