/**
 * Retrieves the base URL based on the environment variables.
 *
 * @returns {string} The base URL.
 */
export const getBaseUrl = (): string => {
	const url =
		process.env.VERCEL_PROJECT_PRODUCTION_URL
		|| process.env.VERCEL_BRANCH_URL
		|| process.env.VERCEL_URL
		|| `http://localhost:${process.env.PORT || 3000}`;

	return url.startsWith("http://") || url.startsWith("https://")
		? url.replace(/\/$/, "")
		: `https://${url.replace(/\/$/, "")}`;
};
