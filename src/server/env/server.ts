import { z } from 'zod';

// Guard against accidental client-side imports of this server-only module, which would expose secrets and cause runtime errors.
if (typeof window !== 'undefined') {
  throw new Error('Server env imported in client bundle');
}

/**
 * Defines and validates required server-only environment variables used by Supabase and Google integrations.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),

  SUPABASE_URL: z.url(),
  SUPABASE_PUBLISHABLE_DEFAULT_KEY: z.string().min(1),
  SUPABASE_PASSKEY_HASH: z.string().min(1),

  GOOGLE_SERVICE_ACCOUNT_BASE64: z.string().min(1),
  GOOGLE_SHEET_ID: z.string().min(1),
});

/**
 * Parses process environment values once and stores a typed validation result.
 */
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // Fail fast during startup so misconfiguration never reaches runtime handlers.
  console.error('Invalid environment variables');
  // Print a structured error tree to make invalid keys immediately obvious.
  console.error(z.treeifyError(parsed.error));
  process.exit(1);
}

/**
 * Exposes validated server environment values as a trusted configuration source.
 */
export const env = parsed.data;
