export interface DbRawCouplet {
	couplet_number: number;
	couplet_order: number;
	couplet_code: string;
	slug: string;
	hindi_text: string;
	english_text: string;
	hindi_translation: string;
	english_translation: string;
	hindi_explanation: string;
	english_explanation: string;
	is_popular: boolean;
	is_featured: boolean;
	tags: string[];
}

export interface DbCouplet {
	couplet_number: number;
	couplet_order: number;
	couplet_code: string;
	slug: string;
	hindi_text: string;
	english_text: string;
	hindi_translation: string;
	english_translation: string;
	hindi_explanation: string;
	english_explanation: string;
	is_popular: boolean;
	is_featured: boolean;
}

export interface DbTag {
	slug: string;
	name: string;
}

export interface DbCoupletTag {
	couplet_id: string;
	tag_id: string;
}
