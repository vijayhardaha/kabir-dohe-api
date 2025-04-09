import { NextResponse } from "next/server";

import { getData } from "@/lib/data";
import { checkRateLimit } from "@/lib/rateLimiter";

/**
 * Default parameter values for the API
 * @constant {Object} DEFAULT_PARAMS
 * @property {string} s - Search query string
 * @property {boolean} exactMatch - Whether to perform exact match for search
 * @property {string} searchWithin - Where to search: "all", "couplet", "translation", "explanation" or combinations
 * @property {string} tags - Comma-separated list of tags to filter by
 * @property {boolean} popular - Whether to filter by popularity
 * @property {string} orderBy - Field to sort by: "id", "random", "popular", "couplet_english", "couplet_hindi"
 * @property {string} order - Sort order: "ASC" or "DESC"
 * @property {number} page - Page number for pagination
 * @property {number} perPage - Number of records per page
 * @property {boolean} pagination - Whether to enable pagination
 */
const DEFAULT_PARAMS = {
  s: "",
  exactMatch: false,
  searchWithin: "all",
  tags: "",
  popular: false,
  orderBy: "id",
  order: "ASC",
  page: 1,
  perPage: 10,
  pagination: true,
};

/**
 * Extracts and normalizes request parameters with default values
 *
 * @param {URLSearchParams|Object} requestData - Request data (search params for GET, body for POST)
 * @param {string} requestType - Request type: "GET" or "POST"
 * @returns {Object} Normalized parameters with defaults applied
 */
function getParamsWithDefaults(requestData, requestType) {
  const params = {};

  // Apply defaults based on request type
  for (const [key, defaultValue] of Object.entries(DEFAULT_PARAMS)) {
    if (requestType === "GET") {
      // For GET requests, we need to handle 'false' string for boolean values
      if (typeof defaultValue === "boolean") {
        if (key === "pagination") {
          params[key] = requestData.get(key) !== "false"; // Default to true
        } else {
          params[key] = requestData.get(key) === "true" || defaultValue;
        }
      } else {
        params[key] = requestData.get(key) || defaultValue;
      }
    } else {
      // POST
      params[key] = requestData[key] !== undefined ? requestData[key] : defaultValue;
    }
  }

  return params;
}

/**
 * Processes and validates API request parameters and returns the corresponding data
 *
 * @async
 * @function processRequest
 * @param {Object} params - The normalized request parameters
 * @param {string} params.s - Search query string
 * @param {boolean} params.exactMatch - Whether to perform exact match for search
 * @param {string} params.searchWithin - Where to search: "all", "couplet", "translation", "explanation" or combinations
 * @param {string} params.tags - Comma-separated list of tags to filter by
 * @param {boolean} params.popular - Whether to filter by popularity
 * @param {string} params.orderBy - Field to sort by: "id", "random", "popular", "couplet_english", "couplet_hindi"
 * @param {string} params.order - Sort order: "ASC" or "DESC"
 * @param {number} params.page - Page number for pagination
 * @param {number} params.perPage - Number of records per page
 * @param {boolean} params.pagination - Whether to enable pagination
 * @returns {Promise<Object>} Result object with success status and either data or error message
 * @returns {boolean} result.success - Indicates if the request was successful
 * @returns {Object} [result.data] - The requested couplets data if successful
 * @returns {string} [result.message] - Error message if not successful
 * @returns {number} [result.status] - HTTP status code if not successful
 */
async function processRequest(params) {
  // Validate 'orderBy' parameter
  if (params.orderBy && !["id", "random", "popular", "couplet_english", "couplet_hindi"].includes(params.orderBy)) {
    return {
      success: false,
      message:
        "Bad Request: The 'orderBy' value provided is invalid. Accepted values are 'id', 'random', 'popular', 'couplet_english', or 'couplet_hindi'.",
      status: 400,
    };
  }

  // Validate 'order' parameter
  if (params.order && !["ASC", "DESC"].includes(params.order)) {
    return {
      success: false,
      message:
        "Bad Request: The 'order' value provided is invalid. Accepted values are 'ASC' (ascending) or 'DESC' (descending).",
      status: 400,
    };
  }

  // Validate 'searchWithin' parameter
  if (params.searchWithin && params.searchWithin !== "all") {
    const allowedFields = ["couplet", "translation", "explanation"];
    const searchWithinArray = params.searchWithin.split(",").map((field) => field.trim().toLowerCase());

    // Validate each field in searchWithinArray
    const invalidFields = searchWithinArray.filter((field) => !allowedFields.includes(field));

    if (invalidFields.length > 0) {
      return {
        success: false,
        message: `Bad Request: The 'searchWithin' value(s) provided are invalid. Accepted values are 'couplet', 'translation', or 'explanation'. Invalid values: ${invalidFields.join(", ")}.`,
        status: 400,
      };
    }
  }

  // Fetch data using the provided parameters
  const result = getData(params);
  return { success: true, data: result };
}

/**
 * Helper function to add CORS headers to response
 *
 * @param {NextResponse} response - The response object to modify
 * @returns {NextResponse} Response with CORS headers
 */
function addCorsHeaders(response) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return response;
}

/**
 * GET route handler for the couplets API
 * Retrieves couplets based on URL query parameters
 *
 * @async
 * @param {Request} request - The incoming HTTP request object
 * @returns {NextResponse} JSON response with couplets data or error message
 */
export async function GET(request) {
  try {
    const ip = request.ip ?? request.headers.get("x-forwarded-for") ?? "unknown";

    const { allowed } = await checkRateLimit({
      ip,
      endpoint: "/api/hello",
    });

    if (!allowed) {
      return addCorsHeaders(NextResponse.json({ success: false, message: "Too many requests" }, { status: 429 }));
    }

    // Extract parameters from URL
    const { searchParams } = new URL(request.url);
    const params = getParamsWithDefaults(searchParams, "GET");

    const result = await processRequest(params);

    if (!result.success) {
      return addCorsHeaders(
        NextResponse.json({ success: result.success, message: result.message }, { status: result.status })
      );
    }

    return addCorsHeaders(NextResponse.json({ success: true, data: result.data }));
  } catch (error) {
    return addCorsHeaders(NextResponse.json({ success: false, message: error.message }, { status: 500 }));
  }
}

/**
 * POST route handler for the couplets API
 * Retrieves couplets based on request body parameters
 *
 * @async
 * @param {Request} request - The incoming HTTP request object
 * @returns {NextResponse} JSON response with couplets data or error message
 */
export async function POST(request) {
  try {
    const ip = request.ip ?? request.headers.get("x-forwarded-for") ?? "unknown";

    const { allowed } = await checkRateLimit({
      ip,
      endpoint: "/api/hello",
    });

    if (!allowed) {
      return addCorsHeaders(NextResponse.json({ success: false, message: "Too many requests" }, { status: 429 }));
    }

    // Extract parameters from request body
    const body = await request.json();
    const params = getParamsWithDefaults(body, "POST");

    const result = await processRequest(params);

    if (!result.success) {
      return addCorsHeaders(
        NextResponse.json({ success: result.success, message: result.message }, { status: result.status })
      );
    }

    return addCorsHeaders(NextResponse.json({ success: true, data: result.data }));
  } catch (error) {
    return addCorsHeaders(NextResponse.json({ success: false, message: error.message }, { status: 500 }));
  }
}
