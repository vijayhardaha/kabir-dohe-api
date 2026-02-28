/**
 * Finds and returns duplicate values from an array.
 *
 * @param {string[]} values - Array of string values to check for duplicates
 * @returns {string[]} Array of duplicate values (items that appear more than once)
 * @example
 * findDuplicates(["a", "b", "a", "c", "b"]) // ["a", "b"]
 * findDuplicates(["x", "y", "z"]) // []
 * findDuplicates([]) // []
 */
export function findDuplicates(values: string[]): string[] {
	return values.filter((item, index) => values.indexOf(item) !== index);
}
