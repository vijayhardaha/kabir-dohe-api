import type { SheetData } from '@/server/integrations/gsheet';

/**
 * Defines the couplet payload stored in the database without spreadsheet tag arrays.
 */
export type DbCouplet = Omit<SheetData[number], 'tags'>;

/**
 * Transforms spreadsheet rows into database-ready couplet rows by removing tag collections safely.
 *
 * @param {SheetData} data - Spreadsheet rows that include both couplet fields and tags.
 * @returns {DbCouplet[]} Couplet rows ready for insertion without tag metadata.
 * @example
 * prepareDbCouplets([{ id: "1", tags: ["bhakti"], doha: "..." }] as SheetData);
 * // [{ id: "1", doha: "..." }]
 * @example
 * prepareDbCouplets([] as SheetData);
 * // []
 */
export function prepareDbCouplets(data: SheetData): DbCouplet[] {
  // Persist only couplet columns because tags are inserted through separate relation tables.
  return data.map(({ tags, ...rest }) => rest);
}
