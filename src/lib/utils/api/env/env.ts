import { env } from "@/lib/env/server";

/**
 * Determines whether the current runtime environment is configured for production deployments.
 *
 * @returns {boolean} True when NODE_ENV equals production, otherwise false.
 * @example
 * isProduction(); // true in production builds
 */
function isProduction(): boolean {
	return env.NODE_ENV === "production";
}

/**
 * Determines whether the current runtime environment is configured for local development.
 *
 * @returns {boolean} True when NODE_ENV equals development, otherwise false.
 * @example
 * isDevelopment(); // true while running local development server
 */
function isDevelopment(): boolean {
	return env.NODE_ENV === "development";
}

export { isProduction, isDevelopment };
