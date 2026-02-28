import { GoogleSpreadsheet } from "google-spreadsheet";
import { z } from "zod";

import { DbCouplet, prepareDbCouplets } from "@/lib/db/mappings/couplet.mapper";
import { DbTag, prepareDbTags } from "@/lib/db/mappings/tag.mapper";
import { env } from "@/lib/env/server";
import { ApiError, logError } from "@/lib/utils/api";
import { sanitizeTitle, toSentenceCase } from "@/lib/utils/string";

import { createJwtClient } from "./jwt.client";

// Normalize mixed spreadsheet cell values into a strongly typed row shape.
const SheetRowSchema = z
	.object({
		couplet_number: z.preprocess(
			(v) => (typeof v === "string" && v.trim() !== "" ? Number(v) : v),
			z.number().min(1, { message: "Couplet number must be a positive integer" })
		),
		couplet_order: z.preprocess(
			(v) => (typeof v === "string" && v.trim() !== "" ? Number(v) : v),
			z.number().min(1, { message: "Couplet order must be a positive integer" })
		),
		couplet_code: z.string().min(1, { message: "Couplet code is required" }),
		hindi_text: z.string().min(1, { message: "Hindi text is required" }),
		english_text: z.string().min(1, { message: "Hindi text is required" }),
		hindi_translation: z.string().optional().default(""),
		english_translation: z.string().optional().default(""),
		hindi_explanation: z.string().optional().default(""),
		english_explanation: z.string().optional().default(""),
		tags: z.preprocess(
			(v) => (typeof v === "string" && v.trim() !== "" ? v.trim().split(",") : []),
			z.array(z.string()).optional().default([])
		),
		popular: z.preprocess((v) => {
			if (typeof v === "string") {
				const lower = v.trim().toLowerCase();
				if (["yes", "true", "1"].includes(lower)) return true;
				return false;
			}
			return Boolean(v);
		}, z.boolean()),
		featured: z.preprocess((v) => {
			if (typeof v === "string") {
				const lower = v.trim().toLowerCase();
				if (["yes", "true", "1"].includes(lower)) return true;
				return false;
			}
			return Boolean(v);
		}, z.boolean()),
	})
	.transform((obj) => ({
		...obj,
		// Build stable slugs using english text fragments plus canonical couplet code.
		slug: [
			sanitizeTitle(obj.english_text).split("-").slice(0, 5).join("-"),
			obj.couplet_code.replace(/^cc-/gi, "").trim(),
		]
			.join("-")
			.toLowerCase(),
		// Standardize tag names for deterministic display and deduplication behavior.
		tags: obj.tags.map((t) =>
			toSentenceCase(t.trim().replace(/’/g, "'").replace(/[-_]/g, " "))
		),
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
 * Fetches, validates, and transforms spreadsheet rows into database-ready couplet and tag collections.
 *
 * @param {string} sheetName - Worksheet title to load from the configured Google Spreadsheet.
 * @returns {Promise<{ couplets: DbCouplet[]; tags: DbTag[] }>} Prepared couplet and tag arrays for persistence workflows.
 * @throws {ApiError} Throws when configuration, worksheet loading, or validation steps fail.
 * @example
 * const { couplets, tags } = await sheetToJson("couplets");
 * // couplets and tags are validated and normalized for database insertion.
 * @example
 * await sheetToJson("missing-sheet");
 * // Throws ApiError with status 404 when the sheet title does not exist.
 */
export async function sheetToJson(
	sheetName: string
): Promise<{ couplets: DbCouplet[]; tags: DbTag[] }> {
	const GOOGLE_SHEET_ID = env.GOOGLE_SHEET_ID;

	if (!GOOGLE_SHEET_ID) {
		throw new ApiError("Spreadsheet ID not configured", 500);
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
			logError("Sheet data validation failed");
			logError(z.treeifyError(parsedData.error));
			throw new ApiError("Sheet data validation failed", 422);
		}

		const rawData = parsedData.data;
		const couplets = prepareDbCouplets(rawData);
		const tags = prepareDbTags(rawData);

		return { couplets, tags };
	} catch (error) {
		logError((error as Error)?.message ?? error);
		throw new ApiError("Failed to fetch or process sheet data.", 500);
	}
}
