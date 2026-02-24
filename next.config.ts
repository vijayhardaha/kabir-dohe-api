// @ts-ignore
import type { NextConfig } from "next";

/**
 * ###############################################################################
 * _   _             _      _  _____             _____ _
 * | \ | |           | |    | |/ ____|           / ____(_)
 * |  \| | _____  ___| |_   | | |     ___  _ __ | |     _  __ _
 * | . ` |/ _ \ \/ / | __|  | | |    / _ \| '_ \| |_   | |/ _` |
 * | |\  |  __/>  <| |_| |__| | |___| (_) | | | | |____| | (_| |
 * |_| \_|\___/_/\_\\__|\____/ \_____\___/|_| |_|\_____|_|\__, |
 * __/ |
 * NEXT.JS CORE ENGINE                                     |___/
 * ###############################################################################
 * * PURPOSE:
 * Centralized runtime and build-time configuration for the Next.js framework.
 * * WORKFLOW:
 * - Dev:   `npm run dev`   (Local iteration)
 * - Build: `npm run build` (Production compilation)
 * - Start: `npm run start` (Serve production build)
 * * ###############################################################################
 */

const nextConfig: NextConfig = {
	// ==========================================
	// 🚀 CORE RUNTIME SETTINGS
	// ==========================================
	// Helps identify unsafe lifecycles, legacy API usage, and other bugs
	reactStrictMode: true,

	// ==========================================
	// 🏗️ BUILD OPTIMIZATIONS
	// ==========================================
	// Example: Power-user features (uncomment as needed)
	/* compiler: {
		// Removes console logs in production (except errors)
		removeConsole: process.env.NODE_ENV === "production",
	},
	*/

	// ==========================================
	// 🔐 SECURITY & HEADERS
	// ==========================================
	// Power-user tip: Ensure X-Powered-By header is removed for security
	poweredByHeader: false,
};

export default nextConfig;
