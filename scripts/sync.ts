/**
 * Kabir Ke Dohe Database Sync Script
 *
 * This script synchronizes data from Google Sheets to the Supabase database.
 * It pulls posts, tags, and post-tag mappings from a Google Sheets document
 * and upserts them into the database using batch processing to avoid rate limiting.
 *
 * Usage:
 *   pnpm sync:local    - Run in development mode
 *   pnpm sync:prod     - Run in production mode
 */

import ora from 'ora';

import { sanitizeTitle } from '@/lib/server/utils';

import {
  upsertCategories,
  upsertPosts,
  upsertTags,
  upsertPostTags,
  type DbCategory,
  type DbPost,
  type DbTag,
} from './lib/db';
import { loadScriptEnv, type ScriptEnv } from './lib/env';
import { sheetToJson } from './lib/gsheet';
import { createSupabaseClient } from './lib/supabase';

const BATCH_SIZE = 500;

/**
 * Main sync function that orchestrates the data synchronization process.
 * Pulls data from Google Sheets and syncs it to the Supabase database.
 * Uses batch processing to avoid rate limiting issues.
 */
async function main() {
  // Initialize spinner for user feedback
  const spinner = ora('Loading environment...').start();

  let env: ScriptEnv;

  // Load environment variables based on NODE_ENV
  try {
    env = loadScriptEnv();
    spinner.succeed('Environment loaded (' + env.NODE_ENV + ' mode)');
  } catch (error) {
    spinner.fail('Failed to load environment: ' + (error as Error).message);
    process.exit(1);
  }

  // Initialize Supabase client with service role key for database operations
  spinner.start('Creating Supabase client...');
  const supabase = createSupabaseClient(env);
  spinner.succeed('Supabase client created');

  // Fetch data from Google Sheets - gets raw posts, mapped posts, tags and categories
  spinner.start('Pulling data from Google Sheets...');
  let rawPosts: Array<{ identifier: string; tags: string[]; category: string }>,
    posts: DbPost[],
    tags: DbTag[],
    categories: DbCategory[];
  try {
    const sheetData = await sheetToJson(env, 'kabir-ke-dohe');
    // Extract identifier, tags, and category for mapping later
    rawPosts = sheetData.rawPosts.map((p) => ({ identifier: p.identifier, tags: p.tags, category: p.category }));
    posts = sheetData.posts;
    tags = sheetData.tags;
    categories = sheetData.categories;
    spinner.succeed(
      'Pulled '
        + posts.length
        + ' posts, '
        + tags.length
        + ' tags, and '
        + categories.length
        + ' categories from Google Sheets'
    );
  } catch (error) {
    spinner.fail('Failed to pull sheet data: ' + (error as Error).message);
    process.exit(1);
  }

  // Cache category results for quick lookups
  // Maps slug -> { id, slug } for quick lookups
  const categoryCache = new Map<string, { id: string; slug: string }>();

  // Sync categories in batches of 500 to avoid rate limiting
  spinner.start('Syncing categories to database...');

  try {
    for (let i = 0; i < categories.length; i += BATCH_SIZE) {
      const batch = categories.slice(i, i + BATCH_SIZE);
      const uniqueCategories = batch.filter((cat, index, self) => index === self.findIndex((c) => c.slug === cat.slug));

      const result = await upsertCategories(supabase, uniqueCategories);

      // Cache all categories from this batch
      if (result.data) {
        for (const category of result.data) {
          categoryCache.set(category.slug, category);
        }
      }

      spinner.text = 'Syncing categories: ' + Math.min(i + BATCH_SIZE, categories.length) + '/' + categories.length;
    }
    spinner.succeed('Synced ' + categories.length + ' categories');
  } catch (error) {
    spinner.fail('Failed to sync categories: ' + (error as Error).message);
    process.exit(1);
  }

  // Update posts with category_id from cache
  for (const post of posts) {
    const rawPost = rawPosts.find((r) => r.identifier === post.identifier);
    if (rawPost?.category) {
      const categorySlug = sanitizeTitle(rawPost.category);
      const categoryData = categoryCache.get(categorySlug);
      if (categoryData) {
        post.category_id = categoryData.id;
      }
    }
  }

  // Cache tag results to avoid re-fetching during post processing
  // Maps slug -> { id, slug } for quick lookups
  const tagCache = new Map<string, { id: string; slug: string }>();

  // Sync tags in batches of 500 to avoid rate limiting
  spinner.start('Syncing tags to database...');

  try {
    for (let i = 0; i < tags.length; i += BATCH_SIZE) {
      const batch = tags.slice(i, i + BATCH_SIZE);
      // Remove duplicate tags by slug
      const uniqueTags = batch.filter((tag, index, self) => index === self.findIndex((t) => t.slug === tag.slug));

      const result = await upsertTags(supabase, uniqueTags);

      // Cache all tags from this batch
      if (result.data) {
        for (const tag of result.data) {
          tagCache.set(tag.slug, tag);
        }
      }

      spinner.text = 'Syncing tags: ' + Math.min(i + BATCH_SIZE, tags.length) + '/' + tags.length;
    }
    spinner.succeed('Synced ' + tags.length + ' tags');
  } catch (error) {
    spinner.fail('Failed to sync tags: ' + (error as Error).message);
    process.exit(1);
  }

  // Sync posts and their tag mappings in batches of 500
  spinner.start('Syncing posts and post-tags...');
  let mappingsCount = 0;

  try {
    for (let i = 0; i < posts.length; i += BATCH_SIZE) {
      const batch = posts.slice(i, i + BATCH_SIZE);
      const rawBatch = rawPosts.slice(i, i + BATCH_SIZE);

      // Upsert all posts in batch
      const postsResult = await upsertPosts(supabase, batch);

      // Build mappings for all posts in batch
      const mappings: Array<{ post_id: string; tag_id: string }> = [];
      const seenMappings = new Set<string>();

      if (postsResult.data) {
        for (let j = 0; j < postsResult.data.length; j++) {
          const postData = postsResult.data[j];
          const rawPost = rawBatch[j];

          if (rawPost.tags && rawPost.tags.length > 0) {
            for (const tagName of rawPost.tags) {
              const slug = sanitizeTitle(tagName);
              const tagData = tagCache.get(slug);

              if (tagData) {
                const key = postData.id + ':' + tagData.id;
                if (!seenMappings.has(key)) {
                  seenMappings.add(key);
                  mappings.push({ post_id: postData.id, tag_id: tagData.id });
                }
              }
            }
          }
        }
      }

      // Remove duplicate mappings and upsert
      if (mappings.length > 0) {
        const uniqueMappings = mappings.filter((mapping, index, self) => {
          const key = mapping.post_id + ':' + mapping.tag_id;
          return index === self.findIndex((m) => m.post_id + ':' + m.tag_id === key);
        });

        await upsertPostTags(supabase, uniqueMappings);
        mappingsCount += uniqueMappings.length;
      }

      spinner.text = `Syncing posts: ${Math.min(i + BATCH_SIZE, posts.length)}/${posts.length} (${mappingsCount} mappings)`;
    }
    spinner.succeed('Synced ' + posts.length + ' posts with ' + mappingsCount + ' post-tag mappings');
  } catch (error) {
    spinner.fail('Failed to sync posts: ' + (error as Error).message);
    process.exit(1);
  }

  ora('Sync completed successfully!').succeed();
}

// Execute the main function and handle any uncaught errors
main().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
