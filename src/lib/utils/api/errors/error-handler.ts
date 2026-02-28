import type { NextResponse } from "next/server";

import { ApiError, failure } from "@/lib/utils/api";

/**
 * Handles API route errors consistently and returns standardized JSON failure responses.
 *
 * @param {Error} error - Error instance thrown from route handlers or service layers.
 * @returns {NextResponse} Structured error response with safe message and HTTP status.
 * @example
 * return handleError(new ApiError("Invalid token", 401));
 * // Responds with a typed 401 failure payload.
 */
export function handleError(error: Error): NextResponse {
	// Capture diagnostic fields while avoiding stack traces in production logs.
	console.error("❌ Error:", {
		name: error.name,
		message: error.message,
		stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
	});

	// Operational ApiError instances carry intentional status codes for client responses.
	if (error instanceof ApiError && error.isOperational) {
		return failure(error.message, error.statusCode);
	}

	// Treat generic Error instances as internal failures when no richer type is available.
	if (error.name === "Error" || error.constructor.name === "Error") {
		return failure(
			error.message || "Internal Server Error: Something went wrong. Please try again later.",
			500
		);
	}

	// Emit extra debugging context in non-production to speed up local troubleshooting.
	if (process.env.NODE_ENV !== "production") {
		console.error("UNEXPECTED ERROR:", error);
	}

	// Fallback for non-Error throwables and unknown runtime exception shapes.
	return failure("Unexpected error occurred during sync process", 500);
}
