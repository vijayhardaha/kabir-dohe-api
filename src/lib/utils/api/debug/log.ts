/**
 * Logs informational messages during development while suppressing output in production environments.
 *
 * @param {unknown} message - Value to print for debugging context and request tracing.
 * @returns {void} No value is returned after logging.
 * @example
 * logInfo({ route: "/api/couplets", status: "started" });
 * // Prints prefixed info payload in non-production environments.
 */
export function logInfo(message: unknown) {
	if (process.env.NODE_ENV !== "production") {
		// Keep noisy logs out of production to protect signal quality and performance.
		console.log("[INFO]", message);
	}
}

/**
 * Logs error details during development while avoiding verbose output in production environments.
 *
 * @param {unknown} message - Error payload or message object captured from failing code paths.
 * @returns {void} No value is returned after logging.
 * @example
 * logError(new Error("Validation failed"));
 * // Prints prefixed error payload in non-production environments.
 */
export function logError(message: unknown) {
	if (process.env.NODE_ENV !== "production") {
		// Limit error log emission in production to avoid leaking internal state.
		console.error("[ERROR]", message);
	}
}
