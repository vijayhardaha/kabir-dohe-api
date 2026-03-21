import { JWT } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { z } from 'zod';

import { toSentenceCase } from '@/lib/server/utils';

import type { DbCategory, DbPost, DbTag } from './db';
import type { ScriptEnv } from './env';

/**
 * Zod schema for validating a single row from the Google Sheet.
 */
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
    meaning_hi: z.string().optional().default(''),
    meaning_en: z.string().optional().default(''),
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
    category: z.string().optional().default(''),
  })
  .transform((obj) => ({
    ...obj,
    slug: [
      obj.text_en
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .split('-')
        .slice(0, 5)
        .join('-'),
      obj.identifier.replace(/^cc-/gi, '').trim(),
    ]
      .join('-')
      .toLowerCase(),
    tags: obj.tags.map((t) => {
      const cleaned = t.trim().replace(/'/g, "'").replace(/[-_]/g, ' ');
      return toSentenceCase(cleaned);
    }),
    category: obj.category ? toSentenceCase(obj.category.trim()) : '',
  }));

/**
 * Type representing a validated and transformed row from the Google Sheet.
 */
export type SheetRow = z.infer<typeof SheetRowSchema>;

/**
 * Zod schema for validating an array of sheet rows.
 */
const SheetSchema = z.array(SheetRowSchema);

/**
 * Transforms validated sheet rows into database-ready post records.
 *
 * @param {SheetRow[]} rows - The validated sheet rows to transform.
 * @returns {DbPost[]} Array of post records ready for database insertion.
 * @example
 * const posts = prepareDbPosts(sheetData);
 */
function prepareDbPosts(rows: SheetRow[]): DbPost[] {
  return rows.map((row) => ({
    slug: row.slug,
    identifier: row.identifier,
    text_hi: row.text_hi,
    text_en: row.text_en,
    meaning_hi: row.meaning_hi || '',
    meaning_en: row.meaning_en || '',
    interpretation_hi: row.interpretation_hi || '',
    interpretation_en: row.interpretation_en || '',
    philosophical_analysis_hi: row.philosophical_analysis_hi || '',
    philosophical_analysis_en: row.philosophical_analysis_en || '',
    practical_example_hi: row.practical_example_hi || '',
    practical_example_en: row.practical_example_en || '',
    practice_guidance_hi: row.practice_guidance_hi || '',
    practice_guidance_en: row.practice_guidance_en || '',
    core_message_hi: row.core_message_hi || '',
    core_message_en: row.core_message_en || '',
    reflection_questions_hi: row.reflection_questions_hi || '',
    reflection_questions_en: row.reflection_questions_en || '',
    post_number: row.post_number,
    post_order: row.post_order,
    post_status: 'publish',
    is_popular: row.is_popular,
    is_featured: row.is_featured,
  }));
}

/**
 * Extracts unique tags from sheet rows and transforms them into database-ready tag records.
 *
 * @param {SheetRow[]} rows - The validated sheet rows containing tag information.
 * @returns {DbTag[]} Array of unique tag records ready for database insertion.
 * @example
 * const tags = prepareDbTags(sheetData);
 * // tags[0].name -> "Bhakti"
 */
function prepareDbTags(rows: SheetRow[]): DbTag[] {
  const tagSet = new Set<string>();

  for (const row of rows) {
    for (const tag of row.tags) {
      const trimmed = tag.trim();
      if (trimmed) {
        tagSet.add(trimmed);
      }
    }
  }

  const uniqueTags = Array.from(tagSet).sort();

  return uniqueTags.map((name) => ({
    name,
    slug: name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-'),
  }));
}

/**
 * Extracts unique categories from sheet rows and transforms them into database-ready category records.
 *
 * @param {SheetRow[]} rows - The validated sheet rows containing category information.
 * @returns {DbCategory[]} Array of unique category records ready for database insertion.
 */
function prepareDbCategories(rows: SheetRow[]): DbCategory[] {
  const categorySet = new Set<string>();

  for (const row of rows) {
    const category = row.category?.trim();
    if (category) {
      categorySet.add(category);
    }
  }

  const uniqueCategories = Array.from(categorySet).sort();

  return uniqueCategories.map((name) => ({
    name,
    slug: name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-'),
  }));
}

/**
 * Creates a Google JWT client for authenticating with Google Sheets API.
 *
 * @param {ScriptEnv} env - The environment variables containing service account credentials.
 * @returns {JWT} Configured JWT client for Google Sheets API.
 * @throws {Error} Throws when service account credentials are missing or invalid.
 * @example
 * const jwtClient = createJwtClient(env);
 */
function createJwtClient(env: ScriptEnv): JWT {
  const base64ServiceAccount = env.GOOGLE_SERVICE_ACCOUNT_BASE64;

  if (!base64ServiceAccount) {
    throw new Error('Service account not configured');
  }

  const decodedJson = Buffer.from(base64ServiceAccount, 'base64').toString('utf8');
  const serviceAccount = JSON.parse(decodedJson);
  const { client_email, private_key } = serviceAccount;

  if (!client_email || !private_key) {
    throw new Error('Invalid service account credentials');
  }

  return new JWT({ email: client_email, key: private_key, scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
}

/**
 * Fetches, validates, and transforms data from a Google Sheet into database-ready records.
 *
 * @param {ScriptEnv} env - The environment variables containing Google Sheets configuration.
 * @param {string} sheetName - The name of the worksheet to fetch data from.
 * @returns {Promise<{ rawPosts: SheetRow[]; posts: DbPost[]; tags: DbTag[] }>} Raw posts, mapped posts, and tags.
 * @throws {Error} Throws when spreadsheet ID is missing, sheet is not found, or validation fails.
 * @example
 * const { posts, tags } = await sheetToJson(env, "kabir-ke-dohe");
 */
export async function sheetToJson(
  env: ScriptEnv,
  sheetName: string
): Promise<{ rawPosts: SheetRow[]; posts: DbPost[]; tags: DbTag[]; categories: DbCategory[] }> {
  const GOOGLE_SHEET_ID = env.GOOGLE_SHEET_ID;

  if (!GOOGLE_SHEET_ID) {
    throw new Error('Spreadsheet ID not configured');
  }

  const jwtClient = createJwtClient(env);
  const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID, jwtClient);

  await doc.loadInfo();

  const sheet = doc.sheetsByTitle[sheetName];
  if (!sheet) {
    throw new Error('Sheet not found: ' + sheetName);
  }

  const rows = await sheet.getRows();
  const data: Record<string, string>[] = rows.map((row) => row.toObject());

  const parsedData = SheetSchema.safeParse(data);
  if (!parsedData.success) {
    console.error('Sheet data validation failed');
    console.error(z.treeifyError(parsedData.error));
    throw new Error('Sheet data validation failed');
  }

  const rawPosts = parsedData.data;
  const posts = prepareDbPosts(rawPosts);

  if (posts.length === 0) {
    throw new Error('No valid posts found in sheet data');
  }

  const tags = prepareDbTags(rawPosts);
  const categories = prepareDbCategories(rawPosts);

  return { rawPosts, posts, tags, categories };
}
