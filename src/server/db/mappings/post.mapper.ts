import type { SheetRow } from '@/server/integrations/gsheet';

/**
 * Defines the post payload stored in the database without spreadsheet tag arrays.
 */
export type DbPost = Omit<SheetRow, 'tags'>;

/**
 * Transforms spreadsheet rows into database-ready post rows by removing tag collections safely.
 *
 * @param {SheetRow[]} data - Spreadsheet rows that include both post fields and tags.
 * @returns {DbPost[]} Post rows ready for insertion without tag metadata.
 * @example
 * prepareDbPosts([{ id: "1", tags: ["bhakti"], text_hi: "..." }] as SheetRow[]);
 * // [{ id: "1", text_hi: "..." }]
 * @example
 * prepareDbPosts([] as SheetRow[]);
 * // []
 */
export function prepareDbPosts(data: SheetRow[]): DbPost[] {
  // Persist only post columns because tags are inserted through separate relation tables.
  return data.map(({ tags, ...rest }) => rest);
}
