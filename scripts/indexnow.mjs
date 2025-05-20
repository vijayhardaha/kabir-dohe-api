import fs from "fs";
import path from "path";

import ora from "ora";
import xml2js from "xml2js";

const siteUrl = "https://kabir-ke-dohe-api.vercel.app";
const key = "91c80f732f4e4e5b80b4c02a7e8c9e9c";
const keyLocation = `${siteUrl}/${key}.txt`;
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const sitemapPath = path.join(__dirname, "..", "public", "sitemap-0.xml");

/**
 * Reads a sitemap XML file and extracts all URLs.
 * @param {string} filePath - Path to the sitemap XML file.
 * @returns {Promise<string[]>} - Promise resolving to an array of URLs.
 */
function readSitemap(filePath) {
  return new Promise((resolve, reject) => {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return reject(new Error(`Sitemap file not found: ${filePath}`));
    }

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) return reject(err);

      xml2js.parseString(data, (err, result) => {
        if (err) return reject(err);

        // Validate XML structure
        if (!result || !result.urlset || !Array.isArray(result.urlset.url)) {
          return reject(new Error("Invalid sitemap XML structure."));
        }

        const urls = result.urlset.url.map((entry) => entry && entry.loc && entry.loc[0]).filter(Boolean);

        if (!urls.length) {
          return reject(new Error("No URLs found in sitemap."));
        }

        resolve(urls);
      });
    });
  });
}

/**
 * Notifies IndexNow API with a list of URLs, processing each URL individually and asynchronously.
 * @param {string[]} urls - Array of URLs to notify.
 * @param {object} spinner - ora spinner instance.
 * @returns {Promise<void>}
 */
async function notifyIndexNow(urls, spinner) {
  if (!Array.isArray(urls) || urls.length === 0) {
    spinner.warn("No URLs to notify IndexNow.");
    return;
  }

  for (const url of urls) {
    let res;
    try {
      res = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host: new URL(siteUrl).host,
          key,
          keyLocation,
          urlList: [url],
        }),
      });
    } catch (err) {
      spinner.fail(`❌ Network error while submitting ${url} to IndexNow: ${err}`);
      console.log(`Status for ${url}: Failed (Network error)`);
      continue;
    }

    if (res && res.ok) {
      spinner.succeed(`Status for ${url}: ✅ Success`);
    } else {
      let errorText = "";
      try {
        errorText = res ? await res.text() : "No response";
      } catch (e) {
        errorText = e instanceof Error ? e.message : "Unknown error";
      }
      spinner.fail(`Status for ${url}: Failed (${errorText})`);
      console.error(`❌ Submission failed for ${url}:`, errorText);
    }
    spinner.start("Processing next URL...");
  }
}

/**
 * Main execution block.
 */
(async () => {
  const spinner = ora("Reading sitemap...").start();
  try {
    const urls = await readSitemap(sitemapPath);

    // Optional: split into chunks of 10000 (IndexNow limit)
    const chunkSize = 10000;
    if (!Array.isArray(urls) || urls.length === 0) {
      spinner.warn("No URLs found to submit.");
      return;
    }
    for (let i = 0; i < urls.length; i += chunkSize) {
      const chunk = urls.slice(i, i + chunkSize);
      spinner.text = `Submitting URLs ${i + 1} to ${i + chunk.length} of ${urls.length}`;
      await notifyIndexNow(chunk, spinner);
    }
    spinner.succeed("All URLs processed.");
  } catch (error) {
    spinner.fail("Error: " + (error.message || error));
  }
})();
