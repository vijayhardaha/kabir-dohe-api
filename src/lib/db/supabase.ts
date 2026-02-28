import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import { env } from "@/lib/env/server";
import { ApiError } from "@/lib/utils/api";
import type { CookieToSet } from "@/types/api";

const supabaseUrl = env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_PUBLISHABLE_DEFAULT_KEY;

/**
 * Creates a server-side Supabase client configured with Next.js cookie adapters for authenticated requests.
 *
 * @param {Record<string, unknown>} [options] - Optional Supabase client options merged with default cookie handlers.
 * @returns {Promise<SupabaseClient>} A Supabase client configured for server execution contexts.
 * @throws {ApiError} Throws when required Supabase environment variables are unavailable.
 * @example
 * const client = await createClient();
 * const { data } = await client.from("couplets").select("id");
 * @example
 * const client = await createClient({ global: { headers: { "x-source": "api" } } });
 * const { error } = await client.from("tags").select("slug");
 */
export async function createClient(options?: Record<string, unknown>): Promise<SupabaseClient> {
	// Validate core credentials early to fail fast before opening cookie context.
	if (!supabaseUrl || !supabaseKey) {
		throw new ApiError("Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_DEFAULT_KEY", 404);
	}

	const cookieStore = await cookies();

	const cookieAdapter = {
		cookies: {
			getAll() {
				return cookieStore.getAll();
			},
			setAll(cookiesToSet: Array<CookieToSet>) {
				try {
					// Apply all cookie mutations so Supabase auth state stays synchronized.
					cookiesToSet.forEach(({ name, value, options }) =>
						cookieStore.set(name, value, options as Record<string, unknown>)
					);
				} catch {
					// Some render-only contexts disallow writes, so reads continue without failing requests.
				}
			},
		},
	};

	const { cookies: _, ...otherOptions } = options || {};
	const finalOptions = { ...otherOptions, cookies: options?.cookies || cookieAdapter.cookies };

	return createServerClient(
		supabaseUrl,
		supabaseKey,
		finalOptions as unknown as Parameters<typeof createServerClient>[2]
	) as SupabaseClient;
}
