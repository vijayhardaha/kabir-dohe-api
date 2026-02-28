import { NextResponse } from "next/server";

import { ApiSuccess, ApiError } from "@/types/api";

/**
 * Creates a standardized success response payload for consistent API route outputs.
 *
 * @param {T} data - Serialized payload returned to API consumers.
 * @returns {NextResponse} JSON response containing success metadata and provided data.
 * @example
 * return success({ id: "abc", name: "Kabir" });
 */
export function success<T>(data: T): NextResponse {
	return NextResponse.json({ success: true, data } as ApiSuccess<T>, { status: 200 });
}

/**
 * Creates a standardized error response payload for predictable API failure handling.
 *
 * @param {string} message - Human-readable error message safe for clients.
 * @param {number} [status=500] - HTTP status code returned with the failure payload.
 * @returns {NextResponse} JSON response containing error details and status code.
 * @example
 * return failure("Unauthorized request", 401);
 */
export function failure(message: string, status: number = 500): NextResponse {
	return NextResponse.json({ code: status, error: message } as ApiError, { status });
}
