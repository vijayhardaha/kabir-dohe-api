import { env } from "@/lib/env/server";

/**
 * Check if the current environment is production
 *
 * @returns {boolean} true if production, false otherwise
 */
function isProduction(): boolean {
	return env.NODE_ENV === "production";
}

/**
 * Check if the current environment is development
 *
 * @returns {boolean} true if development, false otherwise
 */
function isDevelopment(): boolean {
	return env.NODE_ENV === "development";
}

export { isProduction, isDevelopment };
