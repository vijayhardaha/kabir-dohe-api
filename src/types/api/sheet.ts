/**
 * Defines core spreadsheet row representations used while parsing sheet ingestion payloads.
 */
export type SheetRowObject = Record<string, string>;
export type SheetRowArray = string[];
export type SheetMatrix = SheetRowArray[];

/**
 * Describes a transformed couplet record shape derived from spreadsheet ingestion rows.
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
