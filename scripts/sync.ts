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

import { upsertPost, upsertTag, upsertPostTag, type DbPost, type DbTag } from './lib/db';
import { loadScriptEnv, type ScriptEnv } from './lib/env';
import { sheetToJson } from './lib/gsheet';
import { createSupabaseClient } from './lib/supabase';

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

  // Fetch data from Google Sheets - gets raw posts, mapped posts, and tags
  spinner.start('Pulling data from Google Sheets...');
  let rawPosts: Array<{ identifier: string; tags: string[] }>, posts: DbPost[], tags: DbTag[];
  try {
    const sheetData = await sheetToJson(env, 'kabir-ke-dohe');
    // Extract just the identifier and tags for mapping later
    rawPosts = sheetData.rawPosts.map((p) => ({ identifier: p.identifier, tags: p.tags }));
    posts = sheetData.posts;
    tags = sheetData.tags;
    spinner.succeed('Pulled ' + posts.length + ' posts and ' + tags.length + ' tags from Google Sheets');
  } catch (error) {
    spinner.fail('Failed to pull sheet data: ' + (error as Error).message);
    process.exit(1);
  }

  // Cache tag results to avoid re-fetching during post processing
  // Maps slug -> { id, slug } for quick lookups
  const tagCache = new Map<string, { id: string; slug: string }>();

  // Sync tags in batches to avoid rate limiting
  // Using batch size of 50 to balance speed and reliability
  spinner.start('Syncing tags to database...');
  const tagsBatchSize = 50;

  try {
    for (let i = 0; i < tags.length; i += tagsBatchSize) {
      const batch = tags.slice(i, i + tagsBatchSize);
      // Process batch in parallel for better performance
      await Promise.all(
        batch.map(async (tag) => {
          const result = await upsertTag(supabase, tag);
          tagCache.set(tag.slug, result);
        })
      );
      spinner.text = 'Syncing tags: ' + Math.min(i + tagsBatchSize, tags.length) + '/' + tags.length;
    }
    spinner.succeed('Synced ' + tags.length + ' tags');
  } catch (error) {
    spinner.fail('Failed to sync tags: ' + (error as Error).message);
    process.exit(1);
  }

  // Sync posts and their tag mappings in batches
  // Each post is linked to its tags via the post_tags junction table
  spinner.start('Syncing posts and post-tags...');
  const postsBatchSize = 50;
  let mappingsCount = 0;

  try {
    for (let i = 0; i < posts.length; i += postsBatchSize) {
      const batch = posts.slice(i, i + postsBatchSize);
      await Promise.all(
        batch.map(async (post, batchIndex) => {
          // Get the corresponding raw post to access its tags
          const rawPost = rawPosts[i + batchIndex];

          // Insert or update the post in the database
          const postResult = await upsertPost(supabase, post);

          // Link tags to the post if tags exist
          if (rawPost.tags && rawPost.tags.length > 0) {
            for (const tagName of rawPost.tags) {
              // Convert tag name to slug using existing utility
              const slug = sanitizeTitle(tagName);
              const tagResult = tagCache.get(slug);

              if (tagResult) {
                // Create the post-tag relationship
                await upsertPostTag(supabase, { post_id: postResult.id, tag_id: tagResult.id });
                mappingsCount++;
              }
            }
          }

          return postResult;
        })
      );
      spinner.text = `Syncing posts: ${Math.min(i + postsBatchSize, posts.length)}/${posts.length} (${mappingsCount} mappings)`;
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
