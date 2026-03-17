/**
 * IndexNow Script
 *
 * Submits URLs from sitemap to IndexNow API for search engine indexing.
 *
 * Usage:
 *   pnpm indexnow    - Submit URLs to IndexNow
 */

import fs from 'fs/promises';
import path from 'path';

import ora from 'ora';
import xml2js from 'xml2js';

const SITE_URL = 'https://kabir-ke-dohe-api.vercel.app';
const KEY = '91c80f732f4e4e5b80b4c02a7e8c9e9c';
const KEY_LOCATION = SITE_URL + '/' + KEY + '.txt';
const SITEMAP_PATH = path.resolve(process.cwd(), 'public', 'sitemap-0.xml');
const CHUNK_SIZE = 100;

async function main() {
  const spinner = ora('Reading sitemap...').start();

  let sitemapContent: string;
  try {
    sitemapContent = await fs.readFile(SITEMAP_PATH, 'utf8');
  } catch {
    spinner.fail('Sitemap file not found: ' + SITEMAP_PATH);
    process.exit(1);
  }

  let parsed: { urlset?: { url?: Array<{ loc?: string[] }> } };
  try {
    parsed = await xml2js.parseStringPromise(sitemapContent);
  } catch {
    spinner.fail('Failed to parse sitemap XML');
    process.exit(1);
  }

  const urls = parsed.urlset?.url?.map((entry) => entry.loc?.[0]).filter(Boolean) as string[] | undefined;

  if (!urls || urls.length === 0) {
    spinner.warn('No URLs found in sitemap');
    process.exit(0);
  }

  spinner.succeed('Found ' + urls.length + ' URLs');

  for (let i = 0; i < urls.length; i += CHUNK_SIZE) {
    const chunk = urls.slice(i, i + CHUNK_SIZE);
    spinner.start('Submitting URLs ' + (i + 1) + ' to ' + Math.min(i + CHUNK_SIZE, urls.length));

    try {
      const response = await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host: new URL(SITE_URL).host, key: KEY, keyLocation: KEY_LOCATION, urlList: chunk }),
      });

      if (response.ok) {
        spinner.succeed('Submitted ' + chunk.length + ' URLs');
      } else {
        const errorText = await response.text();
        spinner.fail('Failed: ' + errorText);
      }
    } catch (error) {
      spinner.fail('Network error: ' + (error as Error).message);
    }
  }

  ora('All URLs processed!').succeed();
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
