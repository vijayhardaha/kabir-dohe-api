import { NextResponse } from 'next/server';
import { z } from 'zod';

import { supabase } from '@/lib/server/db/supabase';
import { handleError } from '@/lib/server/utils/errors/error-handler';
import { successCached } from '@/lib/server/utils/response/response';

/**
 * Default parameter values for the search API.
 */
const DEFAULT_PARAMS = { search_query: '', page: 1, per_page: 10 } as const;

/**
 * Zod schema for validating search query parameters.
 */
const SearchQuerySchema = z.object({
  search_query: z.string().optional().default(DEFAULT_PARAMS.search_query),
  page: z.coerce.number().int().positive().optional().default(DEFAULT_PARAMS.page),
  per_page: z.coerce.number().int().positive().max(100).optional().default(DEFAULT_PARAMS.per_page),
});

/**
 * Type for validated search query parameters.
 */
type SearchQueryParams = z.infer<typeof SearchQuerySchema>;

/**
 * Parses and validates query parameters from URL search params.
 */
function parseQueryParams(searchParams: URLSearchParams): SearchQueryParams {
  const params: Record<string, unknown> = {};

  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return SearchQuerySchema.parse({ ...DEFAULT_PARAMS, ...params });
}

/**
 * Searches couplets by text in search_text column.
 * Returns only the text_hi field for each matching result.
 */
async function searchCouplets(params: SearchQueryParams): Promise<{ posts: string[] }> {
  const searchTerm = params.search_query?.trim() || '';
  const offset = (params.page - 1) * params.per_page;

  let query = supabase.from('posts').select('text_hi');

  if (searchTerm) {
    query = query.ilike('search_text', `%${searchTerm}%`);
  }

  const { data, error } = await query.range(offset, offset + params.per_page - 1);

  if (error) {
    throw new Error(`Search failed: ${error.message}`);
  }

  const posts: string[] = (data ?? []).map((row) => row.text_hi);

  return { posts };
}

/**
 * Handles the search API request and returns formatted response.
 */
async function handleRequest(params: SearchQueryParams): Promise<{ posts: string[] }> {
  return searchCouplets(params);
}

export const runtime = 'edge';

/**
 * GET route handler for the search API.
 * Searches couplets by text in text_hi and text_en columns.
 *
 * @param request - The incoming GET request with query parameters
 * @returns NextResponse with search results containing only text_hi field
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const params = parseQueryParams(searchParams);
    const result = await handleRequest(params);

    return successCached(result);
  } catch (error) {
    return handleRouteError(error);
  }
}

/**
 * Handles errors in the search API route handler.
 */
function handleRouteError(error: unknown): NextResponse {
  if (error instanceof z.ZodError) {
    const message = error.issues.map((e: z.ZodIssue) => e.message).join(', ');
    return handleError(new Error(`Validation error: ${message}`));
  }

  return handleError(error instanceof Error ? error : new Error('Failed to search couplets'));
}
