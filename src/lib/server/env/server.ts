import { z } from 'zod';

/**
 * Guard against accidental client-side imports of this server-only module,
 * which would expose secrets and cause runtime errors.
 */
if (typeof window !== 'undefined') {
  throw new Error('Server env imported in client bundle');
}

/**
 * Defines and validates required server-only environment variables
 * used by Supabase and Google integrations.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),

  SUPABASE_URL: z.url(),
  SUPABASE_PUBLISHABLE_DEFAULT_KEY: z.string().min(1),
});

/**
 * Parses and validates environment variables at runtime.
 * Throws if any required variables are missing or invalid.
 *
 * @returns Validated environment variables
 * @throws Error if environment variables are invalid
 */
function getEnv(): z.infer<typeof envSchema> {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const issues = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
    throw new Error(`Invalid environment variables: ${issues}`);
  }

  return result.data;
}

/**
 * Exposes validated server environment values as a trusted configuration source.
 * Uses lazy evaluation to support Edge Runtime where env vars are only available at request time.
 *
 * @example
 * const supabaseUrl = env.SUPABASE_URL;
 */
export const env = {
  get SUPABASE_URL(): string {
    return getEnv().SUPABASE_URL;
  },
  get SUPABASE_PUBLISHABLE_DEFAULT_KEY(): string {
    return getEnv().SUPABASE_PUBLISHABLE_DEFAULT_KEY;
  },
  get NODE_ENV(): string {
    return getEnv().NODE_ENV;
  },
};
