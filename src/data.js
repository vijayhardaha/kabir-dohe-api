import fs from "fs";
import path from "path";

import { filterBySearch, filterByTags, filterByPopularity, sortData, paginateData } from "./filters.js";

/**
 * Loads couplets data from a JSON file.
 *
 * Reads the JSON file containing couplets data from the 'data' directory,
 * parses the JSON content, and returns the array of couplets.
 *
 * @returns {Array<Object>} Array of couplets where each couplet is an object containing its data.
 * @throws {Error} Throws an error if the file cannot be read or parsed.
 */
function loadData() {
  // Construct the path to the 'couplets.json' file in the 'data' directory
  const filePath = path.join(process.cwd(), "data/couplets.json");

  try {
    // Read the file content as a string
    const jsonData = fs.readFileSync(filePath, "utf-8");

    // Parse the JSON string into an array of objects
    return JSON.parse(jsonData);
  } catch (error) {
    // Throw an error if file reading or JSON parsing fails
    throw new Error(`Failed to load data from '${filePath}': ${error.message}`);
  }
}

/**
 * Fetches and processes data based on provided filtering, sorting, and pagination options.
 *
 * @param {Object} options - The filtering and pagination options.
 * @param {string} [options.s=""] - Search term for filtering data.
 * @param {boolean} [options.exactMatch=false] - Whether to perform an exact match search.
 * @param {string} [options.searchWithin="all"] - Fields to search within ("all", "couplet", "translation", "explanation").
 * @param {string} [options.tags=""] - Comma-separated list of tags to filter data.
 * @param {boolean} [options.popular=false] - Whether to filter by popularity.
 * @param {string} [options.orderBy="id"] - Field by which to sort the data.
 * @param {string} [options.order="ASC"] - Sort order ("ASC" for ascending, "DESC" for descending).
 * @param {number} [options.page=1] - Page number for pagination.
 * @param {number} [options.perPage=10] - Number of items per page.
 * @param {boolean} [options.pagination=true] - Whether to apply pagination.
 * @returns {Object} - Object containing filtered and paginated couplets.
 */
export function getData({
  s = "",
  exactMatch = false,
  searchWithin = "all",
  tags = "",
  popular = false,
  orderBy = "id",
  order = "ASC",
  page = 1,
  perPage = 10,
  pagination = true,
}) {
  let data = loadData(); // Load the initial dataset

  // Apply sorting
  data = sortData(data, orderBy, order);

  // Apply search filtering
  data = filterBySearch(data, s, exactMatch, searchWithin);

  // Apply tag filtering
  data = filterByTags(data, tags);

  // Apply popularity filtering
  data = filterByPopularity(data, popular);

  // Apply pagination
  return paginateData(data, page, perPage, pagination);
}
