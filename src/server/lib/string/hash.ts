import crypto from 'crypto';

/**
 * Generates a deterministic SHA-256 hexadecimal hash for secure passkey comparisons.
 *
 * @param {string} passkey - Plain text secret value provided for hashing.
 * @returns {string} Lowercase hexadecimal digest suitable for storage and equality checks.
 * @example
 * generateHash("mySecretPass"); // "e5e9fa..."
 * @example
 * generateHash(""); // SHA-256 digest for empty string
 */
export function generateHash(passkey: string): string {
  return crypto.createHash('sha256').update(passkey).digest('hex');
}
