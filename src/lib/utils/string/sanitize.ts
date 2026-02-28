import latinize from "latinize";
import slugify from "slugify";

/**
 * Converts arbitrary text into a normalized slug using configurable word separators.
 *
 * @param {string} string - Source text that may include accents and symbols.
 * @param {string} [separator="-"] - Replacement character inserted between slug segments.
 * @returns {string} Lowercase slug stripped to URL-safe characters.
 * @example
 * sanitize("Hello World!"); // "hello-world"
 * @example
 * sanitize("Hello World!", "_"); // "hello_world"
 */
export function sanitize(string: string, separator: string = "-"): string {
	// Transliterate before slugging so accented characters produce stable ASCII output.
	return slugify(latinize(string), {
		lower: true,
		replacement: separator,
		strict: true,
		trim: true,
	});
}

/**
 * Converts free-form text into a predictable snake_case key for object usage.
 *
 * @param {string} string - Human-readable key text requiring normalization.
 * @returns {string} Sanitized identifier using underscores between normalized words.
 * @example
 * sanitizeKey("Hello World"); // "hello_world"
 * @example
 * sanitizeKey("is-valid"); // "is_valid"
 */
export function sanitizeKey(string: string): string {
	return sanitize(string, "_");
}

/**
 * Converts title-like text into a URL-friendly kebab-case slug representation.
 *
 * @param {string} string - Title text that will become part of route paths.
 * @returns {string} Sanitized kebab-case slug for URL and identifier usage.
 * @example
 * sanitizeTitle("My Blog Post"); // "my-blog-post"
 * @example
 * sanitizeTitle("  Spaces  "); // "spaces"
 */
export function sanitizeTitle(string: string): string {
	return sanitize(string, "-");
}
