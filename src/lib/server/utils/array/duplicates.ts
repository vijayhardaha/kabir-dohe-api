/**
 * Returns values that appear more than once in the provided string array.
 *
 * @param {string[]} values - Input array of string values to inspect.
 * @returns {string[]} Duplicate values preserving repeated discovery order from input.
 * @example
 * findDuplicates(["a", "b", "a", "c", "b"]); // ["a", "b"]
 * @example
 * findDuplicates(["x", "y", "z"]); // []
 */
export function findDuplicates(values: string[]): string[] {
  // Compare first-seen index to current index to identify repeated occurrences.
  return values.filter((item, index) => values.indexOf(item) !== index);
}
