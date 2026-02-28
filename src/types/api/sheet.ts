/**
 * Spreadsheet data type definitions.
 *
 * @type {Record<string, string>} SheetRowObject - Row as an object keyed by column headers.
 * @type {string[]} SheetRowArray - Row as an array of string values.
 * @type {SheetRowArray[]} SheetMatrix - Matrix of spreadsheet rows.
 */
export type SheetRowObject = Record<string, string>;
export type SheetRowArray = string[];
export type SheetMatrix = SheetRowArray[];

/**
 * Interface for a couplet as stored in the database.
 */
export interface MappedCouplet {
	couplet_number: number;
	couplet_order: number;
	couplet_code: number;
	slug: string;
	hindi_text: string;
	english_text: string;
	hindi_translation: string;
	english_translation: string;
	hindi_explanation: string;
	english_explanation: string;
	is_popular: string;
	is_featured: string;
	tags: string;
}
