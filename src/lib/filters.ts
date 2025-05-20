import { toBool } from "@/lib/utils";
import { ICouplet } from "@/types/couplet";
import { PaginatedResult } from "@/types/paginated-result";

/**
 * Filters data based on search terms and specified fields.
 * @param {Array<Object>} data - The data to be filtered.
 * @param {string} search - The search term.
 * @param {boolean} exactMatch - Whether to use exact match or partial match.
 * @param {string} searchWithin - Fields to search within (comma-separated list).
 * @returns {Array<Object>} The filtered data.
 */
export const filterBySearch = (
  data: ICouplet[],
  search: string,
  exactMatch: boolean,
  searchWithin: string
): ICouplet[] => {
  if (!search) return data;

  const searchLower = search.toLowerCase();
  const searchTerms = searchLower
    .split(" ")
    .map((st) => st.trim())
    .filter((term) => term.length > 0);

  let fieldsToSearch = [];

  // Define fields to search in
  if (searchWithin === "all" || !searchWithin) {
    fieldsToSearch = [
      "couplet_hindi",
      "couplet_english",
      "translation_hindi",
      "translation_english",
      "explanation_hindi",
      "explanation_english",
    ];
  } else {
    const searchWithinArray = searchWithin.split(",").map((field) => field.trim().toLowerCase());
    if (searchWithinArray.includes("couplet")) {
      fieldsToSearch.push("couplet_hindi", "couplet_english");
    }
    if (searchWithinArray.includes("translation")) {
      fieldsToSearch.push("translation_hindi", "translation_english");
    }
    if (searchWithinArray.includes("explanation")) {
      fieldsToSearch.push("explanation_hindi", "explanation_english");
    }
  }

  // Filter data based on the whole search string
  const exactMatchResults = data.filter((item) =>
    fieldsToSearch.some((field) => searchTerms.every((term) => item[field]?.toLowerCase().includes(term)))
  );

  // If exactMatch is false, filter based on individual search terms
  let partialMatchResults = [];
  if (!toBool(exactMatch)) {
    partialMatchResults = data.filter((item) =>
      searchTerms.some((term) => fieldsToSearch.some((field) => item[field]?.toLowerCase().includes(term)))
    );
  }

  // Merge exactMatchResults and partialMatchResults, ensuring uniqueness
  const uniqueItemsMap = new Map();

  [...exactMatchResults, ...partialMatchResults].forEach((item) => {
    // Use a unique identifier to ensure uniqueness, e.g., 'id'
    const itemId = item.id || JSON.stringify(item); // Use `id` if available, otherwise stringify the item
    if (!uniqueItemsMap.has(itemId)) {
      uniqueItemsMap.set(itemId, item);
    }
  });

  // Convert the Map values to an array
  const mergedUniqueResults = Array.from(uniqueItemsMap.values());

  // Sort filtered data: exact matches first, then partial matches
  return mergedUniqueResults.sort((a, b) => {
    const aMatchesExact = fieldsToSearch.some((field) => a[field]?.toLowerCase().includes(searchLower));
    const bMatchesExact = fieldsToSearch.some((field) => b[field]?.toLowerCase().includes(searchLower));

    if (aMatchesExact && !bMatchesExact) {
      return -1; // `a` should come before `b`
    }
    if (!aMatchesExact && bMatchesExact) {
      return 1; // `b` should come before `a`
    }
    return 0; // Leave the order unchanged if both are either exact matches or both are partial matches
  });
};

/**
 * Filters data based on tags.
 * @param {Array<Object>} data - The data to be filtered.
 * @param {string} tags - Comma-separated list of tags to filter by.
 * @returns {Array<Object>} The filtered data.
 */
export const filterByTags = (data: ICouplet[], tags: string): ICouplet[] => {
  if (!tags) return data;

  const tagsArray = tags.split(",").map((tag) => tag.trim().toLowerCase());
  return data.filter((post) => post.tags.some((tag) => tagsArray.includes(tag.slug.toLowerCase())));
};

/**
 * Filters data based on popularity status.
 * @param {Array<Object>} data - The data to be filtered.
 * @param {boolean} popular - Whether to filter by popularity status.
 * @returns {Array<Object>} The filtered data.
 */
export const filterByPopularity = (data: ICouplet[], popular: boolean): ICouplet[] => {
  if (toBool(popular) === false) return data;
  return data.filter((post) => toBool(post.popular) === toBool(popular));
};

/**
 * Sorts data based on the specified field and order.
 * @param {Array<Object>} data - The data to be sorted.
 * @param {string} orderBy - The field to sort by (in lowercase).
 * @param {string} order - The sort order ("ASC" or "DESC", in uppercase).
 * @returns {Array<Object>} The sorted data.
 */
export const sortData = (data: ICouplet[], orderBy: string, order: string): ICouplet[] => {
  // Normalize orderBy to lowercase and order to uppercase
  const normalizedOrderBy = orderBy?.toLowerCase() || "id";
  const normalizedOrder = order?.toUpperCase() || "ASC";

  return data.sort((a, b) => {
    if (normalizedOrderBy === "random") {
      return Math.random() - 0.5;
    }

    if (normalizedOrderBy === "couplet_english") {
      return normalizedOrder === "ASC"
        ? a.couplet_english.localeCompare(b.couplet_english)
        : b.couplet_english.localeCompare(a.couplet_english);
    }

    if (normalizedOrderBy === "couplet_hindi") {
      return normalizedOrder === "ASC"
        ? a.couplet_hindi.localeCompare(b.couplet_hindi, "hi")
        : b.couplet_hindi.localeCompare(a.couplet_hindi, "hi");
    }

    if (normalizedOrderBy === "popular") {
      if (a.popular === b.popular) {
        return normalizedOrder === "ASC"
          ? a.couplet_hindi.localeCompare(b.couplet_hindi, "hi")
          : b.couplet_hindi.localeCompare(a.couplet_hindi, "hi");
      }
      return normalizedOrder === "ASC" ? (a.popular ? -1 : 1) : a.popular ? 1 : -1;
    }

    if (normalizedOrderBy === "id") {
      const aId = Number(a.id);
      const bId = Number(b.id);
      return normalizedOrder === "ASC" ? aId - bId : bId - aId;
    }

    const valA = a[normalizedOrderBy];
    const valB = b[normalizedOrderBy];
    if (valA < valB) return normalizedOrder === "DESC" ? 1 : -1;
    if (valA > valB) return normalizedOrder === "DESC" ? -1 : 1;
    return 0;
  });
};

/**
 * Paginates the data based on the current page and items per page.
 * @param {Array<Object>} data - The data to be paginated.
 * @param {number} page - The current page number.
 * @param {number} perPage - The number of items per page.
 * @param {boolean} pagination - Whether to include pagination info.
 * @returns {Object} The paginated data along with pagination details.
 */
export const paginateData = (data: ICouplet[], page: number, perPage: number, pagination: boolean): PaginatedResult => {
  const isPaginationEnabled = toBool(pagination);

  let limit = Number(perPage);

  if (limit === -1) {
    limit = data.length;
  }

  if (limit <= 0 || isNaN(limit)) limit = 10;

  const pageNumber = Math.max(Number(page) || 1, 1);
  const start = (pageNumber - 1) * limit;
  const end = start + limit;
  const total = data.length;
  const totalPages = Math.ceil(total / limit);

  const paginatedData = pageNumber > totalPages ? [] : data.slice(start, end);

  return {
    couplets: paginatedData,
    total: isPaginationEnabled ? total : paginatedData.length,
    totalPages: isPaginationEnabled ? totalPages : 1,
    page: pageNumber,
    perPage: limit,
    pagination: isPaginationEnabled,
  };
};
