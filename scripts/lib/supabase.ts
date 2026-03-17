import { createClient, SupabaseClient } from '@supabase/supabase-js';

import type { ScriptEnv } from './env';

/**
 * Creates a Supabase client using the service role key for script execution.
 *
 * @param {ScriptEnv} env - Validated environment variables containing Supabase credentials.
 * @returns {SupabaseClient} A Supabase client configured with service role key.
 * @example
 * const supabase = createSupabaseClient(env);
 * const { data } = await supabase.from('posts').select('*');
 */
export function createSupabaseClient(env: ScriptEnv): SupabaseClient {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
}
