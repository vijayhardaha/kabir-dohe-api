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
  return `Analyze Kabir's dohas as a spiritual expert, returning ONLY a JSON array. Total word count per doha must be 1200-1500 words.

GLOBAL RULES:
- Every '_hi' field must be in Hindi.
- Every '_en' field must be a high-quality, poetic English translation (except 'text_en', which is Hinglish transliteration).
- Depth: Connect to Nirgun Bhakti, Advaita Vedanta, Sufism, and the rejection of ritualism.
- Strict JSON: No text before or after the array.

FIELD SPECIFICATIONS:
1. text_hi/text_en: Original Hindi and Hinglish transliteration.
2. interpretation_hi/en: 6-8 sentences covering Literal meaning of each line, Metaphorical/symbolic interpretation, Connection to Kabir's core philosophy (nirgun bhakti, maya, atman-brahman), Spiritual terminology explained (if any) & The paradox or deeper truth Kabir is revealing.
3. philosophical_analysis_hi/en: 5-7 paragraphs (>50 words each) discussing Historical/cultural context of couplet's teaching,  How this doha reflects Kabir's rejection of ritualism and caste, Connection to broader mystical traditions (Advaita, Sufism, Bhakti), The psychological/inner transformation Kabir advocates, Common misconceptions vs. true understanding, Why this teaching was radical in Kabir's time and remains relevant today.
4. practical_example_hi/en: Create a compelling 15-20 paragraphs modern story with A relatable contemporary protagonist facing a genuine spiritual/life crisis, Clear connection to the doha's teaching, Realistic challenges and inner conflict, The turning point inspired by Kabir's wisdom, Tangible transformation in thought, behavior, and life outcomes, Emotional resonance that makes the teaching memorable, Natural integration of the doha's message without being preachy.
5. practice_guidance_hi/en: Provide 4-5 practical spiritual practices including Daily meditation/contemplation techniques, Journaling prompts for self-inquiry, Behavioral changes to embody the teaching, Mindfulness exercises related to the doha's theme, How to recognize when you're living/not living this wisdom.
6. core_message_hi/en: Write 5-7 items (10-15 words each) including profound and poetic message, addresses common spiritual obstacles message, actionable wisdom message, connects individual and universal truth message, inspires ongoing spiritual journey message.
7. reflection_questions_hi/en: 5-8 deep, non-obvious reflective questions that Prompt deep self-examination, Have no easy answers, Connect the doha to reader's personal life, Encourage continued contemplation beyond the reading.
8. tags/category: 2-5 relevant tags and 1 main category.

JSON STRUCTURE:
[{
  "text_hi": "",
  "text_en": "",
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
  "category": ""
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
  const BATCH_SIZE = 25;

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
