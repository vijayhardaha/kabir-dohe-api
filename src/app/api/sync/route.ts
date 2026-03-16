import type { SupabaseClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

import { buildPostTagMappings } from '@/lib/server/db/mappings/post-tags.mapper';
import type { DbPost } from '@/lib/server/db/mappings/post.mapper';
import type { DbTag } from '@/lib/server/db/mappings/tag.mapper';
import { createClient } from '@/lib/server/db/supabase';
import { upsertPosts, upsertPostTags, upsertTags } from '@/lib/server/db/upsert';
import { env } from '@/lib/server/env/server';
import { sheetToJson } from '@/lib/server/integrations/gsheet';
import { ApiError, handleError, success } from '@/lib/server/utils';
import { generateHash } from '@/lib/server/utils/string';

/**
 * Validate the passkey from request parameters
 *
 * @param request - incoming request
 * @returns validated passkey hash
 * @throws ApiError if passkey is missing or invalid
 */
async function validatePasskey(request: NextRequest): Promise<string> {
  const { searchParams } = new URL(request.url);
  const passkey = searchParams.get('passkey');

  if (!passkey) {
    throw new ApiError('Passkey required', 400);
  }

  const hashedPasskey = generateHash(passkey);
  if (hashedPasskey !== env.SUPABASE_PASSKEY_HASH) {
    throw new ApiError('Unauthorized Access', 401);
  }

  return hashedPasskey;
}

/**
 * Pull post data from Google Sheets
 *
 * @param sheetName - name of the sheet to pull from
 * @returns raw posts, mapped posts, and tags
 */
async function pullSheetData(sheetName: string) {
  return sheetToJson(sheetName);
}

/**
 * Create Supabase client with hash key header
 *
 * @param hashedPasskey - the hashed passkey for authorization
 * @returns Supabase client instance
 * @throws ApiError if client creation fails
 */
async function createSupabaseClient(hashedPasskey: string): Promise<SupabaseClient> {
  const supabase = await createClient({ global: { headers: { 'x-hash-key': hashedPasskey } } });

  if (!supabase) {
    throw new ApiError('Supabase error', 500);
  }

  return supabase;
}

/**
 * Sync posts to database
 *
 * @param supabase - Supabase client
 * @param posts - mapped posts to upsert
 * @returns upsert result with data and count
 */
async function syncPosts(supabase: SupabaseClient, posts: DbPost[]) {
  return upsertPosts(supabase, posts);
}

/**
 * Sync tags to database
 *
 * @param supabase - Supabase client
 * @param tags - tags to upsert
 * @returns upsert result with data and count
 */
async function syncTags(supabase: SupabaseClient, tags: DbTag[]) {
  return upsertTags(supabase, tags);
}

/**
 * Sync post-tag mappings to database
 *
 * @param supabase - Supabase client
 * @param {Array<{ identifier: string; tags: string[] }>} rawPosts - Raw posts with tag information from the source.
 * @param {Record<string, string>[]} postsData - Upserted posts data with ids.
 * @param {Record<string, string>[]} tagsData - Upserted tags data with ids.
 * @returns upsert result with count
 */
async function syncPostTags(
  supabase: SupabaseClient,
  rawPosts: Array<{ identifier: string; tags: string[] }>,
  postsData: Record<string, string>[],
  tagsData: Record<string, string>[]
) {
  const mappings = buildPostTagMappings(rawPosts, postsData ?? [], tagsData ?? []);

  if (mappings.length > 0) {
    return upsertPostTags(supabase, mappings);
  }

  return { count: 0 };
}

/**
 * GET handler
 *
 * Checks passkey, syncs posts from Google Sheets to Supabase.
 *
 * @param request - incoming request
 * @returns JSON status
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // validate passkey
    const hashedPasskey = await validatePasskey(request);

    // pull sheet data
    const { rawPosts, posts, tags } = await pullSheetData('kabir-ke-dohe');

    // create supabase client
    const supabase = await createSupabaseClient(hashedPasskey);

    // summary
    let message = '';

    // sync posts
    const { data: postsData, count: postsCount } = await syncPosts(supabase, posts);
    message += `Upserted ${postsCount ?? 0} posts.`;

    // sync tags and mappings
    if (postsCount && postsCount > 0 && tags.length > 0) {
      const { data: tagsData, count: tagsCount } = await syncTags(supabase, tags);
      message += ` Upserted ${tagsCount} tags.`;

      // build and sync post-tag mappings
      const mappingRes = await syncPostTags(supabase, rawPosts, postsData ?? [], tagsData ?? []);
      const mappingCount = mappingRes.count || 0;
      message += ` Upserted ${mappingCount} post-tag mappings.`;
    }

    // success response
    return success({ message: message });
  } catch (err) {
    // standardize errors
    return handleError(err instanceof Error ? err : new Error('Sync failed')) as NextResponse;
  }
}
