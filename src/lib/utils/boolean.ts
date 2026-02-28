/**
 * Converts a string value to boolean.
 *
 * @param {any} value - The value to convert.
 * @returns {boolean} - The boolean representation of the value.
 */
export const toBool = (value: unknown): boolean => {
	if (typeof value === "boolean") return value;

	if (typeof value === "string") {
		const lowerValue = value.toLowerCase();
		return lowerValue === "true" || lowerValue === "1" || lowerValue === "yes";
	}

	return Boolean(value);
};
