import { NextResponse } from 'next/server';
import { z } from 'zod';

import { createClient } from '@/lib/server/db/supabase';
import { handleError } from '@/lib/server/utils/errors/error-handler';
import { success } from '@/lib/server/utils/response/response';
import { sanitizeTitle } from '@/lib/server/utils/string';

/**
 * Default parameter values for the API.
 */
const DEFAULT_PARAMS = {
  search: '',
  search_content: false,
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
  search_content: z.boolean().optional().default(DEFAULT_PARAMS.search_content),
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
 * Type for validated query parameters.
 */
type QueryParams = z.infer<typeof QuerySchema>;

/**
 * Type for a Supabase query builder instance.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QueryBuilder = any;

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
  category: Record<string, unknown> | null;
  tags: Array<{ slug: string; name: string }>;
  created_at: string;
  updated_at: string;
}

/**
 * Base select fields for posts query.
 */
const POST_SELECT = `
  id, post_number, slug, text_hi, text_en,
  interpretation_hi, interpretation_en,
  category:categories(name, slug),
  post_tags!inner(tag_id),
  created_at, updated_at
`;

/**
 * Parses a string value to boolean for query parameters.
 *
 * @param {string | null | undefined} value - The value to parse
 * @returns {boolean} Parsed boolean value
 */
function parseBoolean(value: string | null | undefined): boolean {
  return value === 'true' || value === '1' || value === 'yes';
}

/**
 * Parses a string value to number for query parameters.
 *
 * @param {string | null | undefined} value - The value to parse
 * @returns {number | undefined} Parsed number value or undefined if invalid
 */
function parseNumber(value: string | null | undefined): number | undefined {
  const num = Number(value);
  return isNaN(num) ? undefined : num;
}

/**
 * Parses the tags query parameter into an array of tag names.
 *
 * @param {string} tagsParam - Comma-separated tags string
 * @returns {string[]} Array of tag names
 */
function parseTagList(tagsParam: string): string[] {
  if (!tagsParam) return [];
  return tagsParam
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Get search fields based on search_content parameter.
 * When true, searches in search_content_hi/search_content_en (full text search).
 * When false, searches in text_hi/text_en (main content only).
 *
 * @param {boolean} search_content - Whether to search in full content
 * @returns {string[]} Array of field names to search within
 */
function getSearchFields(search_content: boolean): string[] {
  if (search_content) {
    // Search in full content including all interpretations and analysis
    return ['search_content_hi', 'search_content_en'];
  }
  // Search only in main text fields
  return ['text_hi', 'text_en'];
}

/**
 * Look up tag IDs from tag names/slugs.
 *
 * @param {Awaited<ReturnType<typeof createClient>>} supabase - Supabase client
 * @param {string[]} tagNames - List of tag names to search for
 * @returns {Promise<string[]>} Array of tag IDs
 */
async function getTagIdsByNames(
  supabase: Awaited<ReturnType<typeof createClient>>,
  tagNames: string[]
): Promise<string[]> {
  if (tagNames.length === 0) return [];

  // Slugify the tag names before searching
  const slugifiedTags = tagNames.map((name) => sanitizeTitle(name));

  const { data } = await supabase.from('tags').select('id').in('slug', slugifiedTags);

  return data?.map((t) => t.id) ?? [];
}

/**
 * Get all tags for a list of posts.
 *
 * @param {Awaited<ReturnType<typeof createClient>>} supabase - Supabase client
 * @param {string[]} postIds - List of post IDs
 * @returns {Promise<Map<string, Array<{ id: string; name: string; slug: string }>>>} Map of post IDs to their tags
 */
async function getTagsForPosts(
  supabase: Awaited<ReturnType<typeof createClient>>,
  postIds: string[]
): Promise<Map<string, Array<{ id: string; name: string; slug: string }>>> {
  const tagMap = new Map<string, Array<{ id: string; name: string; slug: string }>>();

  if (postIds.length === 0) return tagMap;

  const { data } = await supabase.from('post_tags').select('post_id, tags(id, name, slug)').in('post_id', postIds);

  if (!data) return tagMap;

  for (const row of data) {
    const postId = row.post_id;
    const tag = (row.tags ?? {}) as unknown as Record<string, unknown>;

    if (!tagMap.has(postId)) {
      tagMap.set(postId, []);
    }
    tagMap.get(postId)!.push({ id: String(tag.id ?? ''), name: String(tag.name ?? ''), slug: String(tag.slug ?? '') });
  }

  return tagMap;
}

/**
 * Transform a database row to post format (simplified public API).
 *
 * @param {Record<string, unknown>} row - Database row
 * @param {Array<{ id: string; name: string; slug: string }>} tags - Array of tags
 * @returns {Post} Transformed post data
 */
function transformPost(row: Record<string, unknown>, tags: Array<{ id: string; name: string; slug: string }>): Post {
  return {
    number: row.post_number as number,
    slug: row.slug as string,
    text_hi: row.text_hi as string,
    text_en: row.text_en as string,
    interpretation_hi: row.interpretation_hi as string,
    interpretation_en: row.interpretation_en as string,
    category: (row.category as Record<string, unknown>) || null,
    tags: tags.map((t) => ({ name: t.name, slug: t.slug })),
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  };
}

/**
 * Apply search filter to a query.
 * Includes both exact phrase and individual words for prioritization.
 *
 * @param {QueryBuilder} query - Supabase query builder
 * @param {string} search - The search query string
 * @param {string[]} searchFields - Fields to search within
 * @returns {QueryBuilder} Query with search filter applied
 */
function applySearchFilter(query: QueryBuilder, search: string, searchFields: string[]): QueryBuilder {
  if (!search) return query;

  const terms = search
    .trim()
    .split(/\s+/)
    .filter((t) => t.length >= 3);
  // Include the full search string as an additional term for non-exact matching
  const allTerms = [terms.join(' '), ...Array.from(new Set(terms))];

  const conditions = allTerms.flatMap((term) => searchFields.map((field) => `${field}.ilike.%${term}%`)).join(',');

  return query.or(conditions);
}

/**
 * Apply tag filter to a query.
 *
 * @param {QueryBuilder} query - Supabase query builder
 * @param {string[]} tagIds - List of tag IDs to filter by
 * @returns {QueryBuilder} Query with tag filter applied
 */
function applyTagFilter(query: QueryBuilder, tagIds: string[]): QueryBuilder {
  if (tagIds.length === 0) return query;

  return query.in('post_tags.tag_id', tagIds);
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
 * Build a query with all filters applied.
 *
 * @param {QueryBuilder} query - Base query builder
 * @param {QueryParams} params - Query parameters
 * @param {string[]} searchFields - Fields to search within
 * @param {string[]} tagIds - Tag IDs to filter by
 * @param {boolean} forCount - Whether this is a count query
 * @returns {QueryBuilder} Query with all filters applied
 */
function buildQuery(
  query: QueryBuilder,
  params: QueryParams,
  searchFields: string[],
  tagIds: string[],
  forCount: boolean
): QueryBuilder {
  const { search, is_popular, sort_by, sort_order, page, per_page, pagination } = params;
  const sortOrder = sort_order?.toLowerCase() || 'asc';

  // Apply search filter
  query = applySearchFilter(query, search ?? '', searchFields);

  // Apply tag filter
  query = applyTagFilter(query, tagIds);

  // Apply popular filter
  query = applyPopularFilter(query, is_popular);

  // Apply sorting (skip for count queries)
  if (!forCount) {
    query = applySorting(query, sort_by ?? 'id', sortOrder);
  }

  // Apply pagination (skip for count queries)
  if (!forCount && pagination) {
    query = applyPagination(query, page ?? 1, per_page ?? 10);
  }

  return query;
}

/**
 * Calculate search relevance score for a post.
 *
 * @param {Record<string, unknown>} row - Database row
 * @param {string} search - Search query
 * @returns {number} Relevance score
 */
function scoreBySearch(row: Record<string, unknown>, search: string): number {
  if (!search) return 0;
  const content = `${row.text_hi} ${row.text_en}`.toLowerCase();
  return content.includes(search.toLowerCase()) ? 1 : 0;
}

/**
 * Validates and parses query parameters from URL search params.
 *
 * @param {URLSearchParams} searchParams - URL search parameters.
 * @returns {QueryParams} Validated query parameters.
 */
function parseQueryParams(searchParams: URLSearchParams): QueryParams {
  const params: Record<string, unknown> = {};

  searchParams.forEach((value, key) => {
    if (key === 'is_popular' || key === 'pagination' || key === 'search_content') {
      params[key] = parseBoolean(value);
    } else if (key === 'page' || key === 'per_page') {
      params[key] = parseNumber(value);
    } else {
      params[key] = value;
    }
  });

  return QuerySchema.parse({ ...DEFAULT_PARAMS, ...params });
}

/**
 * Fetches posts from Supabase with filtering, sorting, and pagination.
 *
 * @param {Awaited<ReturnType<typeof createClient>>} supabase - Supabase client
 * @param {QueryParams} params - Query parameters
 * @returns {Promise<Post[]>} Array of posts
 */
async function fetchPosts(supabase: Awaited<ReturnType<typeof createClient>>, params: QueryParams): Promise<Post[]> {
  const { tags, search_content } = params;

  // Parse tags for filtering
  const tagNames = parseTagList(tags);
  const tagIds = await getTagIdsByNames(supabase, tagNames);

  // If tags were requested but none found, return empty array
  if (tagNames.length > 0 && tagIds.length === 0) {
    return [];
  }

  const searchFields = getSearchFields(search_content);

  // Build the base query
  let query = supabase.from('posts').select(POST_SELECT);

  // Apply all filters
  query = buildQuery(query, params, searchFields, tagIds, false);

  // Execute query
  const { data: postsData, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch posts: ${error.message}`);
  }

  if (!postsData || postsData.length === 0) {
    return [];
  }

  // Get all tags for the filtered posts
  const postIds = postsData.map((p) => p.id as string);
  const tagsMap = await getTagsForPosts(supabase, postIds);

  // Transform and sort by search relevance
  const posts = postsData.map((row) => {
    const postId = row.id as string;
    const postTags = tagsMap.get(postId) ?? [];
    return transformPost(row, postTags);
  });

  return posts.sort((a, b) => {
    const scoreA = scoreBySearch(a as unknown as Record<string, unknown>, params.search ?? '');
    const scoreB = scoreBySearch(b as unknown as Record<string, unknown>, params.search ?? '');
    return scoreB - scoreA;
  });
}

/**
 * Get total count of posts matching the filters.
 *
 * @param {Awaited<ReturnType<typeof createClient>>} supabase - Supabase client
 * @param {QueryParams} params - Query parameters
 * @returns {Promise<number>} Total count of matching posts
 */
async function getTotalCount(supabase: Awaited<ReturnType<typeof createClient>>, params: QueryParams): Promise<number> {
  const { tags, search_content } = params;

  const tagNames = parseTagList(tags);
  const tagIds = await getTagIdsByNames(supabase, tagNames);

  // If tags were requested but none found, return 0
  if (tagNames.length > 0 && tagIds.length === 0) {
    return 0;
  }

  const searchFields = getSearchFields(search_content);

  // Use inner join in select for count queries with tags
  const selectFields = tagIds.length > 0 ? '*, post_tags!inner(tag_id)' : '*';
  let query = supabase.from('posts').select(selectFields, { count: 'exact', head: true });

  // Apply all filters (forCount = true)
  query = buildQuery(query, params, searchFields, tagIds, true);

  const { count, error } = await query;

  if (error) {
    throw new Error(`Failed to count posts: ${error.message}`);
  }

  return count ?? 0;
}

/**
 * Handle API request and return formatted response.
 *
 * @param {QueryParams} params - Query parameters
 * @returns {Promise<{ posts: Post[]; total: number; totalPages: number; page: number; per_page: number; pagination: boolean }>} Formatted response
 */
async function handleRequest(
  params: QueryParams
): Promise<{ posts: Post[]; total: number; totalPages: number; page: number; per_page: number; pagination: boolean }> {
  const supabase = await createClient();

  const posts = await fetchPosts(supabase, params);
  const total = params.pagination ? await getTotalCount(supabase, params) : posts.length;

  return {
    posts,
    total,
    totalPages: params.pagination ? Math.ceil(total / params.per_page) : 1,
    page: params.page,
    per_page: params.per_page,
    pagination: params.pagination,
  };
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
    const result = await handleRequest(params);

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
    const result = await handleRequest(params);

    return success(result);
  } catch (error) {
    return handleRouteError(error, 'Failed to fetch posts');
  }
}

/**
 * Handles errors in API route handlers, including Zod validation errors.
 *
 * @param {unknown} error - Error thrown from route handlers.
 * @param {string} [fallbackMessage='An error occurred'] - Fallback message for unknown errors.
 * @returns {NextResponse} Structured error response with safe message and HTTP status.
 * @example
 * return handleRouteError(error);
 */
function handleRouteError(error: unknown, fallbackMessage: string = 'An error occurred'): NextResponse {
  if (error instanceof z.ZodError) {
    const message = error.issues.map((e: z.core.$ZodIssue) => e.message).join(', ');
    return handleError(new Error(`Validation error: ${message}`));
  }

  return handleError(error instanceof Error ? error : new Error(fallbackMessage));
}
