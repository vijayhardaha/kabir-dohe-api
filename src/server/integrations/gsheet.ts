import { GoogleSpreadsheet } from 'google-spreadsheet';
import { z } from 'zod';

import { DbPost, prepareDbPosts } from '@/server/db/mappings/post.mapper';
import { DbTag, prepareDbTags } from '@/server/db/mappings/tag.mapper';
import { env } from '@/server/env/server';
import { ApiError, logError } from '@/server/lib';
import { sanitizeTitle, toSentenceCase } from '@/server/lib/string';

import { createJwtClient } from './jwt.client';

// Normalize mixed spreadsheet cell values into a strongly typed row shape.
const SheetRowSchema = z
  .object({
    post_number: z.preprocess(
      (v) => (typeof v === 'string' && v.trim() !== '' ? Number(v) : v),
      z.number().min(1, { message: 'Post number must be a positive integer' })
    ),
    post_order: z.preprocess(
      (v) => (typeof v === 'string' && v.trim() !== '' ? Number(v) : v),
      z.number().min(1, { message: 'Post order must be a positive integer' })
    ),
    identifier: z.string().min(1, { message: 'Identifier is required' }),
    text_hi: z.string().min(1, { message: 'Hindi text is required' }),
    text_en: z.string().min(1, { message: 'English text is required' }),
    interpretation_hi: z.string().optional().default(''),
    interpretation_en: z.string().optional().default(''),
    philosophical_analysis_hi: z.string().optional().default(''),
    philosophical_analysis_en: z.string().optional().default(''),
    practical_example_hi: z.string().optional().default(''),
    practical_example_en: z.string().optional().default(''),
    practice_guidance_hi: z.string().optional().default(''),
    practice_guidance_en: z.string().optional().default(''),
    core_message_hi: z.string().optional().default(''),
    core_message_en: z.string().optional().default(''),
    reflection_questions_hi: z.string().optional().default(''),
    reflection_questions_en: z.string().optional().default(''),
    tags: z.preprocess(
      (v) => (typeof v === 'string' && v.trim() !== '' ? v.trim().split(',') : []),
      z.array(z.string()).optional().default([])
    ),
    is_popular: z.preprocess((v) => {
      if (typeof v === 'string') {
        const lower = v.trim().toLowerCase();
        if (['yes', 'true', '1'].includes(lower)) return true;
        return false;
      }
      return Boolean(v);
    }, z.boolean()),
    is_featured: z.preprocess((v) => {
      if (typeof v === 'string') {
        const lower = v.trim().toLowerCase();
        if (['yes', 'true', '1'].includes(lower)) return true;
        return false;
      }
      return Boolean(v);
    }, z.boolean()),
  })
  .transform((obj) => ({
    ...obj,
    // Build stable slugs using english text fragments plus canonical identifier.
    slug: [sanitizeTitle(obj.text_en).split('-').slice(0, 5).join('-'), obj.identifier.replace(/^cc-/gi, '').trim()]
      .join('-')
      .toLowerCase(),
    // Standardize tag names for deterministic display and deduplication behavior.
    tags: obj.tags.map((t) => toSentenceCase(t.trim().replace(/'/g, "'").replace(/[-_]/g, ' '))),
  }));

/**
 * Represents one validated spreadsheet row after normalization and transformation rules are applied.
 */
export type SheetRow = z.infer<typeof SheetRowSchema>;

// Validate the complete worksheet payload as a list of transformed rows.
const SheetSchema = z.array(SheetRowSchema);

/**
 * Represents validated worksheet data used for downstream database mapping and synchronization.
 */
export type SheetData = z.infer<typeof SheetSchema>;

/**
 * Fetches, validates, and transforms spreadsheet rows into database-ready post and tag collections.
 *
 * @param {string} sheetName - Worksheet title to load from the configured Google Spreadsheet.
 * @returns {Promise<{ rawPosts: SheetRow[]; posts: DbPost[]; tags: DbTag[] }>} Prepared post and tag arrays for persistence workflows.
 * @throws {ApiError} Throws when configuration, worksheet loading, or validation steps fail.
 * @example
 * const { posts, tags } = await sheetToJson("kabir-ke-dohe");
 * // posts and tags are validated and normalized for database insertion.
 * @example
 * await sheetToJson("missing-sheet");
 * // Throws ApiError with status 404 when the sheet title does not exist.
 */
export async function sheetToJson(
  sheetName: string
): Promise<{ rawPosts: SheetRow[]; posts: DbPost[]; tags: DbTag[] }> {
  const GOOGLE_SHEET_ID = env.GOOGLE_SHEET_ID;

  if (!GOOGLE_SHEET_ID) {
    throw new ApiError('Spreadsheet ID not configured', 500);
  }

  const jwtClient = createJwtClient();
  const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID, jwtClient);

  try {
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle[sheetName];
    if (!sheet) {
      throw new ApiError(`Sheet not found: ${sheetName}`, 404);
    }

    const rows = await sheet.getRows();
    const data: Record<string, string>[] = rows.map((row) => row.toObject());

    const parsedData = SheetSchema.safeParse(data);
    if (!parsedData.success) {
      logError('Sheet data validation failed');
      logError(z.treeifyError(parsedData.error));
      throw new ApiError('Sheet data validation failed', 422);
    }

    const rawPosts = parsedData.data;
    const posts = prepareDbPosts(rawPosts);
    if (posts.length === 0) {
      throw new ApiError('No valid posts found in sheet data', 400);
    }

    const tags = prepareDbTags(rawPosts);

    return { rawPosts, posts, tags };
  } catch (error) {
    logError((error as Error)?.message ?? error);
    throw new ApiError('Failed to fetch or process sheet data.', 500);
  }
}
