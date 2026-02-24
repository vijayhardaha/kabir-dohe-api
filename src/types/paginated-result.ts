import { Couplet } from "./couplet";

/**
 * Interface for a Paginated Result.
 */
export interface PaginatedResult {
	couplets: Couplet[];
	total: number;
	totalPages: number;
	page: number;
	perPage: number;
	pagination: boolean;
}
