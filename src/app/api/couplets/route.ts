import { NextResponse } from 'next/server';
import { z } from 'zod';

import { createClient } from '@/server/db/supabase';
import { handleError } from '@/server/lib/errors/error-handler';
import { success } from '@/server/lib/response/response';

/**
 * Zod schema for validating couplet query parameters.
 */
const CoupletQuerySchema = z.object({
  s: z.string().optional().default(''),
  exactMatch: z.boolean().optional().default(false),
  searchWithin: z
    .string()
    .optional()
    .default('all')
    .refine(
      (val) =>
        val === 'all'
        || val.split(',').every((v) => ['couplet', 'translation', 'explanation'].includes(v.trim().toLowerCase())),
      { message: "Invalid searchWithin value. Allowed values: 'all', 'couplet', 'translation', 'explanation'" }
    ),
  tags: z.string().optional().default(''),
  popular: z.boolean().optional().default(false),
  orderBy: z
    .string()
    .optional()
    .default('id')
    .refine((val) => ['id', 'popular', 'couplet_english', 'couplet_hindi'].includes(val), {
      message: "Invalid orderBy value. Allowed values: 'id', 'popular', 'couplet_english', 'couplet_hindi'",
    }),
  order: z
    .string()
    .optional()
    .default('ASC')
    .refine((val) => ['ASC', 'DESC'].includes(val), { message: "Invalid order value. Allowed values: 'ASC', 'DESC'" }),
  page: z.number().int().positive().optional().default(1),
  perPage: z.number().int().positive().optional().default(10),
  pagination: z.boolean().optional().default(true),
});

/**
 * Type for validated query parameters.
 */
type CoupletQueryParams = z.infer<typeof CoupletQuerySchema>;

/**
 * Default parameter values for the API.
 */
const DEFAULT_PARAMS: CoupletQueryParams = {
  s: '',
  exactMatch: false,
  searchWithin: 'all',
  tags: '',
  popular: false,
  orderBy: 'id',
  order: 'ASC',
  page: 1,
  perPage: 10,
  pagination: true,
};

/**
 * Helper to convert order string to boolean.
 *
 * @param {string} order - 'ASC' or 'DESC'
 * @returns {boolean} true for ascending, false for descending
 */
function getAscending(order: string): boolean {
  return order === 'ASC';
}

/**
 * Get search fields based on searchWithin parameter.
 *
 * @param {string} searchWithin - The searchWithin parameter value
 * @returns {string[]} Array of field names to search within
 */
function getSearchFields(searchWithin: string): string[] {
  if (searchWithin === 'all') {
    return [
      'hindi_text',
      'english_text',
      'hindi_translation',
      'english_translation',
      'hindi_explanation',
      'english_explanation',
    ];
  }

  return searchWithin.split(',').flatMap((field) => {
    const trimmed = field.trim().toLowerCase();
    if (trimmed === 'couplet') return ['hindi_text', 'english_text'];
    if (trimmed === 'translation') return ['hindi_translation', 'english_translation'];
    if (trimmed === 'explanation') return ['hindi_explanation', 'english_explanation'];
    return [];
  });
}

/**
 * Build a count query with the same filters as the main query.
 */
async function getFilteredCount(
  supabase: Awaited<ReturnType<typeof createClient>>,
  searchFields: string[],
  s: string,
  exactMatch: boolean,
  tagList: string[],
  popular: boolean
): Promise<number> {
  let countQuery = supabase.from('couplets').select('*', { count: 'exact', head: true });

  // Apply search filters
  if (s) {
    const searchTerms = s.trim().split(/\s+/).filter(Boolean);

    if (exactMatch) {
      // Exact match: search full string in any field (OR condition)
      const orConditions = searchFields.map((field) => `${field}.ilike.%${s}%`).join(',');
      countQuery = countQuery.or(orConditions);
    } else {
      // Non-exact match: any of the split words match any field (OR condition)
      const orConditions = searchTerms
        .flatMap((term) => searchFields.map((field) => `${field}.ilike.%${term}%`))
        .join(',');
      countQuery = countQuery.or(orConditions);
    }
  }

  // Apply tags filter
  if (tagList.length > 0) {
    const tagConditions = tagList
      .flatMap((tag) => [`tags.tag.slug.ilike.%${tag}%`, `tags.tag.name.ilike.%${tag}%`])
      .join(',');
    countQuery = countQuery.or(tagConditions);
  }

  // Apply popularity filter
  if (popular) {
    countQuery = countQuery.eq('popular', true);
  }

  const { count } = await countQuery;
  return count ?? 0;
}

/**
 * Fetches couplets from Supabase with filtering, sorting, and pagination.
 *
 * @param {CoupletQueryParams} params - The validated query parameters.
 * @returns {Promise<{ couplets: unknown[]; total: number; totalPages: number; page: number; perPage: number; pagination: boolean }>} Paginated couplet results.
 */
async function fetchCoupletsFromSupabase(
  params: CoupletQueryParams
): Promise<{
  couplets: unknown[];
  total: number;
  totalPages: number;
  page: number;
  perPage: number;
  pagination: boolean;
}> {
  const supabase = await createClient();

  const { s, exactMatch, searchWithin, tags, popular, orderBy, order, page, perPage, pagination } = params;

  const normalizedOrder = order?.toUpperCase() || 'ASC';

  // Parse tags for filtering
  const tagList = tags
    ? tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)
    : [];

  const searchFields = getSearchFields(searchWithin);

  // Build the base query with tags join
  let query = supabase.from('couplets').select(
    `
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
  `
  );

  // Apply search filter
  if (s) {
    const searchTerms = s.trim().split(/\s+/).filter(Boolean);

    if (exactMatch) {
      // Exact match: search full string in any field (OR condition)
      const orConditions = searchFields.map((field) => `${field}.ilike.%${s}%`).join(',');
      query = query.or(orConditions);
    } else {
      // Non-exact match: any of the split words match any field (OR condition)
      const orConditions = searchTerms
        .flatMap((term) => searchFields.map((field) => `${field}.ilike.%${term}%`))
        .join(',');
      query = query.or(orConditions);
    }
  }

  // Apply tags filter in Supabase query
  // Match couplets that have ANY of the provided tags (by slug OR name)
  if (tagList.length > 0) {
    const tagConditions = tagList
      .flatMap((tag) => [`tags.tag.slug.ilike.%${tag}%`, `tags.tag.name.ilike.%${tag}%`])
      .join(',');
    query = query.or(tagConditions);
  }

  // Apply popularity filter
  if (popular) {
    query = query.eq('popular', true);
  }

  // Get total count with all filters applied
  const total = pagination
    ? await getFilteredCount(supabase, searchFields, s ?? '', exactMatch ?? false, tagList, popular ?? false)
    : 0;

  // Apply sorting
  const ascending = getAscending(normalizedOrder);
  if (orderBy === 'popular') {
    query = query.order('popular', { ascending: false }).order('couplet_order', { ascending });
  } else if (orderBy === 'couplet_english') {
    query = query.order('english_text', { ascending });
  } else if (orderBy === 'couplet_hindi') {
    query = query.order('hindi_text', { ascending });
  } else {
    query = query.order('couplet_order', { ascending });
  }

  // Apply pagination
  const pageNumber = page ?? 1;
  const perPageNumber = perPage ?? 10;
  const from = (pageNumber - 1) * perPageNumber;
  const to = from + perPageNumber - 1;

  query = query.range(from, to);

  // Execute query
  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch couplets: ${error.message}`);
  }

  // Transform data to match expected format
  const couplets = (data ?? []).map((row: Record<string, unknown>) => {
    // Extract tags from the nested structure
    const tagsArray =
      (row.tags as Array<Record<string, unknown>>)?.map((t: Record<string, unknown>) => ({
        slug: (t.tag as Record<string, unknown>)?.slug as string,
        name: (t.tag as Record<string, unknown>)?.name as string,
      })) ?? [];

    return {
      id: row.couplet_number,
      unique_slug: row.slug,
      couplet_hindi: row.hindi_text,
      couplet_english: row.english_text,
      translation_hindi: row.hindi_translation,
      translation_english: row.english_translation,
      explanation_hindi: row.hindi_explanation,
      explanation_english: row.english_explanation,
      popular: row.popular,
      tags: tagsArray,
    };
  });

  const totalPages = perPageNumber > 0 ? Math.ceil(total / perPageNumber) : 1;

  return {
    couplets,
    total: pagination ? total : couplets.length,
    totalPages: pagination ? totalPages : 1,
    page: pageNumber,
    perPage: perPageNumber,
    pagination,
  };
}

/**
 * Validates and parses query parameters from URL search params.
 *
 * @param {URLSearchParams} searchParams - URL search parameters.
 * @returns {CoupletQueryParams} Validated query parameters.
 */
function parseQueryParams(searchParams: URLSearchParams): CoupletQueryParams {
  const params: Record<string, unknown> = {};

  for (const [key, value] of searchParams.entries()) {
    if (key === 'exactMatch' || key === 'popular' || key === 'pagination') {
      params[key] = value === 'true';
    } else if (key === 'page' || key === 'perPage') {
      const num = Number(value);
      params[key] = isNaN(num) ? undefined : num;
    } else {
      params[key] = value;
    }
  }

  return CoupletQuerySchema.parse({ ...DEFAULT_PARAMS, ...params });
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
    const params = CoupletQuerySchema.parse({ ...DEFAULT_PARAMS, ...body });

    // Fetch couplets from Supabase
    const result = await fetchCoupletsFromSupabase(params);

    return success(result);
  } catch (error) {
    return handleRouteError(error, 'Failed to fetch couplets');
  }
}
