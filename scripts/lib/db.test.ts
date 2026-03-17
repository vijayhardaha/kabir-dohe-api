/**
 * Unit tests for database operations.
 * @package vitest
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
  upsertPost,
  upsertTag,
  upsertPostTag,
  upsertPosts,
  upsertTags,
  upsertPostTags,
  type DbPost,
  type DbTag,
  type PostTagMapping,
} from './db';

// Mock Supabase client for single record operations
const createMockClient = (response: { data: unknown; error: unknown | null }) => ({
  from: vi.fn(() => ({
    upsert: vi.fn(() => ({
      select: vi.fn(() => ({ single: vi.fn(() => Promise.resolve({ data: response.data, error: response.error })) })),
    })),
  })),
});

// Mock Supabase client for batch operations
const createBatchMockClient = (response: { data: unknown[]; error: unknown | null; count: number | null }) => ({
  from: vi.fn(() => ({
    upsert: vi.fn(() => ({
      select: vi.fn(() => Promise.resolve({ data: response.data, error: response.error, count: response.count })),
    })),
  })),
});

// Test suite for database operations
describe('db', () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Tests for upsertPost function
  describe('upsertPost', () => {
    // Verify successful post upsert returns id and identifier
    it('should upsert a single post and return its id and identifier', async () => {
      const mockClient = createMockClient({ data: { id: 'test-id', identifier: 'K001' }, error: null });

      const post: DbPost = {
        slug: 'test-slug',
        identifier: 'K001',
        text_hi: 'Hindi text',
        text_en: 'English text',
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
        is_popular: false,
        is_featured: false,
      };

      const result = await upsertPost(mockClient as never, post);

      // Assert the expected outcome for this scenario.
      expect(result).toEqual({ id: 'test-id', identifier: 'K001' });
    });

    // Verify error handling when upsert fails
    it('should throw error when upsert fails', async () => {
      const mockClient = createMockClient({ data: null, error: { message: 'Database error' } });

      const post: DbPost = {
        slug: 'test-slug',
        identifier: 'K001',
        text_hi: 'Hindi text',
        text_en: 'English text',
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
        is_popular: false,
        is_featured: false,
      };

      // Assert the expected outcome for this scenario.
      await expect(upsertPost(mockClient as never, post)).rejects.toThrow('Failed to upsert post K001: Database error');
    });
  });

  // Tests for upsertTag function
  describe('upsertTag', () => {
    // Verify successful tag upsert returns id and slug
    it('should upsert a single tag and return its id and slug', async () => {
      const mockClient = createMockClient({ data: { id: 'test-id', slug: 'devotion' }, error: null });

      const tag: DbTag = { name: 'Devotion', slug: 'devotion' };

      const result = await upsertTag(mockClient as never, tag);

      // Assert the expected outcome for this scenario.
      expect(result).toEqual({ id: 'test-id', slug: 'devotion' });
    });

    // Verify error handling when tag upsert fails
    it('should throw error when upsert fails', async () => {
      const mockClient = createMockClient({ data: null, error: { message: 'Tag error' } });

      const tag: DbTag = { name: 'Devotion', slug: 'devotion' };

      // Assert the expected outcome for this scenario.
      await expect(upsertTag(mockClient as never, tag)).rejects.toThrow('Failed to upsert tag Devotion: Tag error');
    });
  });

  // Tests for upsertPostTag function
  describe('upsertPostTag', () => {
    // Verify successful post-tag mapping upsert
    it('should upsert a post-tag mapping', async () => {
      const mockClient = createMockClient({ data: { post_id: 'post-uuid', tag_id: 'tag-uuid' }, error: null });

      const mapping: PostTagMapping = { post_id: 'post-uuid', tag_id: 'tag-uuid' };

      // Assert the expected outcome for this scenario.
      await expect(upsertPostTag(mockClient as never, mapping)).resolves.not.toThrow();
    });

    // Verify error handling when mapping upsert fails
    it('should throw error when upsert fails', async () => {
      const mockClient = createMockClient({ data: null, error: { message: 'Mapping error' } });

      const mapping: PostTagMapping = { post_id: 'post-uuid', tag_id: 'tag-uuid' };

      // Assert the expected outcome for this scenario.
      await expect(upsertPostTag(mockClient as never, mapping)).rejects.toThrow(
        'Failed to upsert post_tag mapping: Mapping error'
      );
    });
  });

  // Tests for upsertPosts batch function
  describe('upsertPosts', () => {
    // Verify successful batch posts upsert
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
          is_popular: false,
          is_featured: false,
        },
        {
          slug: 'slug-2',
          identifier: 'K002',
          text_hi: 'Hindi 2',
          text_en: 'English 2',
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
          is_popular: false,
          is_featured: false,
        },
      ];

      const result = await upsertPosts(mockClient as never, posts);

      expect(result.data).toHaveLength(2);
      expect(result.count).toBe(2);
    });

    // Verify error handling when batch upsert fails
    it('should throw error when batch upsert fails', async () => {
      const mockClient = createBatchMockClient({ data: null, error: { message: 'Batch error' }, count: null });

      const posts: DbPost[] = [
        {
          slug: 'slug-1',
          identifier: 'K001',
          text_hi: 'Hindi',
          text_en: 'English',
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
          is_popular: false,
          is_featured: false,
        },
      ];

      await expect(upsertPosts(mockClient as never, posts)).rejects.toThrow('Failed to upsert posts: Batch error');
    });
  });

  // Tests for upsertTags batch function
  describe('upsertTags', () => {
    // Verify successful batch tags upsert
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

    // Verify error handling when batch tag upsert fails
    it('should throw error when batch tag upsert fails', async () => {
      const mockClient = createBatchMockClient({ data: null, error: { message: 'Tag batch error' }, count: null });

      const tags: DbTag[] = [{ name: 'Devotion', slug: 'devotion' }];

      await expect(upsertTags(mockClient as never, tags)).rejects.toThrow('Failed to upsert tags: Tag batch error');
    });
  });

  // Tests for upsertPostTags batch function
  describe('upsertPostTags', () => {
    // Verify successful batch mappings upsert
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

    // Verify error handling when batch mapping upsert fails
    it('should throw error when batch mapping upsert fails', async () => {
      const mockClient = createBatchMockClient({ data: null, error: { message: 'Mapping batch error' }, count: null });

      const mappings: PostTagMapping[] = [{ post_id: 'post-1', tag_id: 'tag-1' }];

      await expect(upsertPostTags(mockClient as never, mappings)).rejects.toThrow(
        'Failed to upsert post_tags: Mapping batch error'
      );
    });
  });
});
