/**
 * Unit tests for database operations.
 * @package vitest
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
  upsertPosts,
  upsertTags,
  upsertCategories,
  upsertPostTags,
  type DbPost,
  type DbTag,
  type DbCategory,
  type PostTagMapping,
} from './db';

// Mock Supabase client for batch operations
const createBatchMockClient = (response: { data: unknown[] | null; error: unknown | null; count: number | null }) => ({
  from: vi.fn(() => ({
    upsert: vi.fn(() => ({
      select: vi.fn(() => Promise.resolve({ data: response.data, error: response.error, count: response.count })),
    })),
  })),
});

// Test suite for database operations
describe('db', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Tests for upsertPosts batch function
  describe('upsertPosts', () => {
    it('should upsert multiple posts and return data and count', async () => {
      const mockClient = createBatchMockClient({
        data: [
          { id: 'id-1', identifier: 'K001' },
          { id: 'id-2', identifier: 'K002' },
        ],
        error: null,
        count: 2,
      });

      const posts: DbPost[] = [
        {
          slug: 'slug-1',
          identifier: 'K001',
          text_hi: 'Hindi 1',
          text_en: 'English 1',
          meaning_hi: 'Meaning 1',
          meaning_en: 'Meaning 1 EN',
          interpretation_hi: '',
          interpretation_en: '',
          philosophical_analysis_hi: '',
          philosophical_analysis_en: '',
          practical_example_hi: '',
          practical_example_en: '',
          practice_guidance_hi: '',
          practice_guidance_en: '',
          core_message_hi: '',
          core_message_en: '',
          reflection_questions_hi: '',
          reflection_questions_en: '',
          post_number: 1,
          post_order: 1,
          post_status: 'publish',
          is_popular: false,
          is_featured: false,
        },
        {
          slug: 'slug-2',
          identifier: 'K002',
          text_hi: 'Hindi 2',
          text_en: 'English 2',
          meaning_hi: 'Meaning 2',
          meaning_en: 'Meaning 2 EN',
          interpretation_hi: '',
          interpretation_en: '',
          philosophical_analysis_hi: '',
          philosophical_analysis_en: '',
          practical_example_hi: '',
          practical_example_en: '',
          practice_guidance_hi: '',
          practice_guidance_en: '',
          core_message_hi: '',
          core_message_en: '',
          reflection_questions_hi: '',
          reflection_questions_en: '',
          post_number: 2,
          post_order: 2,
          post_status: 'publish',
          is_popular: false,
          is_featured: false,
        },
      ];

      const result = await upsertPosts(mockClient as never, posts);

      expect(result.data).toHaveLength(2);
      expect(result.count).toBe(2);
    });

    it('should throw error when batch upsert fails', async () => {
      const mockClient = createBatchMockClient({ data: [], error: { message: 'Batch error' }, count: null });

      const posts: DbPost[] = [
        {
          slug: 'slug-1',
          identifier: 'K001',
          text_hi: 'Hindi',
          text_en: 'English',
          meaning_hi: 'Meaning 1',
          meaning_en: 'Meaning 1 EN',
          interpretation_hi: '',
          interpretation_en: '',
          philosophical_analysis_hi: '',
          philosophical_analysis_en: '',
          practical_example_hi: '',
          practical_example_en: '',
          practice_guidance_hi: '',
          practice_guidance_en: '',
          core_message_hi: '',
          core_message_en: '',
          reflection_questions_hi: '',
          reflection_questions_en: '',
          post_number: 1,
          post_order: 1,
          post_status: 'publish',
          is_popular: false,
          is_featured: false,
        },
      ];

      await expect(upsertPosts(mockClient as never, posts)).rejects.toThrow('Failed to upsert posts: Batch error');
    });
  });

  // Tests for upsertTags batch function
  describe('upsertTags', () => {
    it('should upsert multiple tags and return data and count', async () => {
      const mockClient = createBatchMockClient({
        data: [
          { id: 'id-1', slug: 'devotion' },
          { id: 'id-2', slug: 'wisdom' },
        ],
        error: null,
        count: 2,
      });

      const tags: DbTag[] = [
        { name: 'Devotion', slug: 'devotion' },
        { name: 'Wisdom', slug: 'wisdom' },
      ];

      const result = await upsertTags(mockClient as never, tags);

      expect(result.data).toHaveLength(2);
      expect(result.count).toBe(2);
    });

    it('should throw error when batch tag upsert fails', async () => {
      const mockClient = createBatchMockClient({ data: [], error: { message: 'Tag batch error' }, count: null });

      const tags: DbTag[] = [{ name: 'Devotion', slug: 'devotion' }];

      await expect(upsertTags(mockClient as never, tags)).rejects.toThrow('Failed to upsert tags: Tag batch error');
    });
  });

  // Tests for upsertCategories batch function
  describe('upsertCategories', () => {
    it('should upsert multiple categories and return data and count', async () => {
      const mockClient = createBatchMockClient({
        data: [
          { id: 'id-1', slug: 'philosophy' },
          { id: 'id-2', slug: 'spirituality' },
        ],
        error: null,
        count: 2,
      });

      const categories: DbCategory[] = [
        { name: 'Philosophy', slug: 'philosophy' },
        { name: 'Spirituality', slug: 'spirituality' },
      ];

      const result = await upsertCategories(mockClient as never, categories);

      expect(result.data).toHaveLength(2);
      expect(result.count).toBe(2);
    });

    it('should throw error when batch category upsert fails', async () => {
      const mockClient = createBatchMockClient({ data: [], error: { message: 'Category batch error' }, count: null });

      const categories: DbCategory[] = [{ name: 'Philosophy', slug: 'philosophy' }];

      await expect(upsertCategories(mockClient as never, categories)).rejects.toThrow(
        'Failed to upsert categories: Category batch error'
      );
    });
  });

  // Tests for upsertPostTags batch function
  describe('upsertPostTags', () => {
    it('should upsert multiple post-tag mappings and return data and count', async () => {
      const mockClient = createBatchMockClient({
        data: [
          { post_id: 'post-1', tag_id: 'tag-1' },
          { post_id: 'post-1', tag_id: 'tag-2' },
        ],
        error: null,
        count: 2,
      });

      const mappings: PostTagMapping[] = [
        { post_id: 'post-1', tag_id: 'tag-1' },
        { post_id: 'post-1', tag_id: 'tag-2' },
      ];

      const result = await upsertPostTags(mockClient as never, mappings);

      expect(result.data).toHaveLength(2);
      expect(result.count).toBe(2);
    });

    it('should throw error when batch mapping upsert fails', async () => {
      const mockClient = createBatchMockClient({ data: [], error: { message: 'Mapping batch error' }, count: null });

      const mappings: PostTagMapping[] = [{ post_id: 'post-1', tag_id: 'tag-1' }];

      await expect(upsertPostTags(mockClient as never, mappings)).rejects.toThrow(
        'Failed to upsert post_tags: Mapping batch error'
      );
    });
  });
});
