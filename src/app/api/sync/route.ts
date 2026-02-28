import { NextRequest, NextResponse } from "next/server";

import { env } from "@/lib/env/server";
import { createClient } from "@/lib/db/supabase";
import {
	prepareCoupletsForDb,
	prepareTagsForDb,
	transformSheetToDb,
	uniqueMappings,
	upsertCouplets,
	upsertCoupletTags,
	upsertTags,
} from "@/lib/db/upsert";
import { sheetToJson } from "@/lib/integrations/gsheet";
import { ApiError, handleError, success } from "@/lib/utils/api";
import { generateHash, sanitizeTitle } from "@/lib/utils/string";

/**
 * GET handler
 *
 * Checks passkey, syncs couplets from Google Sheets to Supabase.
 *
 * @param request - incoming request
 * @returns JSON status
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
	// main logic
	try {
		// get passkey
		const { searchParams } = new URL(request.url);
		const passkey = searchParams.get("passkey");

		// require passkey
		if (!passkey) {
			throw new ApiError("Passkey required", 400);
		}

		// check passkey
		const hashedPasskey = generateHash(passkey);
		if (hashedPasskey !== env.SUPABASE_PASSKEY_HASH) {
			throw new ApiError("Unauthorized", 401);
		}

		// pull sheet
		const sheetJson = await sheetToJson("kabir-ke-dohe");

		return success({ message: "Sheet fetched successfully", data: sheetJson });

		// ensure array
		if (!Array.isArray(sheetJson)) {
			throw new ApiError("Unexpected data format", 400);
		}

		// convert to raw db format
		const rawCouplets = transformSheetToDb(sheetJson);

		// require data
		if (!rawCouplets || rawCouplets.length <= 0) {
			throw new ApiError("No couplets found", 400);
		}

		// build db payloads
		const dbCouplets = prepareCoupletsForDb(rawCouplets);
		const dbTags = prepareTagsForDb(rawCouplets);

		// supabase client
		const supabase = await createClient({
			global: { headers: { "x-hash-key": hashedPasskey } },
		});

		// ensure client
		if (!supabase) {
			throw new ApiError("Supabase error", 500);
		}

		// summary
		let message = "";

		// upsert couplets
		const { data: coupletsData, count: coupletsCount } = await upsertCouplets(
			supabase,
			dbCouplets
		);

		// append to summary
		message += `Upserted ${coupletsCount ?? 0} couplets.`;

		// upsert tags
		if (coupletsCount && coupletsCount > 0 && dbTags.length > 0) {
			const { data: tagsData, count: tagsCount } = await upsertTags(supabase, dbTags);
			message += ` Upserted ${tagsCount} tags.`;

			// Map couplets to tags by creating entries in the join table that links couplets and tags based on their IDs. This involves finding the corresponding IDs for each couplet and tag, and then upserting those relationships into the database to maintain the many-to-many relationship between couplets and tags.
			const coupletTagMappings: { couplet_id: string; tag_id: string }[] = [];
			for (const couplet of rawCouplets) {
				const coupletId = coupletsData?.find(
					(c: Record<string, string>) => c.couplet_code === couplet.couplet_code
				)?.id;
				if (coupletId) {
					for (const tag of couplet.tags) {
						const tagId = tagsData?.find(
							(t: Record<string, string>) => t.slug === sanitizeTitle(tag)
						)?.id;
						if (tagId) {
							coupletTagMappings.push({ couplet_id: coupletId, tag_id: tagId });
						}
					}
				}
			}

			// filter duplicates
			const uniqueCoupletTagMappings = uniqueMappings(coupletTagMappings);

			if (uniqueCoupletTagMappings.length > 0) {
				const mappingRes = await upsertCoupletTags(supabase, uniqueCoupletTagMappings);
				const mappingCount = mappingRes.count ?? uniqueCoupletTagMappings.length;
				message += ` Upserted ${mappingCount} couplet-tag mappings.`;
			}
		}

		// success response
		return success({ message: message });
	} catch (err) {
		// standardize errors
		return handleError(err instanceof Error ? err : new Error("Sync failed")) as NextResponse;
	}
}
