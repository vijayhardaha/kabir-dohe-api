import fs from "fs";
import path from "path";

import dotenv from "dotenv";
import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
import ora from "ora";

import {
  cleanString,
  createSlug,
  generateShortHash,
  mapCsvDataToJson,
  padIndex,
  parseAndUniqueList,
} from "./utils/utils.js";

dotenv.config({ path: ".env.local" });

/**
 * Creates and returns a JWT client for Google APIs.
 *
 * @returns {JWT} An instance of JWT configured with the service account credentials.
 * @throws {Error} If the base64 encoded service account or necessary fields are missing.
 */
const createJwtClient = () => {
  const base64ServiceAccount = process.env.GOOGLE_SERVICE_ACCOUNT_BASE64;

  if (!base64ServiceAccount) {
    throw new Error("Base64 encoded service account is not defined in environment variables.");
  }

  const decodedJson = Buffer.from(base64ServiceAccount, "base64").toString("utf8");
  const serviceAccount = JSON.parse(decodedJson);
  const { client_email, private_key } = serviceAccount;

  if (!client_email || !private_key) {
    throw new Error("Service account email or private key is missing.");
  }

  return new JWT({
    email: client_email,
    key: private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
};

/**
 * Fetches data from a specified Google Sheets spreadsheet.
 *
 * @param {string} sheetName - The name of the sheet to fetch data from.
 * @returns {Promise<Array>} A promise that resolves to an array of JSON objects representing the sheet's data.
 * @throws {Error} If the spreadsheet ID is not defined, or the sheet is not found.
 */
const getGoogleSheetData = async (sheetName) => {
  const SPREADSHEET_ID = process.env.SPREADSHEET_ID;

  if (!SPREADSHEET_ID) {
    throw new Error("Spreadsheet ID is not defined in environment variables.");
  }

  const jwtClient = createJwtClient();
  const doc = new GoogleSpreadsheet(SPREADSHEET_ID, jwtClient);

  try {
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle[sheetName];
    if (!sheet) {
      throw new Error(`Sheet titled "${sheetName}" not found`);
    }

    const rows = await sheet.getRows();
    const data = rows.map((row) => row._rawData);
    const mappedData = mapCsvDataToJson({
      values: [sheet.headerValues, ...data],
    });

    return mappedData;
  } catch (error) {
    console.error("Error fetching data from Google Sheets:", error.message);
    return [];
  }
};

/**
 * Ensures that the 'data' directory exists. If not, it creates it.
 */
const ensureDataDirectoryExists = () => {
  const dataDirPath = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDirPath)) {
    fs.mkdirSync(dataDirPath);
  }
};

/**
 * Fetches data from Google Sheets, processes it, and saves it to JSON files.
 *
 * @returns {Promise<void>} A promise that resolves when the data has been fetched and saved.
 * @throws {Error} If the data format is invalid or an error occurs during processing.
 */
(async () => {
  const spinner = ora("Fetching data...").start();

  try {
    // Ensure 'data' directory exists
    ensureDataDirectoryExists();

    // Fetch data from Google Sheets
    const couplets = await getGoogleSheetData("kabir-ke-dohe");

    // Validate data format
    if (!Array.isArray(couplets)) {
      throw new Error("Invalid data format received from Google Sheets.");
    }

    // Process the fetched data
    let processedData = couplets.map((row) => ({
      index: parseInt(row.index ?? 0, 10),
      slug: cleanString(createSlug(row.title_english, "-")),
      popular: row.popular?.toLowerCase() === "yes" || false,
      couplet_hindi: cleanString(row.couplet_hindi ?? ""),
      translation_hindi: row?.translation_hindi?.trim() ?? "",
      explanation_hindi: row?.explanation_hindi?.trim() ?? "",
      couplet_english: cleanString(row.couplet_english ?? ""),
      translation_english: row?.translation_english?.trim() ?? "",
      explanation_english: row?.explanation_english?.trim() ?? "",
      tags: row?.tags?.trim() ?? "",
    }));

    const usedHashes = new Set();
    const tagCounts = new Map();

    // Generate unique slugs and count tags
    processedData = processedData.map((item, index) => {
      const indexPadded = padIndex(index);
      const originalText = `${item.slug}-${indexPadded}`;
      const cleanSlug = createSlug(originalText);
      let shortHash = generateShortHash(cleanSlug);

      while (usedHashes.has(shortHash)) {
        shortHash = generateShortHash(`${cleanSlug}${Math.random()}`);
      }
      usedHashes.add(shortHash);

      const tags = parseAndUniqueList(item.tags);
      tags.forEach((tag) => {
        const slugifiedTag = createSlug(tag);
        if (tagCounts.has(slugifiedTag)) {
          tagCounts.get(slugifiedTag).count += 1;
        } else {
          tagCounts.set(slugifiedTag, { name: tag, count: 1 });
        }
      });

      return {
        id: index + 1,
        slug: createSlug(item.slug),
        unique_slug: createSlug(`${cleanSlug}-${shortHash}`),
        couplet_hindi: item.couplet_hindi,
        couplet_english: item.couplet_english,
        translation_hindi: item.translation_hindi,
        translation_english: item.translation_english,
        explanation_hindi: item.explanation_hindi,
        explanation_english: item.explanation_english,
        popular: Boolean(item.popular) || false,
        tags: tags.map((tag) => {
          const slugifiedTag = createSlug(tag);
          const tagData = tagCounts.get(slugifiedTag);
          return {
            slug: slugifiedTag,
            name: tag,
            count: tagData ? tagData.count : 0,
          };
        }),
      };
    });

    // Save processed data to file
    const coupletsFilePath = path.join(process.cwd(), "data/couplets.json");
    fs.writeFileSync(coupletsFilePath, JSON.stringify(processedData, null, 2));

    spinner.succeed("Data fetched and saved to data/couplets.json");
  } catch (error) {
    spinner.fail("Error fetching data");
    console.error("Error fetching group data:", error);
  }
})();
