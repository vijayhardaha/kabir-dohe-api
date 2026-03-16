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
        val === 'all'
        || val.split(',').every((v) => ['couplet', 'translation', 'explanation'].includes(v.trim().toLowerCase())),
      { message: "Invalid search_fields value. Allowed values: 'all', 'couplet', 'translation', 'explanation'" }
    ),
  tags: z.string().optional().default(DEFAULT_PARAMS.tags),
  is_popular: z.boolean().optional().default(DEFAULT_PARAMS.is_popular),
  sort_by: z
    .string()
    .optional()
    .default(DEFAULT_PARAMS.sort_by)
    .refine((val) => ['id', 'popular', 'couplet_english', 'couplet_hindi'].includes(val), {
      message: "Invalid sort_by value. Allowed values: 'id', 'popular', 'couplet_english', 'couplet_hindi'",
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
 * Accepts both PostgresQueryBuilder and PostgresFilterBuilder.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QueryBuilder = any;

/**
 * Type for validated query parameters.
 */
type QueryParams = z.infer<typeof QuerySchema>;

/**
 * Type for transformed couplet data.
 */
interface Couplet {
  id: number;
  unique_slug: string;
  couplet_hindi: string;
  couplet_english: string;
  translation_hindi: string;
  translation_english: string;
  explanation_hindi: string;
  explanation_english: string;
  is_popular: boolean;
  tags: Array<{ slug: string; name: string }>;
}

/**
 * Base select fields for couplets query.
 */
const COUPLET_SELECT_FIELDS = `
  id,
  couplet_number,
  slug,
  hindi_text,
  english_text,
  hindi_translation,
  english_translation,
  hindi_explanation,
  english_explanation,
  popular,
  tags:couplet_tags!inner(
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
  const coupletFields = ['hindi_text', 'english_text'];
  const translationFields = ['hindi_translation', 'english_translation'];
  const explanationFields = ['hindi_explanation', 'english_explanation'];

  if (search_fields === 'all') {
    return [...coupletFields, ...translationFields, ...explanationFields];
  }

  return search_fields.split(',').flatMap((field) => {
    const trimmed = field.trim().toLowerCase();
    if (trimmed === 'couplet') return coupletFields;
    if (trimmed === 'translation') return translationFields;
    if (trimmed === 'explanation') return explanationFields;
    return [];
  });
}

/**
 * Transform a database row to couplet format.
 *
 * @param {Record<string, unknown>} row - Database row
 * @returns {Couplet} Transformed couplet data
 */
function transformCoupletData(row: Record<string, unknown>): Couplet {
  const tagsArray =
    (row.tags as Array<Record<string, unknown>>)?.map((t: Record<string, unknown>) => ({
      slug: (t.tag as Record<string, unknown>)?.slug as string,
      name: (t.tag as Record<string, unknown>)?.name as string,
    })) ?? [];

  return {
    id: row.couplet_number as number,
    unique_slug: row.slug as string,
    couplet_hindi: row.hindi_text as string,
    couplet_english: row.english_text as string,
    translation_hindi: row.hindi_translation as string,
    translation_english: row.english_translation as string,
    explanation_hindi: row.hindi_explanation as string,
    explanation_english: row.english_explanation as string,
    is_popular: row.popular as boolean,
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
 * @param {boolean} is_popular - Whether to filter by popular couplets
 * @returns {QueryBuilder} Query with popular filter applied
 */
function applyPopularFilter(query: QueryBuilder, is_popular: boolean): QueryBuilder {
  if (!is_popular) return query;

  return query.eq('popular', true);
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

  if (sort_by === 'popular') {
    return query.order('popular', { ascending: false }).order('couplet_order', { ascending });
  }
  if (sort_by === 'couplet_english') {
    return query.order('english_text', { ascending });
  }
  if (sort_by === 'couplet_hindi') {
    return query.order('hindi_text', { ascending });
  }

  return query.order('couplet_order', { ascending });
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
  let countQuery = supabase.from('couplets').select('*', { count: 'exact', head: true });

  countQuery = applySearchFilter(countQuery, search, searchFields);
  countQuery = applyTagFilter(countQuery, tagList);
  countQuery = applyPopularFilter(countQuery, is_popular);

  const { count } = await countQuery;
  return count ?? 0;
}

/**
 * Fetches couplets from Supabase with filtering, sorting, and pagination.
 *
 * @param {QueryParams} params - The validated query parameters.
 * @returns {Promise<{ couplets: Couplet[]; total: number; totalPages: number; page: number; per_page: number; pagination: boolean }>} Paginated couplet results.
 */
async function fetchCoupletsFromSupabase(
  params: QueryParams
): Promise<{
  couplets: Couplet[];
  total: number;
  totalPages: number;
  page: number;
  per_page: number;
  pagination: boolean;
}> {
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
  let query = supabase.from('couplets').select(COUPLET_SELECT_FIELDS);

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
    throw new Error(`Failed to fetch couplets: ${error.message}`);
  }

  // Transform data using reusable function
  const couplets = (data ?? []).map(transformCoupletData);

  const pageNumber = page ?? 1;
  const perPageNumber = per_page ?? 10;
  const totalPages = perPageNumber > 0 ? Math.ceil(total / perPageNumber) : 1;

  return {
    couplets,
    total: pagination ? total : couplets.length,
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
 * GET route handler for the couplets API.
 * Retrieves couplets from Supabase based on URL query parameters.
 *
 * @param {Request} request - The incoming HTTP request object.
 * @returns {Promise<NextResponse>} JSON response with couplets data or error message.
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);

    // Validate and parse query parameters
    const params = parseQueryParams(searchParams);

    // Fetch couplets from Supabase
    const result = await fetchCoupletsFromSupabase(params);

    return success(result);
  } catch (error) {
    return handleRouteError(error, 'Failed to fetch couplets');
  }
}

/**
 * POST route handler for the couplets API.
 * Retrieves couplets from Supabase based on request body parameters.
 *
 * @param {Request} request - The incoming HTTP request object.
 * @returns {Promise<NextResponse>} JSON response with couplets data or error message.
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();

    // Validate and parse request body
    const params = QuerySchema.parse({ ...DEFAULT_PARAMS, ...body });

    // Fetch couplets from Supabase
    const result = await fetchCoupletsFromSupabase(params);

    return success(result);
  } catch (error) {
    return handleRouteError(error, 'Failed to fetch couplets');
  }
}
