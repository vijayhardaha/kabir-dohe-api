/**
 * Interface for the API query parameters.
 */
export interface ApiQueryParam {
  name: string;
  type: 'string' | 'boolean' | 'number';
  description: string;
  default: string;
}

/**
 * Query parameters for the Kabir Ke Dohe API
 */
export const API_QUERY_PARAMS: ApiQueryParam[] = [
  {
    name: 'search_query',
    type: 'string',
    description: 'Perform a keyword search across available content.',
    default: '',
  },
  {
    name: 'search_content',
    type: 'boolean',
    description: 'When true, extends search to include interpretations and analysis; defaults to primary text only.',
    default: 'false',
  },
  { name: 'tags', type: 'string', description: 'Filter results by a comma-separated list of tag slugs.', default: '' },
  { name: 'category', type: 'string', description: 'Filter results by a single category slug.', default: '' },
  {
    name: 'is_popular',
    type: 'boolean',
    description: 'Filter results to show only popular entries (true/false).',
    default: 'false',
  },
  {
    name: 'is_featured',
    type: 'boolean',
    description: 'Filter results to show only featured entries (true/false).',
    default: 'false',
  },
  {
    name: 'sort_by',
    type: 'string',
    description:
      'Specify the field for ordering results. Supported: number, is_popular, is_featured, text_en, text_hi.',
    default: 'number',
  },
  {
    name: 'sort_order',
    type: 'string',
    description: 'Direction of sorted results: "asc" (ascending) or "desc" (descending).',
    default: 'asc',
  },
  {
    name: 'page',
    type: 'number',
    description: 'The page index for paginated results (positive integer).',
    default: '1',
  },
  {
    name: 'per_page',
    type: 'number',
    description: 'The maximum number of records to return per request.',
    default: '10',
  },
  {
    name: 'pagination',
    type: 'boolean',
    description: 'Toggle the inclusion of pagination metadata in the response object.',
    default: 'true',
  },
];
