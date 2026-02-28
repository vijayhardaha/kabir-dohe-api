import { GoogleSpreadsheet } from "google-spreadsheet";
import { z } from "zod";

import { env } from "@/lib/env/server";
import { ApiError, logError } from "@/lib/utils/api";
import { sanitizeTitle, toSentenceCase } from "@/lib/utils/string";

import { createJwtClient } from "./jwt.client";

// Define Zod schemas sheet row
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
		slug: [
			sanitizeTitle(obj.english_text).split("-").slice(0, 5).join("-"),
			obj.couplet_code.replace(/^cc-/gi, "").trim(),
		]
			.join("-")
			.toLowerCase(),
		tags: obj.tags.map((t) =>
			toSentenceCase(t.trim().replace(/’/g, "'").replace(/[-_]/g, " "))
		),
	}));
export type SheetRow = z.infer<typeof SheetRowSchema>;

// Define Zod schema for entire sheet (array of rows)
const SheetSchema = z.array(SheetRowSchema);
export type SheetData = z.infer<typeof SheetSchema>;

/**
 * Fetch sheet rows from Google Sheets and map to JSON objects.
 *
 * @param sheetName - Title of the sheet to fetch
 * @returns Array of mapped row objects (empty array on failure)
 */
export async function sheetToJson(sheetName: string): Promise<SheetRow[]> {
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

		return parsedData.data as SheetData;
	} catch (error) {
		logError((error as Error)?.message ?? error);
		throw new ApiError("Failed to fetch or process sheet data.", 500);
	}
}
