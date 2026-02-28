/**
 * Normalizes whitespace in a string by collapsing multiple spaces (excluding newlines)
 * into a single space and trims leading/trailing whitespace.
 *
 * @param {string} string - The input string to normalize.
 * @returns {string} - The normalized string.
 */
export function normalizeWhitespace(string: string): string {
	return string.replace(/[^\S\r\n]+/g, " ").trim();
}

/**
 * Parses a string into an integer, returning 0 if the conversion fails.
 *
 * @param {string|number} string - The string to convert to a number
 * @returns {number} The parsed integer, or 0 if invalid
 * @example
 * stringToNumber("42") // 42
 * stringToNumber("3.14") // 3
 * stringToNumber("abc") // 0
 * stringToNumber("") // 0
 */
export function stringToNumber(string: string | number): number {
	const num = parseInt(string.toString(), 10);
	return isNaN(num) ? 0 : num;
}

/**
 * Converts a string to sentence case (first letter uppercase, rest lowercase).
 *
 * @param {string} string - The string to convert to sentence case
 * @returns {string} The string in sentence case format
 * @example
 * toSentenceCase("HELLO WORLD") // "Hello world"
 * toSentenceCase("hELLO wORLD") // "Hello world"
 * toSentenceCase("the quick brown fox") // "The quick brown fox"
 */
export function toSentenceCase(string: string): string {
	return string
		.toLowerCase()
		.split(" ")
		.filter(Boolean)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}
