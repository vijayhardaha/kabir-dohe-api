import crypto from "crypto";

import latinize from "latinize";
import slugify from "slugify";

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
 * @param {string} text - The text to be converted into a slug.
 * @param {string} [replacement="-"] - The character to replace spaces and other delimiters.
 * @returns {string} - The generated slug.
 */
export const createSlug = (text, replacement = "-") =>
  slugify(latinize(text), {
    lower: true,
    replacement,
    strict: true,
    trim: true,
  });

/**
 * Converts an array of header names to slugified keys.
 * @param {string[]} headers - The array of header names.
 * @returns {Object} - An object mapping original header names to their slugified versions.
 */
export const createSlugifiedKeys = (headers) =>
  headers.reduce((acc, header) => {
    const slugifiedHeader = createSlug(header, "_");
    acc[header] = slugifiedHeader;
    return acc;
  }, {});

/**
 * Maps CSV data to JSON format with optional slugified keys.
 * @param {Object} data - The data object containing CSV values.
 * @param {Array} data.values - An array where the first element is the header row, and the rest are data rows.
 * @returns {Array<Object>} - The mapped JSON data with slugified keys.
 * @example
 * const csvData = {
 *   values: [
 *     ["Name", "Age", "City"],
 *     ["Alice", "30", "New York"],
 *     ["Bob", "25", "San Francisco"]
 *   ]
 * };
 * const jsonData = mapCsvDataToJson(csvData);
 * // jsonData will be:
 * // [
 * //   { name: "Alice", age: "30", city: "New York" },
 * //   { name: "Bob", age: "25", city: "San Francisco" }
 * // ]
 */
export const mapCsvDataToJson = (data) => {
  const [header, ...rows] = data.values;
  const jsonData = rows.map((row) => header.reduce((obj, h, i) => ({ ...obj, [h]: row[i] }), {}));

  const columnMapping = createSlugifiedKeys(header);

  return jsonData.map((row) =>
    Object.keys(row).reduce(
      (newRow, key) => ({
        ...newRow,
        [columnMapping[key] || key]: row[key],
      }),
      {}
    )
  );
};

/**
 * Converts a string to title case.
 * @param {string} str - The string to convert.
 * @returns {string} - The title-cased string.
 */
export const toTitleCase = (str) =>
  str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

/**
 * Splits a comma-separated string into an array of title-cased, trimmed, unique, non-empty values.
 * @param {string} data - The comma-separated string to process.
 * @returns {string[]} - An array of title-cased, unique, trimmed, non-empty values.
 */
export const parseAndUniqueList = (data) =>
  data
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "")
    .map(toTitleCase)
    .filter((item, index, self) => self.indexOf(item) === index);
