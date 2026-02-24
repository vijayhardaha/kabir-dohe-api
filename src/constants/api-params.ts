/**
 * Interface for the API query parameters.
 */
export interface ApiQueryParam {
	name: string;
	type: "string" | "boolean" | "number";
	description: string;
	defaultValue: string | boolean | number;
	possibleValues: string;
}

/**
 * Query parameters for the Kabir Ke Dohe API
 */
export const API_QUERY_PARAMS: ApiQueryParam[] = [
	{
		name: "s",
		type: "string",
		description: "Search term",
		defaultValue: "",
		possibleValues: "Any text",
	},
	{
		name: "exactMatch",
		type: "boolean",
		description: "Whether to use exact match for search",
		defaultValue: "false",
		possibleValues: "true, false",
	},
	{
		name: "searchWithin",
		type: "string",
		description: "Fields to search within (comma-separated list)",
		defaultValue: "all",
		possibleValues: "all, couplet, translation, explanation",
	},
	{
		name: "tags",
		type: "string",
		description: "Tags to filter by (comma-separated list of tags)",
		defaultValue: "",
		possibleValues: "Any valid tag names",
	},
	{
		name: "popular",
		type: "boolean",
		description: "Whether to filter by popularity",
		defaultValue: "false",
		possibleValues: "true, false",
	},
	{
		name: "orderBy",
		type: "string",
		description: "Field to sort by",
		defaultValue: "id",
		possibleValues: "id, random, popular, couplet_english, couplet_hindi",
	},
	{
		name: "order",
		type: "string",
		description: "Sort order",
		defaultValue: "ASC",
		possibleValues: "ASC, DESC",
	},
	{
		name: "page",
		type: "number",
		description: "Current page number",
		defaultValue: "1",
		possibleValues: "Any positive integer",
	},
	{
		name: "perPage",
		type: "number",
		description: "Number of items per page",
		defaultValue: "10",
		possibleValues: "Any positive integer",
	},
	{
		name: "pagination",
		type: "boolean",
		description: "Whether to include pagination info",
		defaultValue: "true",
		possibleValues: "true, false",
	},
];
