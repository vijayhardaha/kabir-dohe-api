import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Represents a post record from the database.
 */
export interface DbPost {
  slug: string;
  identifier: string;
  text_hi: string;
  text_en: string;
  meaning_hi?: string;
  meaning_en?: string;
  interpretation_hi?: string;
  interpretation_en?: string;
  philosophical_analysis_hi?: string;
  philosophical_analysis_en?: string;
  practical_example_hi?: string;
  practical_example_en?: string;
  practice_guidance_hi?: string;
  practice_guidance_en?: string;
  core_message_hi?: string;
  core_message_en?: string;
  reflection_questions_hi?: string;
  reflection_questions_en?: string;
  post_number: number;
  post_order: number;
  post_status: string;
  category_id?: string;
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
 * Represents a category record from the database.
 */
export interface DbCategory {
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
 * Upserts multiple categories into the database using slug as the conflict key.
 *
 * @param {SupabaseClient} supabase - The Supabase client instance.
 * @param {DbCategory[]} categories - The array of categories to upsert.
 * @returns {Promise<{ data: { id: string; slug: string }[]; count: number | null }>} The upserted categories and count.
 * @throws {Error} Throws when the upsert operation fails.
 */
export async function upsertCategories(
  supabase: SupabaseClient,
  categories: DbCategory[]
): Promise<{ data: { id: string; slug: string }[]; count: number | null }> {
  const { data, error, count } = await supabase
    .from('categories')
    .upsert(categories, { onConflict: 'slug', count: 'exact' })
    .select('id, slug');

  if (error) {
    throw new Error('Failed to upsert categories: ' + error.message);
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
