import type { SupabaseClient } from "@supabase/supabase-js";

import type { DbCouplet, DbCoupletTag, DbRawCouplet, DbTag } from "@/types/api/db";
import type { SheetRowObject } from "@/types/api/sheet";
import { ApiError } from "@/lib/utils/api";
import { findDuplicates } from "@/lib/utils/array/duplicates";
import { normalizeWhitespace, sanitizeTitle, stringToNumber, toSentenceCase } from "@/lib/utils/string";

/**
 * Into database-ready couplet objects.
 *
 * @param {SheetRowObject[]} sheetData - Array of raw spreadsheet rows
 * @returns {DbRawCouplet[]} Array of normalized couplet objects ready for database insertion
 * @example
 * const sheetRows = [{ couplet_number: "1", couplet_order: "1", english_text: "Hello World", ... }];
 * const dbRecords = mapSheetToDbFormat(sheetRows);
 */
export function transformSheetToDb(sheetData: SheetRowObject[]): DbRawCouplet[] {
	const data = sheetData.map((row: SheetRowObject) => ({
		couplet_number: stringToNumber(row.couplet_number),
		couplet_order: stringToNumber(row.couplet_order),
		couplet_code: normalizeWhitespace(row.couplet_code.toUpperCase()),
		slug: sanitizeTitle(normalizeWhitespace(row.english_text)),
		hindi_text: normalizeWhitespace(row.hindi_text),
		english_text: normalizeWhitespace(row.english_text),
		hindi_translation: row.hindi_translation.trim(),
		hindi_explanation: row.hindi_explanation.trim(),
		english_translation: row.english_translation.trim(),
		english_explanation: row.english_explanation.trim(),
		is_popular: row.popular.toLowerCase() === "yes" || false,
		is_featured: row.featured.toLowerCase() === "yes" || false,
		tags:
			row.tags
				.trim()
				.split(",")
				.map((t) => toSentenceCase(t.trim().replace("/’/g", "'"))) ?? [],
	}));

	const duplicateCodes = findDuplicates(data.map((c) => c.couplet_code));
	if (duplicateCodes.length > 0) {
		throw new ApiError(`Duplicate couplet codes: ${duplicateCodes.join(", ")}`, 422);
	}

	const duplicateSlugs = findDuplicates(data.map((c) => c.slug));
	if (duplicateSlugs.length > 0) {
		throw new ApiError(`Duplicate slugs: ${duplicateSlugs.join(", ")}`, 422);
	}

	return data;
}

/**
 * Transforms raw couplets data into database-ready format with proper types.
 *
 * @param {DbRawCouplet[]} couplets - Array of raw couplet objects from spreadsheet
 * @returns {DbCouplet[]} Array of type-cast couplet objects ready for database insertion
 * @example
 * const rawCouplets = [{ couplet_number: "1", couplet_order: "1", is_popular: "true", ... }];
 * const dbCouplets = prepareCoupletsForDb(rawCouplets);
 */
export function prepareCoupletsForDb(couplets: DbCouplet[]): DbCouplet[] {
	return couplets.map((couplet) => ({
		couplet_number: Number(couplet.couplet_number),
		couplet_order: Number(couplet.couplet_order),
		couplet_code: String(couplet.couplet_code),
		slug: String(couplet.slug),
		hindi_text: String(couplet.hindi_text),
		english_text: String(couplet.english_text),
		hindi_translation: String(couplet.hindi_translation),
		hindi_explanation: String(couplet.hindi_explanation),
		english_translation: String(couplet.english_translation),
		english_explanation: String(couplet.english_explanation),
		is_popular: Boolean(couplet.is_popular),
		is_featured: Boolean(couplet.is_featured),
	}));
}

/**
 * Extracts unique tags from couplets and prepares them for database insertion.
 *
 * @param {DbRawCouplet[]} couplets - Array of couplet objects containing tags
 * @returns {DbTag[]} Array of tag objects with slug and name
 * @example
 * const couplets = [
 *   { tags: ["love", "nature"] },
 *   { tags: ["nature", "peace"] }
 * ];
 * const dbTags = prepareTagsForDb(couplets);
 * // Returns: [{ slug: "love", name: "love" }, { slug: "nature", name: "nature" }, { slug: "peace", name: "peace" }]
 */
export function prepareTagsForDb(couplets: DbRawCouplet[]): DbTag[] {
	const seenSlugs = new Set();
	const uniqueTags = couplets
		.flatMap((c) => c.tags)
		.filter(Boolean)
		.filter((tag) => {
			const slug = sanitizeTitle(tag);
			if (seenSlugs.has(slug)) return false;
			seenSlugs.add(slug);
			return true;
		})
		.sort((a, b) => a.localeCompare(b))
		.map((tag) => ({ slug: sanitizeTitle(tag), name: tag }));

	const duplicateTags = findDuplicates(uniqueTags.map((t) => t.slug));
	if (duplicateTags.length > 0) {
		throw new ApiError(`Duplicate tags: ${duplicateTags.join(", ")}`, 422);
	}

	return uniqueTags;
}

export async function upsertCouplets(supabase: SupabaseClient, dbCouplets: DbCouplet[]) {
	const { data, error, count } = await supabase
		.from("couplets")
		.upsert(dbCouplets, { onConflict: "couplet_code", count: "exact" })
		.select("id, couplet_code");

	if (error) {
		throw new ApiError("Failed to upsert couplets", 500);
	}

	return { data, count };
}

export async function upsertTags(supabase: SupabaseClient, dbTags: DbTag[]) {
	const { data, error, count } = await supabase
		.from("tags")
		.upsert(dbTags, { onConflict: "slug", count: "exact" })
		.select("id, slug");

	if (error) {
		throw new ApiError("Failed to upsert tags", 500);
	}

	return { data, count };
}

export async function upsertCoupletTags(supabase: SupabaseClient, mappings: DbCoupletTag[]) {
	const { data, error, count } = await supabase
		.from("couplet_tags")
		.upsert(mappings, { onConflict: "couplet_id,tag_id", count: "exact" })
		.select("couplet_id, tag_id");

	if (error) {
		throw new ApiError("Failed to upsert couplet-tag mappings", 500);
	}

	return { data, count };
}

export function uniqueMappings(mappings: DbCoupletTag[]) {
	const seen = new Set<string>();
	return mappings.filter(({ couplet_id, tag_id }) => {
		const key = `${String(couplet_id)}|${String(tag_id)}`;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}
