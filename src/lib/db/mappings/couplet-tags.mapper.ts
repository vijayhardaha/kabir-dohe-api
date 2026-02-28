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
export function uniqueMappings(mappings: DbCoupletTags[]) {
	const seen = new Set<string>();
	return mappings.filter(({ couplet_id, tag_id }) => {
		// Build a stable pair identifier so duplicate relationships collapse reliably.
		const key = `${String(couplet_id)}|${String(tag_id)}`;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}
