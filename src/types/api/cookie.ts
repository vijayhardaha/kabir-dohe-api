/**
 * Represents a cookie mutation payload used when synchronizing auth cookies on responses.
 */
export type CookieToSet = { name: string; value: string; options?: Record<string, unknown> };
