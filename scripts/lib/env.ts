import path from 'path';

import dotenv from 'dotenv';
import { z } from 'zod';

/**
 * Zod schema for validating environment variables required by the sync script.
 */
const scriptEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  SUPABASE_URL: z.url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  GOOGLE_SERVICE_ACCOUNT_BASE64: z.string().min(1),
  GOOGLE_SHEET_ID: z.string().min(1),
});

/**
 * Type representing the validated environment variables for the sync script.
 */
export type ScriptEnv = z.infer<typeof scriptEnvSchema>;

/**
 * Determines the appropriate environment file path based on NODE_ENV.
 *
 * @returns {string} Absolute path to the environment file.
 */
function getEnvFilePath(): string {
  const nodeEnv = process.env.NODE_ENV || 'development';
  return path.resolve(process.cwd(), nodeEnv === 'production' ? '.env.production' : '.env.local');
}

/**
 * Loads environment variables from the appropriate .env file and validates them.
 *
 * @returns {ScriptEnv} Validated environment variables.
 */
export function loadScriptEnv(): ScriptEnv {
  const envFilePath = getEnvFilePath();
  dotenv.config({ path: envFilePath });

  const parsed = scriptEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    const validationError = z.treeifyError(parsed.error);
    throw new Error('Invalid environment variables: ' + JSON.stringify(validationError));
  }

  return parsed.data;
}
