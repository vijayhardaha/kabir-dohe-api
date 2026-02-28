import { z } from "zod";

if (typeof window !== "undefined") {
	throw new Error("Server env imported in client bundle");
}

/**
 * Environment variable schema
 */
const envSchema = z.object({
	NODE_ENV: z.enum(["development", "production", "test"]),

	SUPABASE_URL: z.url(),
	SUPABASE_PUBLISHABLE_DEFAULT_KEY: z.string().min(1),
	SUPABASE_PASSKEY_HASH: z.string().min(1),

	GOOGLE_SERVICE_ACCOUNT_BASE64: z.string().min(1),
	GOOGLE_SHEET_ID: z.string().min(1),
});

/**
 * Parse and validate environment variables
 */
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
	console.error("Invalid environment variables");
	console.error(z.treeifyError(parsed.error));
	process.exit(1);
}

/**
 * Export validated environment
 */
export const env = parsed.data;
