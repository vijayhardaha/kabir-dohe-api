/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: "https://toolsbyvijay.vercel.app",
  generateRobotsTxt: true,
  sitemapBaseFileName: "next-sitemap",
  changefreq: "weekly",
  priority: 0.7,
  trailingSlash: false,
  exclude: ["/404", "/500"],
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/" }],
  },
};

module.exports = config;
