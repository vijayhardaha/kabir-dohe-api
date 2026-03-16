import { SheetData } from '@/lib/server/integrations/gsheet';
import { ApiError } from '@/lib/server/utils';
import { findDuplicates } from '@/lib/server/utils/array/duplicates';
import { sanitizeTitle } from '@/lib/server/utils/string';

/**
 * Represents a normalized tag row with a canonical slug and display name.
 */
export type DbTag = { slug: string; name: string };

/**
 * Extracts, normalizes, and validates unique tags from spreadsheet rows for database insertion.
 *
 * @param {SheetData} data - Spreadsheet rows containing user-entered tag arrays per couplet.
 * @returns {DbTag[]} Unique tag rows with sanitized slugs and original display names.
 * @example
 * prepareDbTags([{ tags: [" Love ", "Nature"] }, { tags: ["nature", "Peace"] }] as SheetData);
 * // [{ slug: "love", name: "Love" }, { slug: "nature", name: "Nature" }, { slug: "peace", name: "Peace" }]
 * @example
 * prepareDbTags([{ tags: [""] }] as SheetData);
 * // []
 */
export function prepareDbTags(data: SheetData): DbTag[] {
  const seenSlugs = new Set();
  const uniqueTags = data
    // Flatten all tag arrays into a single list for normalization.
    .flatMap((row) => row.tags)
    // Ignore blank values to avoid storing meaningless tag records.
    .filter(Boolean)
    // Trim user input so accidental spacing does not change uniqueness.
    .map((tag) => tag.trim())
    .filter((tag) => {
      // Deduplicate by slug instead of display text to prevent semantic duplicates.
      const slug = sanitizeTitle(tag);
      if (seenSlugs.has(slug)) {
        return false;
      }
      seenSlugs.add(slug);
      return true;
    })
    // Keep output deterministic for stable diffs and predictable inserts.
    .sort((a, b) => a.localeCompare(b))
    .map((tag) => ({ slug: sanitizeTitle(tag), name: tag }));

  // Guard against unexpected mapper regressions before hitting the database.
  const duplicateTags = findDuplicates(uniqueTags.map((t) => t.slug));
  if (duplicateTags.length > 0) {
    throw new ApiError(`Duplicate tags: ${duplicateTags.join(', ')}`, 422);
  }

  return uniqueTags;
}
