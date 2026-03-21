import { NextResponse } from 'next/server';
import { z } from 'zod';

import { supabase } from '@/lib/server/db/supabase';
import { sanitizeTitle } from '@/lib/server/utils';
import { handleError } from '@/lib/server/utils/errors/error-handler';
import { success, successCached } from '@/lib/server/utils/response/response';

/**
 * Default parameter values for the API.
 */
const DEFAULT_PARAMS = {
  search_query: '',
  search_content: false,
  tags: '',
  category: '',
  is_popular: false,
  is_featured: false,
  sort_by: 'number',
  sort_order: 'asc',
  page: 1,
  per_page: 10,
  pagination: true,
} as const;

/**
 * Zod schema for validating query parameters.
 */
const QuerySchema = z.object({
  search_query: z.string().optional().default(DEFAULT_PARAMS.search_query),
  search_content: z.boolean().optional().default(DEFAULT_PARAMS.search_content),
  tags: z.string().optional().default(DEFAULT_PARAMS.tags),
  category: z.string().optional().default(DEFAULT_PARAMS.category),
  is_popular: z.boolean().optional().default(DEFAULT_PARAMS.is_popular),
  is_featured: z.boolean().optional().default(DEFAULT_PARAMS.is_featured),
  sort_by: z
    .string()
    .optional()
    .default(DEFAULT_PARAMS.sort_by)
    .refine((val) => ['number', 'popular', 'featured', 'text_en', 'text_hi'].includes(val), {
      message: "Invalid sort_by value. Allowed values: 'number', 'popular', 'featured', 'text_en', 'text_hi'",
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
 * Type for transformed post data.
 */
interface Post {
  number: number;
  slug: string;
  text_hi: string;
  text_en: string;
  meaning_hi: string | null;
  meaning_en: string | null;
  category: { name: string; slug: string } | null;
  tags: Array<{ slug: string; name: string }>;
  created_at: string;
  updated_at: string;
}

/**
 * Parses a string value to boolean for query parameters.
 */
function parseBoolean(value: string | null | undefined): boolean {
  return value === 'true' || value === '1' || value === 'yes';
}

/**
 * Parses a string value to number for query parameters.
 */
function parseNumber(value: string | null | undefined): number | undefined {
  const num = Number(value);
  return isNaN(num) ? undefined : num;
}

/**
 * Validates and parses query parameters from URL search params.
 */
function parseQueryParams(searchParams: URLSearchParams): QueryParams {
  const params: Record<string, unknown> = {};

  searchParams.forEach((value, key) => {
    if (['is_popular', 'is_featured', 'pagination', 'search_content'].includes(key)) {
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
 * Transform a database row to post format.
 */
function transformPost(row: Record<string, unknown>): Post {
  const tags = Array.isArray(row.tags)
    ? (row.tags as Array<{ slug: string; name: string }>).map((t) => ({
        name: String(t.name ?? ''),
        slug: String(t.slug ?? ''),
      }))
    : [];

  const category = row.category as { name: unknown; slug: unknown } | null;
  const transformedCategory = category
    ? { name: String(category.name ?? ''), slug: String(category.slug ?? '') }
    : null;

  return {
    number: row.post_number as number,
    slug: row.slug as string,
    text_hi: row.text_hi as string,
    text_en: row.text_en as string,
    meaning_hi: row.meaning_hi as string | null,
    meaning_en: row.meaning_en as string | null,
    category: transformedCategory,
    tags,
    created_at: (row.created_at as string) || '',
    updated_at: (row.updated_at as string) || '',
  };
}

/**
 * Fetches posts from Supabase using the RPC function.
 */
async function fetchPosts(params: QueryParams) {
  const searchTrimmed = params.search_query?.trim() || '';
  const tagsTrimmed = params.tags?.trim() || '';
  const categoryTrimmed = params.category?.trim() || '';

  const tagsSlugified = tagsTrimmed
    ? tagsTrimmed
        .split(',')
        .map((t) => sanitizeTitle(t.trim()))
        .filter(Boolean)
        .join(',')
    : '';

  const categorySlugified = categoryTrimmed ? sanitizeTitle(categoryTrimmed) : '';

  const orderMapper: Record<string, string> = {
    number: 'post_number',
    popular: 'is_popular',
    featured: 'is_featured',
    text_en: 'text_en',
    text_hi: 'text_hi',
  };

  const filters = {
    search_query: searchTrimmed || null,
    search_content: params.search_content || false,
    tags: tagsSlugified || null,
    category: categorySlugified || null,
    is_popular: params.is_popular || false,
    is_featured: params.is_featured || false,
    sort_by: orderMapper[params.sort_by] || 'post_number',
    sort_order: params.sort_order || 'asc',
    page: params.page || 1,
    per_page: params.per_page || 10,
    pagination: params.pagination !== false,
  };

  const { data, error } = await supabase.rpc('get_couplets_for_api', { filters });

  if (error) {
    throw new Error(`Failed to fetch posts: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return { posts: [], total: 0 };
  }

  const total = data[0]?.total_count || 0;
  const posts = data.map(transformPost);

  return { posts, total };
}

/**
 * Handle API request and return formatted response.
 */
async function handleRequest(
  params: QueryParams
): Promise<{ posts: Post[]; total: number; totalPages: number; page: number; per_page: number; pagination: boolean }> {
  const { posts, total } = await fetchPosts(params);

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
 * Handles errors in API route handlers.
 */
function handleRouteError(error: unknown, fallbackMessage: string = 'An error occurred'): NextResponse {
  if (error instanceof z.ZodError) {
    const message = error.issues.map((e: z.core.$ZodIssue) => e.message).join(', ');
    return handleError(new Error(`Validation error: ${message}`));
  }

  return handleError(error instanceof Error ? error : new Error(fallbackMessage));
}

export const runtime = 'edge';

/**
 * GET route handler for the posts API.
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const params = parseQueryParams(searchParams);
    const result = await handleRequest(params);

    return successCached(result);
  } catch (error) {
    return handleRouteError(error, 'Failed to fetch posts');
  }
}

/**
 * POST route handler for the posts API.
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const params = QuerySchema.parse({ ...DEFAULT_PARAMS, ...body });
    const result = await handleRequest(params);

    return success(result);
  } catch (error) {
    return handleRouteError(error, 'Failed to fetch posts');
  }
}
