import { JWT } from "google-auth-library";

import { env } from "@/lib/env/server";
import { ApiError } from "@/lib/utils/api";

/**
 * Creates a Google service-account JWT client for secure server-side Sheets API authentication.
 *
 * @returns {JWT} Configured JWT client authorized for spreadsheet read and write operations.
 * @throws {ApiError} Throws when service account configuration is missing or malformed.
 * @example
 * const jwtClient = createJwtClient();
 * // Pass jwtClient into GoogleSpreadsheet constructor.
 * @example
 * const doc = new GoogleSpreadsheet(sheetId, createJwtClient());
 * // doc can authenticate requests with service account credentials.
 */
export const createJwtClient = (): JWT => {
	const base64ServiceAccount = env.GOOGLE_SERVICE_ACCOUNT_BASE64;

	if (!base64ServiceAccount) {
		throw new ApiError("Service account not configured", 500);
	}

	// Decode the secret once so JSON credentials can be validated structurally.
	const decodedJson = Buffer.from(base64ServiceAccount, "base64").toString("utf8");
	const serviceAccount = JSON.parse(decodedJson);
	const { client_email, private_key } = serviceAccount;

	// Ensure mandatory keys exist before creating signed JWT assertions.
	if (!client_email || !private_key) {
		throw new ApiError("Invalid service account credentials", 500);
	}

	return new JWT({
		email: client_email,
		key: private_key,
		scopes: ["https://www.googleapis.com/auth/spreadsheets"],
	});
};
