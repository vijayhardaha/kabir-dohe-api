/**
 * ApiError class to represent errors in the API
 */
export class ApiError extends Error {
	public statusCode: number;
	public isOperational: boolean;

	/**
	 * @param message - error message
	 * @param statusCode - http status code
	 * @param isOperational - whether error is expected
	 */
	constructor(message: string, statusCode = 500, isOperational = true) {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = isOperational;

		Error.captureStackTrace(this, this.constructor);
	}
}
