/**
 * Represents operational API failures with explicit status codes and safe client-facing messages.
 */
export class ApiError extends Error {
	public statusCode: number;
	public isOperational: boolean;

	/**
	 * Creates a typed API error with operational metadata for centralized response handling.
	 *
	 * @param {string} message - Human-readable error message safe for API responses.
	 * @param {number} [statusCode=500] - HTTP status code associated with the failure.
	 * @param {boolean} [isOperational=true] - Indicates whether this error is expected and handled.
	 * @returns {void} Constructor does not return a value.
	 */
	constructor(message: string, statusCode = 500, isOperational = true) {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = isOperational;

		Error.captureStackTrace(this, this.constructor);
	}
}
