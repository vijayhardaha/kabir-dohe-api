/**
 * ======================================================================
 * Next Sitemap Configuration
 * ======================================================================
 * Purpose: Generate sitemaps and robots.txt to help search engines
 *          discover and index site content.
 *          Use `npx next-sitemap` for local testing.
 * Docs: https://github.com/iamvishnusankar/next-sitemap
 * ======================================================================
 */

// ----------------------------------------------------------------------
// Global Settings
// ----------------------------------------------------------------------
const siteDomain = 'https://kabir-ke-dohe-api.vercel.app';

/** @type {import('next-sitemap').IConfig} */
const config = {
  // ---- Site metadata ----
  // Base URL used for all sitemap entries (keeps URLs consistent)
  siteUrl: siteDomain,
  sitemapBaseFileName: 'sitemap',
  trailingSlash: false,

  // ---- Crawling Strategy ----
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/404', '/500'],

  // ---- Entry Transformation ----
  // Customizes each sitemap entry.
  // Here we clean up the 'lastmod' format for cleaner XML.
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      // Remove milliseconds to follow standard ISO 8601 strictly
      lastmod: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
    };
  },

  // ---- Robots.txt Configuration ----
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
    transformRobotsTxt: async (_, robotsTxt) => {
      // Clean up redundant Host header often added by default.
      // We use the siteDomain variable here to keep things DRY.
      const hostHeader = `# Host\nHost: ${siteDomain}\n\n`;
      return robotsTxt.replace(hostHeader, '');
    },
  },
};

module.exports = config;
