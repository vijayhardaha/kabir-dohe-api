/**
 * ###############################################################################
 * _____           _    _____  _____ _____
 * |  __ \         | |  / ____|/ ____/ ____|
 * | |__) |__  ___ | |_| |    | (___| (___
 * |  ___/ _ \/ __|| __| |     \___ \\___ \
 * | |  | (_) \__ \| |_| |____ ____) |___) |
 * |_|   \___/|___/ \__|\_____|_____/|_____/
 *
 * THE STYLE PROCESSOR
 * ###############################################################################
 * * PURPOSE:
 * Transforms your CSS using JavaScript plugins. It handles the injection of
 * Tailwind CSS and other post-processing tasks.
 * * WORKFLOW:
 * - Local CSS Build: `npx tailwindcss -i ./src/app/globals.css -o ./public/out.css --watch`
 * - Note: Changes to this file require a server restart to take effect.
 * * ###############################################################################
 */

/** @type {import('postcss-load-config').Config} */
const config = {
	// ==========================================
	// 🔌 POSTCSS PLUGINS
	// ==========================================
	plugins: [
		// Using the modern @tailwindcss/postcss plugin for lightning-fast builds
		"@tailwindcss/postcss",

		// Optional: Add 'autoprefixer' here if your target browsers require it
		// "autoprefixer": {},
	],
};

export default config;
