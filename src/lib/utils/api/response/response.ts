import { NextResponse } from "next/server";

import { ApiSuccess, ApiError } from "@/types/api";

/**
 * Standard success response
 *
 * @param {T} data - response payload
 */
export function success<T>(data: T): NextResponse {
	return NextResponse.json({ success: true, data } as ApiSuccess<T>, { status: 200 });
}

/**
 * Standard error response
 *
 * @param {string} message - error message
 * @param {number} status - http status code
 */
export function failure(message: string, status: number = 500): NextResponse {
	return NextResponse.json({ code: status, error: message } as ApiError, { status });
}
