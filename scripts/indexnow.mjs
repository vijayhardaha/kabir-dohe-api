import fsSync from 'fs';
import fs from 'fs/promises';
import path from 'path';

import ora from 'ora';
import xml2js from 'xml2js';

const siteUrl = 'https://kabir-ke-dohe-api.vercel.app';
const key = '91c80f732f4e4e5b80b4c02a7e8c9e9c';
const keyLocation = `${siteUrl}/${key}.txt`;
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap-0.xml');

/**
 * Validates that the sitemap file exists.
 *
 * @param {string} filePath - Path to the sitemap file.
 * @throws {Error} If file doesn't exist.
 */
function validateSitemapFile(filePath) {
  if (!fsSync.existsSync(filePath)) {
    throw new Error(`Sitemap file not found: ${filePath}`);
  }
}

/**
 * Reads the sitemap file content.
 *
 * @param {string} filePath - Path to the sitemap file.
 * @returns {Promise<>} - File content as string.
 */
async function readSitemapFile(filePath) {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch (error) {
    throw new Error(`Failed to read sitemap file: ${error.message}`);
  }
}

/**
 * Parses XML content to JavaScript object.
 *
 * @param {string} data - XML content as string.
 * @returns {Promise<any>} - Parsed XML object.
 * @throws {Error} If parsing fails.
 */
async function parseSitemapXml(data) {
  try {
    return await xml2js.parseStringPromise(data);
  } catch (error) {
    throw new Error(`Failed to parse sitemap XML: ${error.message}`);
  }
}

/**
 * Extracts URL(s) from parsed sitemap object.
 *
 * @param {object} result - Parsed sitemap object.
 * @returns {string[]} - Array of URL(s).
 * @throws {Error} If no URL(s) found or invalid structure.
 */
function extractUrlsFromSitemap(result) {
  if ((result && !result?.urlset?.url) || !Array.isArray(result.urlset.url)) {
    throw new Error('Invalid sitemap XML structure.');
  }

  const urls = result.urlset.url.map((entry) => entry?.loc?.[0]).filter(Boolean);

  if (!urls.length) {
    throw new Error('No URL(s) found in sitemap.');
  }

  return urls;
}

/**
 * Reads a sitemap XML file and extracts all URL(s).
 *
 * @param {string} filePath - Path to the sitemap XML file.
 * @returns {Promise<string[]>} - Promise resolving to an array of URL(s).
 */
async function readSitemap(filePath) {
  validateSitemapFile(filePath);
  const data = await readSitemapFile(filePath);
  const result = await parseSitemapXml(data);
  return extractUrlsFromSitemap(result);
}

/**
 * Submits a single URL to IndexNow API.
 *
 * @param {string[]} urls - URL(s) to submit.
 * @returns {Promise<Response>} - API response.
 * @throws {Error} - Network or fetch errors.
 */
async function submitToIndexNow(urls) {
  return await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ host: new URL(siteUrl).host, key, keyLocation, urlList: urls }),
  });
}

/**
 * Handles successful API response.
 *
 * @param {string[]} urls - Submitted URL(s).
 * @param {Response} response - API response.
 * @param {object} spinner - ora spinner instance.
 */
function handleSuccessfulResponse(urls, response, spinner) {
  const urlCount = urls.length;
  if (response?.ok) {
    spinner.succeed(`Status for ${urlCount} URL(s): ✅ Success`);
  } else {
    const errorText = getErrorText(response);
    spinner.fail(`Status for ${urlCount} URL(s): Failed (${errorText})`);
  }
}

/**
 * Handles submission errors (network or other).
 *
 * @param {string[]} urls - URL(s) that failed.
 * @param {Error} error - Error object.
 * @param {object} spinner - ora spinner instance.
 */
function handleSubmissionError(urls, error, spinner) {
  const urlCount = urls.length;
  spinner.fail(`❌ Network error while submitting ${urlCount} URL(s) to IndexNow: ${error}`);
}

/**
 * Notifies IndexNow API with a list of URL(s), processing each URL individually and asynchronously.
 * @param {string[]} urls - Array of URL(s) to notify.
 * @param {object} spinner - ora spinner instance.
 * @returns {Promise<void>}
 */
async function notifyIndexNow(urls, spinner) {
  if (!Array.isArray(urls) || urls.length === 0) {
    spinner.warn('No URL(s) to notify IndexNow.');
    return;
  }

  try {
    spinner.start('Processing urls...');
    const response = await submitToIndexNow(urls);
    handleSuccessfulResponse(urls, response, spinner);
  } catch (error) {
    handleSubmissionError(urls, error, spinner);
  }
}

/**
 * Extracts error text from failed response.
 *
 * @param {Response} response - Failed API response.
 * @returns {string} - Error message text.
 */
async function getErrorText(response) {
  try {
    return response ? await response.text() : 'No response';
  } catch (error) {
    return error instanceof Error ? error.message : 'Unknown error';
  }
}

/**
 * Main execution block.
 */
(async () => {
  const spinner = ora('Reading sitemap...').start();
  try {
    const urls = await readSitemap(sitemapPath);

    // Optional: split into chunks of 10000 (IndexNow limit)
    const chunkSize = 100;
    if (!Array.isArray(urls) || urls.length === 0) {
      spinner.warn('No URL(s) found to submit.');
      return;
    }
    for (let i = 0; i < urls.length; i += chunkSize) {
      const chunk = urls.slice(i, i + chunkSize);
      spinner.text = `Submitting URL(s) ${i + 1} to ${i + chunk.length} of ${urls.length}`;
      await notifyIndexNow(chunk, spinner);
    }
    spinner.succeed('All URL(s) processed.');
  } catch (error) {
    spinner.fail('Error: ' + (error.message || error));
  }
})();
