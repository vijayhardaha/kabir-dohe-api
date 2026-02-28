import latinize from "latinize";
import slugify from "slugify";

/**
 * Slugifies a string by converting it to lowercase, replacing spaces and special characters
 *
 * @param {string} string - Text to convert
 * @param {string} [separator="-"] - Character used between words
 * @returns {string} Slugified text
 * @example
 * slug("Hello World!") // "hello-world"
 * slug("Hello World!", "_") // "hello_world"
 */
export function sanitize(string: string, separator: string = "-"): string {
	return slugify(latinize(string), {
		lower: true,
		replacement: separator,
		strict: true,
		trim: true,
	});
}

/**
 * Converts a string into a valid object key using underscores as separators.
 *
 * @param {string} string - The text to convert to an object key
 * @returns {string} The sanitized key in snake_case format
 * @example
 * sanitizeKey("Hello World") // "hello_world"
 * sanitizeKey("user name") // "user_name"
 * sanitizeKey("is-valid") // "is_valid"
 */
export function sanitizeKey(string: string): string {
	return sanitize(string, "_");
}

/**
 * Converts a string into a URL-friendly title format using hyphens as separators.
 *
 * @param {string} string - The title text to convert
 * @returns {string} The sanitized title in slug format (kebab-case)
 * @example
 * sanitizeTitle("Hello World") // "hello-world"
 * sanitizeTitle("My Blog Post") // "my-blog-post"
 * sanitizeTitle("  Spaces  ") // "spaces"
 */
export function sanitizeTitle(string: string): string {
	return sanitize(string, "-");
}
