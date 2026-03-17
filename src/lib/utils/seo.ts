/**
 * Return a normalized base URL for the running application.
 *
 * Preference order:
 * 1. `process.env.VERCEL_PROJECT_PRODUCTION_URL`
 * 2. `process.env.VERCEL_BRANCH_URL`
 * 3. `process.env.VERCEL_URL`
 * 4. Fallback to `http://localhost:{PORT}` where PORT defaults to 3000
 *
 * Normalization ensures a scheme is present and removes a trailing slash.
 *
 * @returns {string} The normalized base URL.
 *
 * @example
 * // When no Vercel env vars are set and PORT is 3000
 * getBaseUrl() // -> 'http://localhost:3000'
 */
export const getBaseUrl = (): string => {
  const url =
    process.env.VERCEL_PROJECT_PRODUCTION_URL
    || process.env.VERCEL_BRANCH_URL
    || process.env.VERCEL_URL
    || `http://localhost:${process.env.PORT || 3000}`;

  const cleaned = url.trim().replace(/\/+$/, '');

  return /^https?:\/\//i.test(cleaned) ? cleaned : `https://${cleaned}`;
};

/**
 * Normalizes a slug for canonical usage.
 *
 * - Removes leading and trailing slashes
 * - Returns empty string for root
 *
 * @param {string} [slug=""] - The input path or slug.
 * @returns {string} A clean relative path without leading slash.
 *
 * @example
 * safeCanonical("about")      // "about"
 * safeCanonical("/about")     // "about"
 * safeCanonical("/about/")    // "about"
 * safeCanonical("")           // ""
 * safeCanonical("/")          // ""
 */
export const safeCanonical = (slug: string = ''): string => {
  return slug.trim().replace(/^\/+/, '').replace(/\/+$/, '');
};

/**
 * Generates a fully qualified canonical URL.
 *
 * Combines the application's base URL with a normalized slug.
 * Leading and trailing slashes in the slug are handled safely.
 * If no slug is provided, the base URL is returned.
 *
 * @param {string} [slug=""] - Optional path segment to append to the base URL.
 * @returns {string} The canonical absolute URL.
 *
 * @example
 * // Assuming getBaseUrl() returns "https://example.com"
 * getCanonicalUrl("about") 	// → "https://example.com/about"
 * getCanonicalUrl("/about") 	// → "https://example.com/about"
 * getCanonicalUrl("/about/") 	// → "https://example.com/about"
 * getCanonicalUrl("") 			// → "https://example.com"
 * getCanonicalUrl("/") 		// → "https://example.com"
 */
export const getCanonicalUrl = (slug: string = ''): string => {
  return [getBaseUrl(), safeCanonical(slug)].filter(Boolean).join('/');
};
