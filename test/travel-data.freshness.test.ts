import { test } from "node:test";
import assert from "node:assert/strict";
import {
  classifySourceQuality,
  computeFreshness,
  confidenceLevel,
  effectiveSourceType,
  isStale,
  normalizeConfidence,
  rankSources,
} from "../src/lib/providers/travel-data/freshness";
import type { SourceMetadata } from "../src/lib/providers/travel-data/source";

function meta(over: Partial<SourceMetadata> = {}): SourceMetadata {
  return {
    sourceName: "s",
    sourceType: "seed",
    providerId: "p",
    confidence: 0.5,
    fetchedAt: "2026-05-27T00:00:00.000Z",
    expiresAt: "2026-05-27T06:00:00.000Z",
    ...over,
  };
}

test("computeFreshness: fresh before expiry, stale after, unknown without expiry", () => {
  const now = new Date("2026-05-27T03:00:00Z");
  assert.equal(computeFreshness(meta(), now), "fresh");
  assert.equal(computeFreshness(meta(), new Date("2026-05-27T09:00:00Z")), "stale");
  assert.equal(computeFreshness(meta({ expiresAt: undefined }), now), "unknown");
});

test("computeFreshness: boundary (now === expiresAt) is fresh", () => {
  assert.equal(computeFreshness(meta(), new Date("2026-05-27T06:00:00Z")), "fresh");
});

test("computeFreshness: malformed expiresAt is unknown", () => {
  assert.equal(computeFreshness(meta({ expiresAt: "not-a-date" })), "unknown");
});

test("isStale agrees with computeFreshness", () => {
  assert.equal(isStale(meta(), new Date("2026-05-27T09:00:00Z")), true);
  assert.equal(isStale(meta(), new Date("2026-05-27T03:00:00Z")), false);
});

test("normalizeConfidence clamps to 0..1", () => {
  assert.equal(normalizeConfidence(-3), 0);
  assert.equal(normalizeConfidence(5), 1);
  assert.equal(normalizeConfidence(0.3), 0.3);
});

test("confidenceLevel bands high/medium/low", () => {
  assert.equal(confidenceLevel(0.9), "high");
  assert.equal(confidenceLevel(0.7), "high");
  assert.equal(confidenceLevel(0.5), "medium");
  assert.equal(confidenceLevel(0.4), "medium");
  assert.equal(confidenceLevel(0.39), "low");
  assert.equal(confidenceLevel(0), "low");
});

test("effectiveSourceType reflects staleness and unavailability", () => {
  const now = new Date("2026-05-27T03:00:00Z");
  assert.equal(effectiveSourceType(meta({ sourceType: "live" }), now), "live");
  assert.equal(
    effectiveSourceType(meta({ sourceType: "live" }), new Date("2026-05-27T09:00:00Z")),
    "stale",
  );
  assert.equal(effectiveSourceType(meta({ sourceType: "unavailable" }), now), "unavailable");
});

test("rankSources orders live > seed > mock, then by confidence, and is pure", () => {
  const now = new Date("2026-05-27T03:00:00Z");
  const mock = meta({ sourceType: "mock", providerId: "mock", confidence: 0.9 });
  const seed = meta({ sourceType: "seed", providerId: "seed", confidence: 0.5 });
  const live = meta({ sourceType: "live", providerId: "live", confidence: 0.6 });
  const input = [mock, seed, live];
  const ranked = rankSources(input, now);
  assert.deepEqual(ranked.map((s) => s.providerId), ["live", "seed", "mock"]);
  // input not mutated
  assert.deepEqual(input.map((s) => s.providerId), ["mock", "seed", "live"]);
});

test("rankSources sinks a stale live source below a fresh seed source", () => {
  const now = new Date("2026-05-27T09:00:00Z"); // past expiry
  const staleLive = meta({ sourceType: "live", providerId: "live", confidence: 0.9 });
  const freshSeed = meta({
    sourceType: "seed",
    providerId: "seed",
    confidence: 0.5,
    expiresAt: "2026-05-27T23:00:00.000Z",
  });
  const ranked = rankSources([staleLive, freshSeed], now);
  assert.equal(ranked[0]?.providerId, "seed");
});

test("rankSources breaks confidence ties by most-recent fetchedAt", () => {
  const a = meta({ providerId: "a", confidence: 0.5, fetchedAt: "2026-05-27T01:00:00.000Z", expiresAt: undefined });
  const b = meta({ providerId: "b", confidence: 0.5, fetchedAt: "2026-05-27T05:00:00.000Z", expiresAt: undefined });
  const ranked = rankSources([a, b]);
  assert.equal(ranked[0]?.providerId, "b");
});

test("classifySourceQuality: unavailable → none", () => {
  assert.equal(classifySourceQuality(meta({ sourceType: "unavailable", confidence: 0 })), "none");
});

test("classifySourceQuality: fresh high-confidence live → high", () => {
  const now = new Date("2026-05-27T03:00:00Z");
  assert.equal(classifySourceQuality(meta({ sourceType: "live", confidence: 0.9 }), now), "high");
});

test("classifySourceQuality: stale data is demoted a band", () => {
  const now = new Date("2026-05-27T09:00:00Z"); // past expiry
  assert.equal(classifySourceQuality(meta({ sourceType: "live", confidence: 0.9 }), now), "medium");
});

test("classifySourceQuality: seed mid-confidence → medium", () => {
  const now = new Date("2026-05-27T03:00:00Z");
  assert.equal(classifySourceQuality(meta({ sourceType: "seed", confidence: 0.5 }), now), "medium");
});
