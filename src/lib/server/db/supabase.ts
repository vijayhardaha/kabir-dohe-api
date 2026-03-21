import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

import { env } from '@/lib/server/env/server';

const supabaseUrl = env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_PUBLISHABLE_DEFAULT_KEY;

/**
 * A shared Supabase client for public (unauthenticated) server-side usage.
 *
 * This client:
 * - Does NOT use cookies or session handling
 * - Is safe for public APIs
 * - Avoids per-request async overhead
 * - Improves performance by reusing the same instance
 *
 * @type {SupabaseClient}
 *
 * @example
 * const { data, error } = await supabase
 *   .from('posts')
 *   .select('text_hi');
 */
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);
