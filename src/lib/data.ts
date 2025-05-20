import { ICouplet } from "@/types/couplet";
import { PaginatedResult } from "@/types/paginated-result";

import coupletData from "../data/couplets.json";

import { filterBySearch, filterByTags, filterByPopularity, sortData, paginateData } from "./filters";

/**
 * Interface for the parameters used in the getData function.
 */
interface IGetDataParams {
  s?: string;
  exactMatch?: boolean;
  searchWithin?: string;
  tags?: string;
  popular?: boolean;
  orderBy?: string;
  order?: string;
  page?: number;
  perPage?: number;
  pagination?: boolean;
}

/**
 * Loads couplets data from a JSON file.
 *
 * NOTE: On Vercel serverless functions, this cache will NOT persist between
 * different requests as each request may run on a new isolated instance.
 * For Vercel, consider bundling the JSON with your app or using Vercel's KV storage.
 *
 * @returns {Array<Object>} Array of couplets where each couplet is an object containing its data.
 */
export function loadData(): ICouplet[] {
  // @ts-ignore
  return coupletData; // Already loaded at build time
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
}: IGetDataParams = {}): PaginatedResult {
  // Load the initial dataset
  let data = loadData();

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
