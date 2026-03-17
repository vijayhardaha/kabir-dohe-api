import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Represents a post record from the database.
 */
export interface DbPost {
  slug: string;
  identifier: string;
  text_hi: string;
  text_en: string;
  interpretation_hi: string;
  interpretation_en: string;
  philosophical_analysis_hi: string;
  philosophical_analysis_en: string;
  practical_example_hi: string;
  practical_example_en: string;
  practice_guidance_hi: string;
  practice_guidance_en: string;
  core_message_hi: string;
  core_message_en: string;
  reflection_questions_hi: string;
  reflection_questions_en: string;
  post_number: number;
  post_order: number;
  post_status: string;
  is_popular: boolean;
  is_featured: boolean;
}

/**
 * Represents a tag record from the database.
 */
export interface DbTag {
  name: string;
  slug: string;
}

/**
 * Represents a post-tag mapping record for the junction table.
 */
export interface PostTagMapping {
  post_id: string;
  tag_id: string;
}

/**
 * Upserts a single post into the database using identifier as the conflict key.
 *
 * @param {SupabaseClient} supabase - The Supabase client instance.
 * @param {DbPost} post - The post data to upsert.
 * @returns {Promise<{ id: string; identifier: string }>} The inserted/updated post's id and identifier.
 * @throws {Error} Throws when the upsert operation fails.
 * @example
 * const result = await upsertPost(supabase, { identifier: "K001", text_hi: "..." });
 */
export async function upsertPost(supabase: SupabaseClient, post: DbPost): Promise<{ id: string; identifier: string }> {
  const { data, error } = await supabase
    .from('posts')
    .upsert(post, { onConflict: 'identifier' })
    .select('id, identifier')
    .single();

  if (error) {
    throw new Error('Failed to upsert post ' + post.identifier + ': ' + error.message);
  }

  return { id: data.id, identifier: data.identifier };
}

/**
 * Upserts a single tag into the database using slug as the conflict key.
 *
 * @param {SupabaseClient} supabase - The Supabase client instance.
 * @param {DbTag} tag - The tag data to upsert.
 * @returns {Promise<{ id: string; slug: string }>} The inserted/updated tag's id and slug.
 * @throws {Error} Throws when the upsert operation fails.
 * @example
 * const result = await upsertTag(supabase, { name: "Bhakti", slug: "bhakti" });
 */
export async function upsertTag(supabase: SupabaseClient, tag: DbTag): Promise<{ id: string; slug: string }> {
  const { data, error } = await supabase.from('tags').upsert(tag, { onConflict: 'slug' }).select('id, slug').single();

  if (error) {
    throw new Error('Failed to upsert tag ' + tag.name + ': ' + error.message);
  }

  return { id: data.id, slug: data.slug };
}

/**
 * Upserts a single post-tag mapping into the junction table.
 *
 * @param {SupabaseClient} supabase - The Supabase client instance.
 * @param {PostTagMapping} mapping - The post-tag mapping to upsert.
 * @returns {Promise<void>} Resolves when the operation completes successfully.
 * @throws {Error} Throws when the upsert operation fails.
 * @example
 * await upsertPostTag(supabase, { post_id: "post-uuid", tag_id: "tag-uuid" });
 */
export async function upsertPostTag(supabase: SupabaseClient, mapping: PostTagMapping): Promise<void> {
  const { error } = await supabase
    .from('post_tags')
    .upsert(mapping, { onConflict: 'post_id,tag_id' })
    .select()
    .single();

  if (error) {
    throw new Error('Failed to upsert post_tag mapping: ' + error.message);
  }
}

/**
 * Upserts multiple posts into the database using identifier as the conflict key.
 *
 * @param {SupabaseClient} supabase - The Supabase client instance.
 * @param {DbPost[]} posts - The array of posts to upsert.
 * @returns {Promise<{ data: { id: string; identifier: string }[]; count: number | null }>} The upserted posts and count.
 * @throws {Error} Throws when the upsert operation fails.
 * @example
 * const result = await upsertPosts(supabase, [{ identifier: "K001", text_hi: "..." }]);
 */
export async function upsertPosts(
  supabase: SupabaseClient,
  posts: DbPost[]
): Promise<{ data: { id: string; identifier: string }[]; count: number | null }> {
  const { data, error, count } = await supabase
    .from('posts')
    .upsert(posts, { onConflict: 'identifier', count: 'exact' })
    .select('id, identifier');

  if (error) {
    throw new Error('Failed to upsert posts: ' + error.message);
  }

  return { data, count };
}

/**
 * Upserts multiple tags into the database using slug as the conflict key.
 *
 * @param {SupabaseClient} supabase - The Supabase client instance.
 * @param {DbTag[]} tags - The array of tags to upsert.
 * @returns {Promise<{ data: { id: string; slug: string }[]; count: number | null }>} The upserted tags and count.
 * @throws {Error} Throws when the upsert operation fails.
 * @example
 * const result = await upsertTags(supabase, [{ name: "Bhakti", slug: "bhakti" }]);
 */
export async function upsertTags(
  supabase: SupabaseClient,
  tags: DbTag[]
): Promise<{ data: { id: string; slug: string }[]; count: number | null }> {
  const { data, error, count } = await supabase
    .from('tags')
    .upsert(tags, { onConflict: 'slug', count: 'exact' })
    .select('id, slug');

  if (error) {
    throw new Error('Failed to upsert tags: ' + error.message);
  }

  return { data, count };
}

/**
 * Upserts multiple post-tag mappings into the junction table.
 *
 * @param {SupabaseClient} supabase - The Supabase client instance.
 * @param {PostTagMapping[]} mappings - The array of post-tag mappings to upsert.
 * @returns {Promise<{ data: PostTagMapping[]; count: number | null }>} The upserted mappings and count.
 * @throws {Error} Throws when the upsert operation fails.
 * @example
 * const result = await upsertPostTags(supabase, [{ post_id: "p1", tag_id: "t1" }]);
 */
export async function upsertPostTags(
  supabase: SupabaseClient,
  mappings: PostTagMapping[]
): Promise<{ data: PostTagMapping[]; count: number | null }> {
  const { data, error, count } = await supabase
    .from('post_tags')
    .upsert(mappings, { onConflict: 'post_id,tag_id' })
    .select();

  if (error) {
    throw new Error('Failed to upsert post_tags: ' + error.message);
  }

  return { data, count };
}
