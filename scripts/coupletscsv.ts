/**
 * AI-Powered CSV Generation Script for Kabir Ke Dohe
 *
 * This script uses Ollama (local LLM) to analyze Kabir dohe from a JSON file
 * and generate structured data with all fields needed for the database.
 *
 * Usage: pnpm tsx scripts/coupletscsv.ts
 */

import { existsSync } from 'fs';
import fs from 'fs/promises';

import ollama from 'ollama';
import { z } from 'zod';

/**
 * Zod schema for validating generated couplet data
 */
const CoupletSchema = z.object({
  text_hi: z.string().min(1),
  text_en: z.string().min(1),
  interpretation_hi: z.string().default(''),
  interpretation_en: z.string().default(''),
  philosophical_analysis_hi: z.string().default(''),
  philosophical_analysis_en: z.string().default(''),
  practical_example_hi: z.string().default(''),
  practical_example_en: z.string().default(''),
  practice_guidance_hi: z.array(z.string()).default([]),
  practice_guidance_en: z.array(z.string()).default([]),
  core_message_hi: z.array(z.string()).default([]),
  core_message_en: z.array(z.string()).default([]),
  reflection_questions_hi: z.array(z.string()).default([]),
  reflection_questions_en: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  category: z.string().default(''),
});

/**
 * Array of couplet schemas
 */
const CoupletsArraySchema = z.array(CoupletSchema);

/**
 * Type for generated couplet output
 */
type GeneratedCouplet = z.infer<typeof CoupletSchema>;

/**
 * Create batches from array
 * @param arr - Array to batch
 * @param size - Batch size
 */
function createBatches<T>(arr: T[], size: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    batches.push(arr.slice(i, i + size));
  }
  return batches;
}

/**
 * Extract and parse JSON from LLM response
 * @param text - Raw response text
 */
function extractJSON(text: string): unknown {
  try {
    const match = text.match(/\[[\s\S]*\]/);
    if (!match) return null;
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

/**
 * Sleep helper
 * @param ms - Milliseconds to sleep
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate system prompt with all field definitions
 */
function getSystemPrompt(): string {
  return `Analyze the provided each Kabir Doha(s) and return ONLY a JSON array. Each entry must be between 1200-1500 words in total to ensure maximum depth.

GLOBAL RULES:
- Every '_hi' field must be in Hindi.
- Every '_en' field must be a high-quality, poetic English translation (except 'text_en', which is Hinglish transliteration).
- Tone: Scholarly and mystical, yet emotionally resonant. Avoid being preachy.
- Depth: Connect to Nirgun Bhakti, Advaita Vedanta, Sufism, and the rejection of ritualism.
- Constraint: Strict JSON output only. No introductory or concluding text.

FIELD SPECIFICATIONS:
- text_hi / text_en: Original Hindi script and Hinglish transliteration.
- meaning_hi / en: (Minimum 40 words) Provide a clear, accessible, and direct explanation of the Doha, distilling the literal and fundamental message without losing its spiritual weight.
- interpretation_hi / en: (6-8 sentences) Begin with the literal meaning, then transition into a deep metaphorical analysis. Explicitly link to Nirgun Bhakti (formless devotion), Maya (illusion), and Atman-Brahman non-duality. Define spiritual terminology while highlighting the central paradox of the human condition.
- philosophical_analysis_hi / en: (5-7 paragraphs, >50 words each) Detail the historical/cultural context of Kabir’s era. Explain his rejection of ritualism and caste. Connect the teaching to Advaita Vedanta, Sufism, and the Bhakti movement. Focus on psychological transformation and the annihilation of ego, correcting common literalist misconceptions.
- practical_example_hi / en: (8-10 paragraphs, ~30 words each) A compelling contemporary short story of a protagonist facing a realistic existential crisis (e.g., corporate burnout, digital ego). Use a "Kabir Twist" to trigger a concrete transformation in behavior and life outcomes.
- practice_guidance_hi / en: (4-5 items) Provide a roadmap including daily meditation/contemplation, journaling prompts for self-inquiry, and specific behavioral changes. Include a "Diagnostic Checklist" to recognize when one is living (or failing to live) this wisdom.
- core_message_hi / en: (5-7 items, 10-15 words each) Poetic, profound modern insights. Sequentially address spiritual obstacles, actionable wisdom, and the connection between individual and universal truth.
- reflection_questions_hi / en: (5-8 items) Deep, non-obvious questions with no easy answers. Force the reader to examine their public identity versus their internal shadows and personal life (digital ego, hidden biases).
- tags / category: Provide a list of 3-5 specific tags and one overarching category (e.g., "Ego & Identity," "Nature of Reality").

JSON STRUCTURE:
[{
  "text_hi": "",
  "text_en": "",
  "meaning_hi": "",
  "meaning_en": "",
  "interpretation_hi": "",
  "interpretation_en": "",
  "philosophical_analysis_hi": "",
  "philosophical_analysis_en": "",
  "practical_example_hi": "",
  "practical_example_en": "",
  "practice_guidance_hi": [],
  "practice_guidance_en": [],
  "core_message_hi": [],
  "core_message_en": [],
  "reflection_questions_hi": [],
  "reflection_questions_en": [],
  "tags": [],
  "category": "",
}]`;
}

/**
 * Generate user prompt with dohe to analyze
 * @param dohe - Array of dohe to analyze
 */
function getUserPrompt(dohe: string[]): string {
  return `Analyze these Kabir dohe and generate JSON array:\n\n${dohe.map((doha, i) => `${i + 1}. ${doha}`).join('\n\n')}`;
}

/**
 * Process a batch of dohe using Ollama
 * @param dohe - Batch of dohe to process
 * @param model - Ollama model to use
 * @param maxRetries - Maximum retry attempts
 */
async function processBatch(
  dohe: string[],
  model = 'gemini-3-flash-preview:cloud',
  maxRetries = 3
): Promise<GeneratedCouplet[]> {
  const prompt = getUserPrompt(dohe);
  const systemPrompt = getSystemPrompt();

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await ollama.chat({
        model,
        format: 'json',
        think: false,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
      });

      const rawData = extractJSON(response.message.content);

      if (!rawData) {
        console.log(`Attempt ${attempt + 1}: Failed to extract JSON, retrying...`);
        await sleep(2000);
        continue;
      }

      const parsed = CoupletsArraySchema.safeParse(rawData);

      if (!parsed.success) {
        console.log(`Attempt ${attempt + 1}: Validation failed, retrying...`);
        console.log('Validation errors:', parsed.error.issues.slice(0, 3));
        await sleep(2000);
        continue;
      }

      return parsed.data;
    } catch (err) {
      const error = err as Error;
      console.log(`Attempt ${attempt + 1} error: ${error.message}`);
      await sleep(3000 * (attempt + 1));
    }
  }

  throw new Error(`Batch processing failed after ${maxRetries} attempts`);
}

/**
 * Append result to dataset file
 * @param {AiResult} data
 */
async function appendToFile(data: GeneratedCouplet[], OUTPUT_FILE: string) {
  const line = JSON.stringify(data) + '\n';

  await fs.appendFile(OUTPUT_FILE, line);
}

/**
 * Main pipeline
 */
async function main() {
  const INPUT_FILE = 'scripts/dohe-input.json';
  const OUTPUT_FILE = 'scripts/dohe-output.json';
  const BATCH_SIZE = 1;

  if (!existsSync(INPUT_FILE)) {
    console.error(`Input file "${INPUT_FILE}" not found!`);
    console.log('Please create dohe-input.json with your input data.');
    process.exit(1);
  }

  console.log('Reading input file...');
  const dohe: string[] = JSON.parse(await fs.readFile(INPUT_FILE, 'utf8'));
  console.log(`Loaded ${dohe.length} dohe`);

  const batches = createBatches(dohe, BATCH_SIZE);
  console.log(`Created ${batches.length} batches of ${BATCH_SIZE}`);

  const results: GeneratedCouplet[] = [];

  for (let i = 0; i < batches.length; i++) {
    console.log(`Processing batch ${i + 1}/${batches.length}...`);
    const res = await processBatch(batches[i]);
    await appendToFile(res, OUTPUT_FILE);
    results.push(...res);
    console.log(`Completed batch ${i + 1}/${batches.length} (${res.length} items)`);
  }

  await fs.writeFile(OUTPUT_FILE, JSON.stringify(results, null, 2));
  console.log(`\nFinished: ${results.length} couplets generated`);
  console.log(`Output saved to: ${OUTPUT_FILE}`);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
