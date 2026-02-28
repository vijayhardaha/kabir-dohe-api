/**
 * Interface of API success response
 */
export interface ApiSuccess<T> {
	success: true;
	data: T;
}

/**
 * Interface of API error response
 */
export interface ApiError {
	code: number;
	error: string;
}
