import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

import { env } from '@/lib/server/env/server';

/**
 * Creates a new Supabase client instance using environment variables.
 * Client is created lazily to support Edge Runtime.
 *
 * @returns A new Supabase client instance
 */
function getSupabaseClient(): SupabaseClient {
  return createClient(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_DEFAULT_KEY);
}

/**
 * Cached Supabase client instance, initialized on first use.
 */
let supabaseClient: SupabaseClient | null = null;

/**
 * A shared Supabase client for public (unauthenticated) server-side usage.
 * Uses a Proxy to lazily initialize the client on first request,
 * which is required for Edge Runtime compatibility.
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
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!supabaseClient) {
      supabaseClient = getSupabaseClient();
    }
    return supabaseClient[prop as keyof SupabaseClient];
  },
});
