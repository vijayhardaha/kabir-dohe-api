import type { SupabaseClient } from '@supabase/supabase-js';

import { ApiError } from '@/server/lib';

import { DbCoupletTags } from './mappings/couplet-tags.mapper';
import { DbCouplet } from './mappings/couplet.mapper';
import { DbTag } from './mappings/tag.mapper';

/**
 * Upserts normalized couplet rows and returns identifiers for newly inserted or updated records.
 *
 * @param {SupabaseClient} supabase - Server-side Supabase client configured with project credentials and cookie context.
 * @param {DbCouplet[]} dbCouplets - Normalized couplet rows prepared from spreadsheet or ingestion sources.
 * @returns {Promise<{ data: { id: string; couplet_code: string }[] | null; count: number | null }>} Selected identifiers and affected row count.
 * @throws {ApiError} Throws when the couplets upsert operation fails at the database layer.
 * @example
 * const result = await upsertCouplets(client, [{ couplet_code: "K001", doha: "..." }] as DbCouplet[]);
 * // result.count -> 1
 */
export async function upsertCouplets(
  supabase: SupabaseClient,
  dbCouplets: DbCouplet[]
): Promise<{ data: { id: string; couplet_code: string }[]; count: number | null }> {
  // Use couplet_code as the canonical conflict key to avoid duplicate logical records.
  const { data, error, count } = await supabase
    .from('couplets')
    .upsert(dbCouplets, { onConflict: 'couplet_code', count: 'exact' })
    // Return only fields needed by downstream relationship mapping.
    .select('id, couplet_code');

  if (error) {
    throw new ApiError(`Failed to upsert couplets: ${error.message}`, 500);
  }

  return { data, count };
}

/**
 * Upserts tag rows by slug and returns persisted identifiers for relation mapping workflows.
 *
 * @param {SupabaseClient} supabase - Server-side Supabase client used to execute privileged write operations.
 * @param {DbTag[]} dbTags - Unique tag rows containing slug and display name values.
 * @returns {Promise<{ data: { id: string; slug: string }[] | null; count: number | null }>} Upserted tag identifiers and affected row count.
 * @throws {ApiError} Throws when the tags upsert query fails unexpectedly.
 * @example
 * const result = await upsertTags(client, [{ slug: "bhakti", name: "Bhakti" }]);
 * // result.data?.[0].slug -> "bhakti"
 */
export async function upsertTags(
  supabase: SupabaseClient,
  dbTags: DbTag[]
): Promise<{ data: { id: string; slug: string }[] | null; count: number | null }> {
  // Deduplicate through slug to enforce a single canonical row per semantic tag.
  const { data, error, count } = await supabase
    .from('tags')
    .upsert(dbTags, { onConflict: 'slug', count: 'exact' })
    // Limit payload size by selecting only linkage fields.
    .select('id, slug');

  if (error) {
    throw new ApiError('Failed to upsert tags', 500);
  }

  return { data, count };
}

/**
 * Upserts couplet-tag join records and returns mapping keys for synchronization verification.
 *
 * @param {SupabaseClient} supabase - Server-side Supabase client for authenticated database mutations.
 * @param {DbCoupletTags[]} mappings - Normalized join-table rows linking persisted couplet and tag identifiers.
 * @returns {Promise<{ data: { couplet_id: string; tag_id: string }[] | null; count: number | null }>} Persisted mapping keys and affected row count.
 * @throws {ApiError} Throws when the couplet_tags upsert operation returns an error.
 * @example
 * const result = await upsertCoupletTags(client, [{ couplet_id: "c1", tag_id: "t1" }]);
 * // result.count -> 1
 */
export async function upsertCoupletTags(
  supabase: SupabaseClient,
  mappings: DbCoupletTags[]
): Promise<{ data: { couplet_id: string; tag_id: string }[] | null; count: number | null }> {
  // Composite conflict target ensures each couplet-tag pair appears only once.
  const { data, error, count } = await supabase
    .from('couplet_tags')
    .upsert(mappings, { onConflict: 'couplet_id,tag_id', count: 'exact' })
    // Keep response minimal while still allowing integrity checks.
    .select('couplet_id, tag_id');

  if (error) {
    throw new ApiError('Failed to upsert couplet-tag mappings', 500);
  }

  return { data, count };
}
