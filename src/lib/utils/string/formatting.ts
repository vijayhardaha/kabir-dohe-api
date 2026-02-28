/**
 * Collapses redundant inline whitespace while preserving line breaks in multiline text values.
 *
 * @param {string} string - Raw text input containing inconsistent spacing.
 * @returns {string} Text with normalized spacing and trimmed boundaries.
 * @example
 * normalizeWhitespace("  Kabir    Doha  "); // "Kabir Doha"
 */
export function normalizeWhitespace(string: string): string {
	return string.replace(/[^\S\r\n]+/g, " ").trim();
}

/**
 * Parses an input value into an integer and safely defaults to zero.
 *
 * @param {string | number} string - Numeric-like string or number to parse.
 * @returns {number} Parsed integer value, or zero when parsing fails.
 * @example
 * stringToNumber("42"); // 42
 * @example
 * stringToNumber("abc"); // 0
 */
export function stringToNumber(string: string | number): number {
	// Use base-10 parsing to avoid octal-like interpretation edge cases.
	const num = parseInt(string.toString(), 10);
	return isNaN(num) ? 0 : num;
}

/**
 * Converts text into sentence-like casing by capitalizing each normalized word segment.
 *
 * @param {string} string - Input text that may contain mixed casing and spacing.
 * @returns {string} Text converted to title-style sentence casing.
 * @example
 * toSentenceCase("HELLO WORLD"); // "Hello World"
 * @example
 * toSentenceCase("the quick brown fox"); // "The Quick Brown Fox"
 */
export function toSentenceCase(string: string): string {
	// Normalize first so output remains deterministic across inconsistent user input.
	return string
		.toLowerCase()
		.split(" ")
		.filter(Boolean)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}
