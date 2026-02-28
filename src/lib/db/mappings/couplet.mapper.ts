import type { SheetData } from "@/lib/integrations/gsheet";

// Define database couplet type
export type DbCouplet = Omit<SheetData[number], "tags">;

/**
 * Prepares couplet data for database insertion by separating tags and ensuring proper types.
 *
 * @param {SheetData} data - Array of couplet data with tags included
 * @returns { DbCouplet[]} Array of couplet data formatted for database insertion (tags removed)
 * @example
 * const sheetData: SheetData = [{ couplet_number: 1, tags: ["tag1", "tag2"], ... }];
 * const dbCouplets = prepareDbCouplet(sheetData);
 */
export function prepareDbCouplets(data: SheetData): DbCouplet[] {
	return data.map(({ tags, ...rest }) => rest);
}
