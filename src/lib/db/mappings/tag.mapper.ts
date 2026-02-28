import { SheetData } from "@/lib/integrations/gsheet";
import { sanitizeTitle } from "@/lib/utils/string";

// Define database tag type
export type DbTag = { slug: string; name: string };

/**
 * Prepares tag data for database insertion by extracting unique tags from the sheet data and ensuring proper formatting.
 *
 * @param {SheetData} data - Array of couplet data with tags included
 * @returns {DbTag[]} Array of tag data formatted for database insertion (unique tags with slug and name)
 * @example
 * const sheetData: SheetData = [
 *   { tags: ["love", "nature"] },
 *   { tags: ["nature", "peace"] }
 * ];
 * const dbTags = prepareDbTags(sheetData);
 * // Returns: [{ slug: "love", name: "love" }, { slug: "nature", name: "nature" }, { slug: "peace", name: "peace" }]
 */
export function prepareDbTags(data: SheetData): DbTag[] {
	const seenSlugs = new Set();
	const uniqueTags = data
		.flatMap((row) => row.tags) // Extract tags from each couplet
		.filter(Boolean) // Remove empty or falsy tags
		.map((tag) => tag.trim()) // Trim whitespace from tags
		.filter((tag) => {
			// Ensure uniqueness based on slug
			const slug = sanitizeTitle(tag);
			if (seenSlugs.has(slug)) {
				return false;
			}
			seenSlugs.add(slug);
			return true;
		})
		.sort((a, b) => a.localeCompare(b)) // Sort tags alphabetically
		.map((tag) => ({ slug: sanitizeTitle(tag), name: tag })); // Map to DbTag format

	return uniqueTags;
}
