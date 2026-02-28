/**
 * Defines types related to cookies used in API routes.
 * This includes the structure for cookies that can be set in API responses.
 */
export type CookieToSet = { name: string; value: string; options?: Record<string, unknown> };
