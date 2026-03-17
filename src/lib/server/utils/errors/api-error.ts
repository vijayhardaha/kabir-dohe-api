/**
 * Custom error class for operational errors that should be communicated to the client.
 * These are expected errors that we intentionally throw in our application code.
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  /**
   * Creates a new ApiError instance.
   *
   * @param message - Human-readable error message for the client.
   * @param statusCode - HTTP status code to return (e.g., 400, 404, 500).
   */
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.isOperational = true;

    Object.setPrototypeOf(this, ApiError.prototype);

    Error.captureStackTrace(this, this.constructor);
  }
}
