/**
 * Converts a string to sentence case (first letter uppercase, rest lowercase).
 *
 * @param str - The string to convert to sentence case.
 * @returns The string in sentence case format.
 * @example
 * toSentenceCase("HELLO WORLD"); // "Hello world"
 * @example
 * toSentenceCase("heLLo"); // "Hello"
 */
export function toSentenceCase(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
