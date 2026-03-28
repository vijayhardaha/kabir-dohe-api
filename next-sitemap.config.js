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

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createSitemapConfig } = require('@vijayhardaha/dev-config/next-sitemap');

const siteDomain = 'https://kabir-ke-dohe-api.vercel.app';

/** @type {import('next-sitemap').IConfig} */
const config = createSitemapConfig({
  siteUrl: siteDomain,
  outDir: process.env.NODE_ENV === 'production' ? '/vercel/output/static' : './public',
});

module.exports = config;
