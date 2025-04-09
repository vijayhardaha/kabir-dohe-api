/**
 * Rate limiter module for API request throttling
 * Uses Supabase to store and check rate limits based on IP addresses
 * @module rateLimiter
 */
import crypto from "crypto";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const DEFAULT_RATE_LIMIT = 60;
const DEFAULT_WINDOW_MINUTES = 1;

/**
 * Encodes an IP address using SHA-256 for privacy and security
 *
 * @param {string} ip - The IP address to encode
 * @returns {string} A SHA-256 hash of the IP address with a salt
 */
const encodeIpAddress = (ip) => {
  // Use a salt to make the hash more secure
  const salt = process.env.IP_HASH_SALT || "default-salt-value";
  return crypto
    .createHash("sha256")
    .update(ip + salt)
    .digest("hex");
};

/**
 * Checks if a request is within rate limits
 *
 * @param {Object} options - Rate limit check options
 * @param {string} options.ip - The IP address making the request
 * @param {string} options.endpoint - The API endpoint being accessed
 * @param {number} [options.limit=DEFAULT_RATE_LIMIT] - Maximum number of requests allowed in the time window
 * @param {number} [options.windowMinutes=DEFAULT_WINDOW_MINUTES] - Time window in minutes
 * @returns {Promise<{allowed: boolean}>} Object indicating if the request is allowed
 */
export async function checkRateLimit({
  ip,
  endpoint,
  limit = DEFAULT_RATE_LIMIT,
  windowMinutes = DEFAULT_WINDOW_MINUTES,
}) {
  const now = new Date();
  const encodedIp = encodeIpAddress(ip);

  const { data, error } = await supabase
    .from("rate_limits")
    .select("*")
    .eq("ip_address", encodedIp)
    .eq("endpoint", endpoint)
    .maybeSingle();

  if (error) {
    console.error("Rate limit check error:", error);
    return { allowed: false }; // Fails open if Supabase has an issue
  }

  if (data) {
    const diff = (now.getTime() - new Date(data.timestamp).getTime()) / 1000 / 60;

    if (diff < windowMinutes) {
      if (data.count >= limit) {
        return { allowed: false };
      }

      await supabase
        .from("rate_limits")
        .update({ count: data.count + 1 })
        .eq("id", data.id);
    } else {
      await supabase.from("rate_limits").update({ count: 1, timestamp: now }).eq("id", data.id);
    }
  } else {
    await supabase.from("rate_limits").insert({
      ip_address: encodedIp,
      endpoint,
      count: 1,
      timestamp: now,
    });
  }

  return { allowed: true };
}
