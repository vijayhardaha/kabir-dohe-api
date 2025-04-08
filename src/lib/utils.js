import crypto from "crypto";
import latinize from "latinize";
import slugify from "slugify";

/**
 * Converts a string value to boolean.
 * @param {any} value - The value to convert.
 * @returns {boolean} - The boolean representation of the value.
 */
export const toBool = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const lowerValue = value.toLowerCase();
    return lowerValue === "true" || lowerValue === "1" || lowerValue === "yes";
  }
  return Boolean(value);
};

/**
 * Pads the index with leading zeros to ensure a 3-digit string.
 * @param {number} index - The index to pad.
 * @returns {string} - The padded index as a string.
 */
export const padIndex = (index) => index.toString().padStart(3, "0");

/**
 * Generates a 6-character hash from the given text.
 * @param {string} text - The text to hash.
 * @returns {string} - The 6-character hash.
 */
export const generateShortHash = (text) => crypto.createHash("sha256").update(text).digest("hex").substring(0, 6);

/**
 * Collapses multiple spaces into a single space and trims whitespace.
 * @param {string} str - The input string to clean.
 * @returns {string} - The cleaned string.
 */
export const cleanString = (str) => str.replace(/[^\S\r\n]+/g, " ").trim();

/**
 * Creates a URL-friendly slug from the given text.
 * @param {string} text - The text to slugify.
 * @returns {string} - The slugified text.
 */
export const createSlug = (text) => {
  const latinized = latinize(text);
  return slugify(latinized, {
    replacement: "-",
    remove: /[*+~.()'"!:@]/g,
    lower: true,
    strict: true,
    locale: "en",
    trim: true,
  });
};

/**
 * Parses a comma-separated string into an array and ensures uniqueness.
 * @param {string} listStr - The comma-separated string.
 * @returns {string[]} - An array of unique, trimmed strings.
 */
export const parseAndUniqueList = (listStr) => {
  if (!listStr) return [];

  const items = listStr
    .split(",")
    .map((str) => str.trim())
    .filter((str) => str.length > 0);

  return [...new Set(items)];
};

/**
 * Maps CSV data to JSON format.
 * @param {Array<Array<string>>} data - The CSV data as an array of arrays.
 * @param {Array<string>} headers - The CSV headers.
 * @returns {Array<Object>} - An array of objects representing the CSV data.
 */
export const mapCsvDataToJson = (data, headers) => {
  return data.map((row) => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  });
};
