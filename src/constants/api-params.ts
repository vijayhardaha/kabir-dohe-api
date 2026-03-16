/**
 * Interface for the API query parameters.
 */
export interface ApiQueryParam {
  name: string;
  type: 'string' | 'boolean' | 'number';
  description: string;
  defaultValue: string | boolean | number;
  possibleValues: string;
}

/**
 * Query parameters for the Kabir Ke Dohe API
 */
export const API_QUERY_PARAMS: ApiQueryParam[] = [
  { name: 'search', type: 'string', description: 'Search term', defaultValue: '', possibleValues: 'Any text' },
  {
    name: 'search_fields',
    type: 'string',
    description: 'Fields to search within (comma-separated list)',
    defaultValue: 'all',
    possibleValues: 'all, text, interpretation',
  },
  {
    name: 'tags',
    type: 'string',
    description: 'Tags to filter by (comma-separated list of tags)',
    defaultValue: '',
    possibleValues: 'Any valid tag names',
  },
  {
    name: 'is_popular',
    type: 'boolean',
    description: 'Whether to filter by popularity',
    defaultValue: 'false',
    possibleValues: 'true, false',
  },
  {
    name: 'sort_by',
    type: 'string',
    description: 'Field to sort by',
    defaultValue: 'id',
    possibleValues: 'id, is_popular, text_en, text_hi',
  },
  { name: 'sort_order', type: 'string', description: 'Sort order', defaultValue: 'asc', possibleValues: 'asc, desc' },
  {
    name: 'page',
    type: 'number',
    description: 'Current page number',
    defaultValue: '1',
    possibleValues: 'Any positive integer',
  },
  {
    name: 'per_page',
    type: 'number',
    description: 'Number of items per page',
    defaultValue: '10',
    possibleValues: 'Any positive integer',
  },
  {
    name: 'pagination',
    type: 'boolean',
    description: 'Whether to include pagination info',
    defaultValue: 'true',
    possibleValues: 'true, false',
  },
];
