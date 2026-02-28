import crypto from "crypto";

/**
 * Hashes a passkey using SHA-256 algorithm.
 *
 * @param {string} passkey - The plain text passkey to hash
 * @returns {string} The hashed passkey as a hexadecimal string
 * @example
 * generateHash("mySecretPass") // "e5e9fa1ba31ecd1ae84f75ca3f1ef10b7d1c2f2a2c2e5..."
 */
export function generateHash(passkey: string): string {
	return crypto.createHash("sha256").update(passkey).digest("hex");
}
