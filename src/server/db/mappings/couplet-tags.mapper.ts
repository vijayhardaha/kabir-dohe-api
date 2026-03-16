import { sanitizeTitle } from '@/server/lib/string';

/**
 * Represents a normalized relationship row between a couplet record and tag record.
 */
export type DbCoupletTags = { couplet_id: string; tag_id: string };

/**
 * Removes duplicate couplet-tag relationship rows by comparing a deterministic composite key.
 *
 * @param {DbCoupletTags[]} mappings - Relationship rows collected from transformation or import stages.
 * @returns {DbCoupletTags[]} Unique relationship rows preserving the first occurrence ordering.
 * @example
 * uniqueMappings([
 * 	{ couplet_id: "c1", tag_id: "t1" },
 * 	{ couplet_id: "c1", tag_id: "t1" },
 * 	{ couplet_id: "c1", tag_id: "t2" },
 * ]);
 * // [{ couplet_id: "c1", tag_id: "t1" }, { couplet_id: "c1", tag_id: "t2" }]
 */
export function uniqueMappings(mappings: DbCoupletTags[]): DbCoupletTags[] {
  const seen = new Set<string>();
  return mappings.filter(({ couplet_id, tag_id }) => {
    // Build a stable pair identifier so duplicate relationships collapse reliably.
    const key = `${String(couplet_id)}|${String(tag_id)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Builds couplet-tag mapping entries by matching raw couplet data with upserted database records.
 *
 * @param {Array<{ couplet_code: string; tags: string[] }>} rawCouplets - Raw couplets with tag information from the source.
 * @param {Record<string, string>[]} coupletsData - Upserted couplets data with ids.
 * @param {Record<string, string>[]} tagsData - Upserted tags data with ids.
 * @returns {DbCoupletTags[]} Array of couplet-tag mapping entries.
 * @example
 * buildCoupletTagMappings(
 *   [{ couplet_code: "KKD001", tags: ["Love", "Nature"] }],
 *   [{ id: "c1", couplet_code: "KKD001" }],
 *   [{ id: "t1", slug: "love" }, { id: "t2", slug: "nature" }]
 * );
 * // [{ couplet_id: "c1", tag_id: "t1" }, { couplet_id: "c1", tag_id: "t2" }]
 */
export function buildCoupletTagMappings(
  rawCouplets: Array<{ couplet_code: string; tags: string[] }>,
  coupletsData: Record<string, string>[],
  tagsData: Record<string, string>[]
): DbCoupletTags[] {
  const coupletTagMappings: DbCoupletTags[] = [];

  for (const couplet of rawCouplets) {
    const coupletId = coupletsData?.find((c: Record<string, string>) => c.couplet_code === couplet.couplet_code)?.id;
    if (coupletId) {
      for (const tag of couplet.tags) {
        const tagId = tagsData?.find((t: Record<string, string>) => t.slug === sanitizeTitle(tag))?.id;
        if (tagId) {
          coupletTagMappings.push({ couplet_id: coupletId, tag_id: tagId });
        }
      }
    }
  }

  return uniqueMappings(coupletTagMappings);
}
