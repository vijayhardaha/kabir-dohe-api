import { Tag } from "./tag";

/**
 * Interface representing a couplet.
 */
export interface Couplet {
	id: number;
	unique_slug: string;
	couplet_hindi: string;
	couplet_english: string;
	translation_hindi: string;
	translation_english: string;
	explanation_hindi: string;
	explanation_english: string;
	popular: boolean;
	tags: Tag[];
}
