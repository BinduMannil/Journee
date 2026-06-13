import { test } from "node:test";
import assert from "node:assert/strict";
import { assembleDestinationReadiness } from "../src/lib/intelligence/destination-readiness";
// Side effect: register the seed travel-data adapters so resolution works — the
// same registration the destination page performs.
import "../src/lib/providers/travel-data/register";

/**
 * Guards the PUBLIC, seed-fed Travel Confidence surface on the destination page.
 * If the seed catalog or the bridge regress so that no source contributes, the
 * page would silently render nothing — this catches that.
 */
const SEEDED = ["kyoto", "santorini", "marrakech", "patagonia"] as const;

for (const id of SEEDED) {
  test(`seed-fed readiness for ${id} has contributing parts + seed provenance`, async () => {
    const r = await assembleDestinationReadiness({ destinationId: id });
    assert.equal(r.destinationId, id);
    // At least one sub-engine must contribute (advisory always present in seed).
    assert.ok(r.parts.length > 0, "expected at least one contributing sub-engine");
    assert.ok(r.overall.score >= 0 && r.overall.score <= 100);
    assert.ok(r.overall.confidence > 0, "coverage-based confidence should be > 0");
    // Every recorded source is seed today (no live vendor wired).
    assert.ok(r.sources.length > 0);
    for (const s of r.sources) assert.equal(s.sourceType, "seed");
    // A contributing source is reflected honestly.
    assert.ok(r.sources.some((s) => s.contributed));
  });
}

test("unknown destination yields zero-coverage readiness, never throws", async () => {
  const r = await assembleDestinationReadiness({ destinationId: "atlantis" });
  assert.equal(r.destinationId, "atlantis");
  assert.equal(r.parts.length, 0);
  assert.equal(r.overall.confidence, 0);
});
