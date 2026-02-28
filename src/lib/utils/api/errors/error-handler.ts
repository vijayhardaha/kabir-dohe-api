import type { NextResponse } from "next/server";

import { ApiError, failure } from "@/lib/utils/api";

/**
 * Centralized error handler for API routes.
 * Logs the error and returns a structured JSON response with appropriate status code.
 *
 * @param {Error} error - The error object thrown in the API route
 * @returns {NextResponse} JSON response with error message and status code
 */
export function handleError(error: Error): NextResponse {
	// Log full error for debugging (but don’t leak internals)
	console.error("❌ Error:", {
		name: error.name,
		message: error.message,
		stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
	});

	// If it's an instance of ApiError and is operational, return its message and status code
	if (error instanceof ApiError && error.isOperational) {
		return failure(error.message, error.statusCode);
	}

	// If it's an unexpected error (e.g., TypeError, unhandled promise), treat as 500
	if (error.name === "Error" || error.constructor.name === "Error") {
		return failure(
			error.message || "Internal Server Error: Something went wrong. Please try again later.",
			500
		);
	}

	// Log full error for debugging (but don’t leak internals in production)
	if (process.env.NODE_ENV !== "production") {
		console.error("UNEXPECTED ERROR:", error);
	}

	// Fallback (e.g., unexpected objects)
	return failure("Unexpected error occurred during sync process", 500);
}
