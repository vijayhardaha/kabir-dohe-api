/**
 * ###############################################################################
 * _____ _ _                             _____             _____ _
 * / ____(_) |                           / ____|           / ____(_)
 * | (___  _| |_ ___ _ __ ___   __ _ _ __ | |     ___  _ __ | |     _  __ _
 * \___ \| | __/ _ \ '_ ` _ \ / _` | '_ \| |    / _ \| '_ \| |_   | |/ _` |
 * ____) | | ||  __/ | | | | | (_| | |_) | |___| (_) | | | | |____| | (_| |
 * |_____/|_|\__\___|_| |_| |_|\__,_| .__/ \_____\___/|_| |_|\_____|_|\__, |
 * | |                                __/ |
 * SEO & SITEMAP ARCHITECT          |_|                               |___/
 * ###############################################################################
 * * PURPOSE:
 * Automates the generation of sitemaps and robots.txt to ensure search
 * engines can discover and index your content efficiently.
 * * WORKFLOW:
 * - Local Test: `npx next-sitemap`
 * - Production: Runs automatically post-build via `postbuild` script.
 * * ###############################################################################
 */

// ==========================================
// 🌐 GLOBAL SETTINGS
// ==========================================
const siteDomain = "https://veganipsum.vercel.app";

/** @type {import('next-sitemap').IConfig} */
const config = {
	// ==========================================
	// 🌍 SITE METADATA
	// ==========================================
	// Uses the variable defined above
	siteUrl: siteDomain,
	sitemapBaseFileName: "sitemap",
	trailingSlash: false,

	// ==========================================
	// 🔍 CRAWLING STRATEGY
	// ==========================================
	changefreq: "weekly",
	priority: 0.7,
	exclude: ["/404", "/500"],

	// ==========================================
	// 🛠️ ENTRY TRANSFORMATION
	// ==========================================
	//
	// Customizes each sitemap entry.
	// Here we clean up the 'lastmod' format for cleaner XML.
	transform: async (config, path) => {
		return {
			loc: path,
			changefreq: config.changefreq,
			priority: config.priority,
			// Remove milliseconds to follow standard ISO 8601 strictly
			lastmod: new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
		};
	},

	// ==========================================
	// 🤖 ROBOTS.TXT CONFIGURATION
	// ==========================================
	generateRobotsTxt: true,
	robotsTxtOptions: {
		policies: [
			{
				userAgent: "*",
				allow: "/"
			}
		],
		transformRobotsTxt: async (_, robotsTxt) => {
			// Clean up redundant Host header often added by default.
			// We use the siteDomain variable here to keep things DRY.
			const hostHeader = `# Host\nHost: ${siteDomain}\n\n`;
			return robotsTxt.replace(hostHeader, "");
		},
	},
};

module.exports = config;
