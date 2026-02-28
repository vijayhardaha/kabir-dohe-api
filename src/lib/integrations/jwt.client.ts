import { JWT } from "google-auth-library";

import { env } from "@/lib/env/server";
import { ApiError } from "@/lib/utils/api";

/**
 * Creates a JWT client for authenticating with Google Sheets API using a service account.
 * The service account credentials are expected to be provided as a base64-encoded JSON string in the environment variable `GOOGLE_SERVICE_ACCOUNT_BASE64`.
 * @returns {JWT} - The JWT client instance.
 */
export const createJwtClient = (): JWT => {
	const base64ServiceAccount = env.GOOGLE_SERVICE_ACCOUNT_BASE64;

	if (!base64ServiceAccount) {
		throw new ApiError("Service account not configured", 500);
	}

	const decodedJson = Buffer.from(base64ServiceAccount, "base64").toString("utf8");
	const serviceAccount = JSON.parse(decodedJson);
	const { client_email, private_key } = serviceAccount;

	if (!client_email || !private_key) {
		throw new ApiError("Invalid service account credentials", 500);
	}

	return new JWT({
		email: client_email,
		key: private_key,
		scopes: ["https://www.googleapis.com/auth/spreadsheets"],
	});
};
