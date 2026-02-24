import { ICouplet } from "./couplet";

/**
 * Interface for a Paginated Result.
 */
export interface PaginatedResult {
	couplets: ICouplet[];
	total: number;
	totalPages: number;
	page: number;
	perPage: number;
	pagination: boolean;
}
