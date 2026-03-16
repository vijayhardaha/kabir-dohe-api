import { NextResponse } from 'next/server';
import { z } from 'zod';

import { createClient } from '@/server/db/supabase';
import { handleError } from '@/server/lib/errors/error-handler';
import { success } from '@/server/lib/response/response';

/**
 * Default parameter values for the API.
 */
const DEFAULT_PARAMS = {
  search: '',
  search_fields: 'all',
  tags: '',
  is_popular: false,
  sort_by: 'id',
  sort_order: 'asc',
  page: 1,
  per_page: 10,
  pagination: true,
} as const;

/**
 * Zod schema for validating query parameters.
 */
const QuerySchema = z.object({
  search: z.string().optional().default(DEFAULT_PARAMS.search),
  search_fields: z
    .string()
    .optional()
    .default(DEFAULT_PARAMS.search_fields)
    .refine(
      (val) =>
        val === 'all' || val.split(',').every((v) => ['text', 'interpretation'].includes(v.trim().toLowerCase())),
      { message: "Invalid search_fields value. Allowed values: 'all', 'text', 'interpretation'" }
    ),
  tags: z.string().optional().default(DEFAULT_PARAMS.tags),
  is_popular: z.boolean().optional().default(DEFAULT_PARAMS.is_popular),
  sort_by: z
    .string()
    .optional()
    .default(DEFAULT_PARAMS.sort_by)
    .refine((val) => ['id', 'is_popular', 'text_en', 'text_hi'].includes(val), {
      message: "Invalid sort_by value. Allowed values: 'id', 'is_popular', 'text_en', 'text_hi'",
    }),
  sort_order: z
    .string()
    .optional()
    .default(DEFAULT_PARAMS.sort_order)
    .refine((val) => ['asc', 'desc'].includes(val), {
      message: "Invalid sort_order value. Allowed values: 'asc', 'desc'",
    }),
  page: z.number().int().positive().optional().default(DEFAULT_PARAMS.page),
  per_page: z.number().int().positive().optional().default(DEFAULT_PARAMS.per_page),
  pagination: z.boolean().optional().default(DEFAULT_PARAMS.pagination),
});

/**
 * Type for a Supabase query builder instance.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QueryBuilder = any;

/**
 * Type for validated query parameters.
 */
type QueryParams = z.infer<typeof QuerySchema>;

/**
 * Type for transformed post data (simplified public API response).
 */
interface Post {
  number: number;
  slug: string;
  text_hi: string;
  text_en: string;
  interpretation_hi: string;
  interpretation_en: string;
  category: string | null;
  tags: Array<{ slug: string; name: string }>;
}

/**
 * Base select fields for posts query.
 */
const POST_SELECT_FIELDS = `
  id,
  post_number,
  slug,
  text_hi,
  text_en,
  interpretation_hi,
  interpretation_en,
  category_id,
  tags:post_tags!inner(
    tag:tags(
      id,
      slug,
      name
    )
  )
`;

/**
 * Get search fields based on search_fields parameter.
 *
 * @param {string} search_fields - The search_fields parameter value
 * @returns {string[]} Array of field names to search within
 */
function getSearchFields(search_fields: string): string[] {
  // Define field groups
  const textFields = ['text_hi', 'text_en'];
  const interpretationFields = ['interpretation_hi', 'interpretation_en'];

  if (search_fields === 'all') {
    return [...textFields, ...interpretationFields];
  }

  return search_fields.split(',').flatMap((field) => {
    const trimmed = field.trim().toLowerCase();
    if (trimmed === 'text') return textFields;
    if (trimmed === 'interpretation') return interpretationFields;
    return [];
  });
}

/**
 * Transform a database row to post format (simplified public API).
 *
 * @param {Record<string, unknown>} row - Database row
 * @returns {Post} Transformed post data
 */
function transformPostData(row: Record<string, unknown>): Post {
  const tagsArray =
    (row.tags as Array<Record<string, unknown>>)?.map((t: Record<string, unknown>) => ({
      slug: (t.tag as Record<string, unknown>)?.slug as string,
      name: (t.tag as Record<string, unknown>)?.name as string,
    })) ?? [];

  return {
    number: row.post_number as number,
    slug: row.slug as string,
    text_hi: row.text_hi as string,
    text_en: row.text_en as string,
    interpretation_hi: row.interpretation_hi as string,
    interpretation_en: row.interpretation_en as string,
    category: row.category_id as string | null,
    tags: tagsArray,
  };
}

/**
 * Apply search filter to a query.
 * Includes both exact phrase and individual words for prioritization.
 *
 * @param {QueryBuilder} query - Supabase query builder
 * @param {string} searchQuery - The search query string
 * @param {string[]} searchFields - Fields to search within
 * @returns {QueryBuilder} Query with search filter applied
 */
function applySearchFilter(query: QueryBuilder, searchQuery: string, searchFields: string[]): QueryBuilder {
  if (!searchQuery) return query;

  let searchTerms = searchQuery.trim().split(/\s+/).filter(Boolean);
  // Include the full search string as an additional term for non-exact matching
  searchTerms = [searchTerms.join(' '), ...new Set(searchTerms)];

  const orConditions = searchTerms.flatMap((term) => searchFields.map((field) => `${field}.ilike.%${term}%`)).join(',');

  return query.or(orConditions);
}

/**
 * Apply tag filter to a query.
 *
 * @param {QueryBuilder} query - Supabase query builder
 * @param {string[]} tagList - List of tags to filter by
 * @returns {QueryBuilder} Query with tag filter applied
 */
function applyTagFilter(query: QueryBuilder, tagList: string[]): QueryBuilder {
  if (tagList.length === 0) return query;

  const tagConditions = tagList
    .flatMap((tag) => [`tags.tag.slug.ilike.%${tag}%`, `tags.tag.name.ilike.%${tag}%`])
    .join(',');

  return query.or(tagConditions);
}

/**
 * Apply popular filter to a query.
 *
 * @param {QueryBuilder} query - Supabase query builder
 * @param {boolean} is_popular - Whether to filter by popular posts
 * @returns {QueryBuilder} Query with popular filter applied
 */
function applyPopularFilter(query: QueryBuilder, is_popular: boolean): QueryBuilder {
  if (!is_popular) return query;

  return query.eq('is_popular', true);
}

/**
 * Apply sorting to a query.
 *
 * @param {QueryBuilder} query - Supabase query builder
 * @param {string} sort_by - Field to sort by
 * @param {string} sort_order - Sort order ('asc' or 'desc')
 * @returns {QueryBuilder} Query with sorting applied
 */
function applySorting(query: QueryBuilder, sort_by: string, sort_order: string): QueryBuilder {
  const ascending = sort_order === 'asc';

  if (sort_by === 'is_popular') {
    return query.order('is_popular', { ascending: false }).order('post_order', { ascending });
  }
  if (sort_by === 'text_en') {
    return query.order('text_en', { ascending });
  }
  if (sort_by === 'text_hi') {
    return query.order('text_hi', { ascending });
  }

  return query.order('post_order', { ascending });
}

/**
 * Apply pagination (offset/range) to a query.
 *
 * @param {QueryBuilder} query - Supabase query builder
 * @param {number} page - Page number (1-indexed)
 * @param {number} per_page - Items per page
 * @returns {QueryBuilder} Query with pagination applied
 */
function applyPagination(query: QueryBuilder, page: number, per_page: number): QueryBuilder {
  const from = (page - 1) * per_page;
  const to = from + per_page - 1;

  return query.range(from, to);
}

/**
 * Build a count query with the same filters as the main query.
 */
async function getFilteredCount(
  supabase: Awaited<ReturnType<typeof createClient>>,
  searchFields: string[],
  search: string,
  tagList: string[],
  is_popular: boolean
): Promise<number> {
  let query = supabase.from('posts').select('*', { count: 'exact', head: true });

  query = applySearchFilter(query, search, searchFields);
  query = applyTagFilter(query, tagList);
  query = applyPopularFilter(query, is_popular);

  const { count } = await query;
  return count ?? 0;
}

/**
 * Fetches posts from Supabase with filtering, sorting, and pagination.
 *
 * @param {QueryParams} params - The validated query parameters.
 * @returns {Promise<{ posts: Post[]; total: number; totalPages: number; page: number; per_page: number; pagination: boolean }>} Paginated post results.
 */
async function fetchPostsFromSupabase(
  params: QueryParams
): Promise<{ posts: Post[]; total: number; totalPages: number; page: number; per_page: number; pagination: boolean }> {
  const supabase = await createClient();

  const { search, search_fields, tags, is_popular, sort_by, sort_order, page, per_page, pagination } = params;

  const normalizedOrder = sort_order?.toLowerCase() || 'asc';

  // Parse tags for filtering
  const tagList = tags
    ? tags
        .split(',')
        .map((t: string) => t.trim().toLowerCase())
        .filter(Boolean)
    : [];

  const searchFields = getSearchFields(search_fields);

  // Build the base query with tags join
  let query = supabase.from('posts').select(POST_SELECT_FIELDS);

  // Apply filters using reusable functions
  query = applySearchFilter(query, search ?? '', searchFields);
  query = applyTagFilter(query, tagList);
  query = applyPopularFilter(query, is_popular);

  // Get total count with all filters applied
  const total = pagination
    ? await getFilteredCount(supabase, searchFields, search ?? '', tagList, is_popular ?? false)
    : 0;

  // Apply sorting using reusable function
  query = applySorting(query, sort_by ?? 'id', normalizedOrder);

  // Apply pagination using reusable function
  query = applyPagination(query, page ?? 1, per_page ?? 10);

  // Execute query
  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch posts: ${error.message}`);
  }

  // Transform data using reusable function
  const posts = (data ?? []).map(transformPostData);

  const pageNumber = page ?? 1;
  const perPageNumber = per_page ?? 10;
  const totalPages = perPageNumber > 0 ? Math.ceil(total / perPageNumber) : 1;

  return {
    posts,
    total: pagination ? total : posts.length,
    totalPages: pagination ? totalPages : 1,
    page: pageNumber,
    per_page: perPageNumber,
    pagination,
  };
}

/**
 * Validates and parses query parameters from URL search params.
 *
 * @param {URLSearchParams} searchParams - URL search parameters.
 * @returns {QueryParams} Validated query parameters.
 */
function parseQueryParams(searchParams: URLSearchParams): QueryParams {
  const params: Record<string, unknown> = {};

  for (const [key, value] of searchParams.entries()) {
    if (key === 'is_popular' || key === 'pagination') {
      params[key] = value === 'true';
    } else if (key === 'page' || key === 'per_page') {
      const num = Number(value);
      params[key] = isNaN(num) ? undefined : num;
    } else {
      params[key] = value;
    }
  }

  return QuerySchema.parse({ ...DEFAULT_PARAMS, ...params });
}

/**
 * Handles errors in API route handlers, including Zod validation errors.
 *
 * @param {unknown} error - Error thrown from route handlers.
 * @param {string} [fallbackMessage='An error occurred'] - Fallback message for unknown errors.
 * @returns {NextResponse} Structured error response with safe message and HTTP status.
 * @example
 * return handleRouteError(error);
 * // Returns validation error for ZodError, or generic error response.
 */
export function handleRouteError(error: unknown, fallbackMessage: string = 'An error occurred'): NextResponse {
  if (error instanceof z.ZodError) {
    const message = error.issues.map((e: z.core.$ZodIssue) => e.message).join(', ');
    return handleError(new Error(`Validation error: ${message}`));
  }

  return handleError(error instanceof Error ? error : new Error(fallbackMessage));
}

/**
 * GET route handler for the posts API.
 * Retrieves posts from Supabase based on URL query parameters.
 *
 * @param {Request} request - The incoming HTTP request object.
 * @returns {Promise<NextResponse>} JSON response with posts data or error message.
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);

    // Validate and parse query parameters
    const params = parseQueryParams(searchParams);

    // Fetch posts from Supabase
    const result = await fetchPostsFromSupabase(params);

    return success(result);
  } catch (error) {
    return handleRouteError(error, 'Failed to fetch posts');
  }
}

/**
 * POST route handler for the posts API.
 * Retrieves posts from Supabase based on request body parameters.
 *
 * @param {Request} request - The incoming HTTP request object.
 * @returns {Promise<NextResponse>} JSON response with posts data or error message.
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();

    // Validate and parse request body
    const params = QuerySchema.parse({ ...DEFAULT_PARAMS, ...body });

    // Fetch posts from Supabase
    const result = await fetchPostsFromSupabase(params);

    return success(result);
  } catch (error) {
    return handleRouteError(error, 'Failed to fetch posts');
  }
}
