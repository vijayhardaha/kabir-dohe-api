import { sanitizeTitle } from '@/lib/server/utils/string';

/**
 * Represents a normalized relationship row between a post record and tag record.
 */
export type DbPostTags = { post_id: string; tag_id: string };

/**
 * Removes duplicate post-tag relationship rows by comparing a deterministic composite key.
 *
 * @param {DbPostTags[]} mappings - Relationship rows collected from transformation or import stages.
 * @returns {DbPostTags[]} Unique relationship rows preserving the first occurrence ordering.
 * @example
 * uniqueMappings([
 * 	{ post_id: "c1", tag_id: "t1" },
 * 	{ post_id: "c1", tag_id: "t1" },
 * 	{ post_id: "c1", tag_id: "t2" },
 * ]);
 * // [{ post_id: "c1", tag_id: "t1" }, { post_id: "c1", tag_id: "t2" }]
 */
export function uniqueMappings(mappings: DbPostTags[]): DbPostTags[] {
  const seen = new Set<string>();
  return mappings.filter(({ post_id, tag_id }) => {
    // Build a stable pair identifier so duplicate relationships collapse reliably.
    const key = `${String(post_id)}|${String(tag_id)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Builds post-tag mapping entries by matching raw post data with upserted database records.
 *
 * @param {Array<{ identifier: string; tags: string[] }>} rawPosts - Raw posts with tag information from the source.
 * @param {Record<string, string>[]} postsData - Upserted posts data with ids.
 * @param {Record<string, string>[]} tagsData - Upserted tags data with ids.
 * @returns {DbPostTags[]} Array of post-tag mapping entries.
 * @example
 * buildPostTagMappings(
 *   [{ identifier: "KKD001", tags: ["Love", "Nature"] }],
 *   [{ id: "c1", identifier: "KKD001" }],
 *   [{ id: "t1", slug: "love" }, { id: "t2", slug: "nature" }]
 * );
 * // [{ post_id: "c1", tag_id: "t1" }, { post_id: "c1", tag_id: "t2" }]
 */
export function buildPostTagMappings(
  rawPosts: Array<{ identifier: string; tags: string[] }>,
  postsData: Record<string, string>[],
  tagsData: Record<string, string>[]
): DbPostTags[] {
  const postTagMappings: DbPostTags[] = [];

  for (const post of rawPosts) {
    const postId = postsData?.find((p: Record<string, string>) => p.identifier === post.identifier)?.id;
    if (postId) {
      for (const tag of post.tags) {
        const tagId = tagsData?.find((t: Record<string, string>) => t.slug === sanitizeTitle(tag))?.id;
        if (tagId) {
          postTagMappings.push({ post_id: postId, tag_id: tagId });
        }
      }
    }
  }

  return uniqueMappings(postTagMappings);
}
