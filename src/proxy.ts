import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * CORS headers for the couplets API endpoints.
 */
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

/**
 * Middleware to add CORS headers to couplets API responses.
 *
 * @param {NextRequest} request - The incoming request object.
 * @returns {NextResponse} The response with CORS headers attached.
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (request.nextUrl.pathname.startsWith('/api/couplets')) {
    for (const [key, value] of Object.entries(CORS_HEADERS)) {
      response.headers.set(key, value);
    }
  }

  return response;
}

/**
 * Route matcher configuration for the middleware.
 */
export const config = { matcher: '/api/couplets/:path*' };
