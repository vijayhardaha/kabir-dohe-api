/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: "https://kabir-ke-dohe-api.vercel.app",
  generateRobotsTxt: true,
  sitemapBaseFileName: "sitemap",
  changefreq: "weekly",
  priority: 0.7,
  trailingSlash: false,
  exclude: ["/404", "/500"],
  robotsTxtOptions: {
    policies: [{ userAgent: "*", allow: "/" }],
  },
};

module.exports = config;
