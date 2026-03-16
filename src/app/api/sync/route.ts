import type { SupabaseClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

import { buildCoupletTagMappings } from '@/server/db/mappings/couplet-tags.mapper';
import type { DbCouplet } from '@/server/db/mappings/couplet.mapper';
import type { DbTag } from '@/server/db/mappings/tag.mapper';
import { createClient } from '@/server/db/supabase';
import { upsertCouplets, upsertCoupletTags, upsertTags } from '@/server/db/upsert';
import { env } from '@/server/env/server';
import { sheetToJson } from '@/server/integrations/gsheet';
import { ApiError, handleError, success } from '@/server/lib';
import { generateHash } from '@/server/lib/string';

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
 * Pull couplet data from Google Sheets
 *
 * @param sheetName - name of the sheet to pull from
 * @returns raw couplets, mapped couplets, and tags
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
 * Sync couplets to database
 *
 * @param supabase - Supabase client
 * @param couplets - mapped couplets to upsert
 * @returns upsert result with data and count
 */
async function syncCouplets(supabase: SupabaseClient, couplets: DbCouplet[]) {
  return upsertCouplets(supabase, couplets);
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
 * Sync couplet-tag mappings to database
 *
 * @param supabase - Supabase client
 * @param {Array<{ couplet_code: string; tags: string[] }>} rawCouplets - Raw couplets with tag information from the source.
 * @param {Record<string, string>[]} coupletsData - Upserted couplets data with ids.
 * @param {Record<string, string>[]} tagsData - Upserted tags data with ids.
 * @returns upsert result with count
 */
async function syncCoupletTags(
  supabase: SupabaseClient,
  rawCouplets: Array<{ couplet_code: string; tags: string[] }>,
  coupletsData: Record<string, string>[],
  tagsData: Record<string, string>[]
) {
  const mappings = buildCoupletTagMappings(rawCouplets, coupletsData ?? [], tagsData ?? []);

  if (mappings.length > 0) {
    return upsertCoupletTags(supabase, mappings);
  }

  return { count: 0 };
}

/**
 * GET handler
 *
 * Checks passkey, syncs couplets from Google Sheets to Supabase.
 *
 * @param request - incoming request
 * @returns JSON status
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // validate passkey
    const hashedPasskey = await validatePasskey(request);

    // pull sheet data
    const { rawCouplets, couplets, tags } = await pullSheetData('kabir-ke-dohe');

    // create supabase client
    const supabase = await createSupabaseClient(hashedPasskey);

    // summary
    let message = '';

    // sync couplets
    const { data: coupletsData, count: coupletsCount } = await syncCouplets(supabase, couplets);
    message += `Upserted ${coupletsCount ?? 0} couplets.`;

    // sync tags and mappings
    if (coupletsCount && coupletsCount > 0 && tags.length > 0) {
      const { data: tagsData, count: tagsCount } = await syncTags(supabase, tags);
      message += ` Upserted ${tagsCount} tags.`;

      // build and sync couplet-tag mappings
      const mappingRes = await syncCoupletTags(supabase, rawCouplets, coupletsData ?? [], tagsData ?? []);
      const mappingCount = mappingRes.count || 0;
      message += ` Upserted ${mappingCount} couplet-tag mappings.`;
    }

    // success response
    return success({ message: message });
  } catch (err) {
    // standardize errors
    return handleError(err instanceof Error ? err : new Error('Sync failed')) as NextResponse;
  }
}
