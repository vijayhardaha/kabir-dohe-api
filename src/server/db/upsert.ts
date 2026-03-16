import type { SupabaseClient } from '@supabase/supabase-js';

import { ApiError } from '@/server/lib';

import { DbPostTags } from './mappings/post-tags.mapper';
import { DbPost } from './mappings/post.mapper';
import { DbTag } from './mappings/tag.mapper';

/**
 * Upserts normalized post rows and returns identifiers for newly inserted or updated records.
 *
 * @param {SupabaseClient} supabase - Server-side Supabase client configured with project credentials and cookie context.
 * @param {DbPost[]} dbPosts - Normalized post rows prepared from spreadsheet or ingestion sources.
 * @returns {Promise<{ data: { id: string; identifier: string }[] | null; count: number | null }>} Selected identifiers and affected row count.
 * @throws {ApiError} Throws when the posts upsert operation fails at the database layer.
 * @example
 * const result = await upsertPosts(client, [{ identifier: "K001", text_hi: "..." }] as DbPost[]);
 * // result.count -> 1
 */
export async function upsertPosts(
  supabase: SupabaseClient,
  dbPosts: DbPost[]
): Promise<{ data: { id: string; identifier: string }[]; count: number | null }> {
  // Use identifier as the canonical conflict key to avoid duplicate logical records.
  const { data, error, count } = await supabase
    .from('posts')
    .upsert(dbPosts, { onConflict: 'identifier', count: 'exact' })
    // Return only fields needed by downstream relationship mapping.
    .select('id, identifier');

  if (error) {
    throw new ApiError(`Failed to upsert posts: ${error.message}`, 500);
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
 * Upserts post-tag join records and returns mapping keys for synchronization verification.
 *
 * @param {SupabaseClient} supabase - Server-side Supabase client for authenticated database mutations.
 * @param {DbPostTags[]} mappings - Normalized join-table rows linking persisted post and tag identifiers.
 * @returns {Promise<{ data: { post_id: string; tag_id: string }[] | null; count: number | null }>} Persisted mapping keys and affected row count.
 * @throws {ApiError} Throws when the post_tags upsert operation returns an error.
 * @example
 * const result = await upsertPostTags(client, [{ post_id: "c1", tag_id: "t1" }]);
 * // result.count -> 1
 */
export async function upsertPostTags(
  supabase: SupabaseClient,
  mappings: DbPostTags[]
): Promise<{ data: { post_id: string; tag_id: string }[] | null; count: number | null }> {
  // Composite conflict target ensures each post-tag pair appears only once.
  const { data, error, count } = await supabase
    .from('post_tags')
    .upsert(mappings, { onConflict: 'post_id,tag_id', count: 'exact' })
    // Keep response minimal while still allowing integrity checks.
    .select('post_id, tag_id');

  if (error) {
    throw new ApiError('Failed to upsert post-tag mappings', 500);
  }

  return { data, count };
}
