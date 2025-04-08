/**
 * Converts a string, number, or boolean to a boolean value.
 *
 * @param {string|number|boolean} value - The value to convert.
 * @returns {boolean} The boolean representation of the input value.
 * @throws {Error} Throws an error if the value cannot be converted to a boolean.
 */
export function toBool(value) {
  if (typeof value === "boolean") return value;

  if (typeof value === "string") {
    const str = value.trim().toLowerCase();
    if (str === "true" || str === "1") return true;
    if (str === "false" || str === "0") return false;
  }

  if (typeof value === "number") {
    if (value === 1) return true;
    if (value === 0) return false;
  }

  throw new Error(`Cannot convert value of type "${typeof value}" to boolean.`);
}
