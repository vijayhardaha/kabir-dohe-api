/**
 * Defines the standardized successful API response envelope carrying typed response payloads.
 */
export interface ApiSuccess<T> {
	success: true;
	data: T;
}

/**
 * Defines the standardized error API response envelope for predictable client handling.
 */
export interface ApiError {
	code: number;
	error: string;
}
