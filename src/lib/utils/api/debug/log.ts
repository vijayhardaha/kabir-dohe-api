/**
 * Log info message
 */
export function logInfo(message: unknown) {
	if (process.env.NODE_ENV !== "production") {
		console.log("[INFO]", message);
	}
}

/**
 * Log error message
 */
export function logError(message: unknown) {
	if (process.env.NODE_ENV !== "production") {
		console.error("[ERROR]", message);
	}
}
