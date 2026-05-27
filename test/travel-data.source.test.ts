import { test } from "node:test";
import assert from "node:assert/strict";
import {
  clampConfidence,
  makeSourceMetadata,
  unavailableSource,
} from "../src/lib/providers/travel-data/source";

test("makeSourceMetadata clamps confidence into 0..1", () => {
  assert.equal(makeSourceMetadata({ sourceName: "s", sourceType: "seed", providerId: "p", confidence: 2 }).confidence, 1);
  assert.equal(makeSourceMetadata({ sourceName: "s", sourceType: "seed", providerId: "p", confidence: -1 }).confidence, 0);
  assert.equal(makeSourceMetadata({ sourceName: "s", sourceType: "seed", providerId: "p", confidence: 0.42 }).confidence, 0.42);
});

test("clampConfidence treats NaN/Infinity as 0/1 bounds", () => {
  assert.equal(clampConfidence(Number.NaN), 0);
  assert.equal(clampConfidence(Number.POSITIVE_INFINITY), 1);
  assert.equal(clampConfidence(Number.NEGATIVE_INFINITY), 0);
});

test("makeSourceMetadata derives expiresAt from ttlMs + fetchedAt", () => {
  const fetchedAt = new Date("2026-05-27T00:00:00Z");
  const meta = makeSourceMetadata({
    sourceName: "Seed",
    sourceType: "seed",
    providerId: "seed-x",
    confidence: 0.5,
    fetchedAt,
    ttlMs: 60_000,
  });
  assert.equal(meta.fetchedAt, "2026-05-27T00:00:00.000Z");
  assert.equal(meta.expiresAt, "2026-05-27T00:01:00.000Z");
});

test("makeSourceMetadata omits expiresAt when no fetchedAt is given", () => {
  const meta = makeSourceMetadata({ sourceName: "s", sourceType: "live", providerId: "p", confidence: 1, ttlMs: 1000 });
  assert.equal(meta.expiresAt, undefined);
  assert.equal(meta.fetchedAt, undefined);
});

test("makeSourceMetadata accepts an ISO string fetchedAt", () => {
  const meta = makeSourceMetadata({
    sourceName: "s",
    sourceType: "live",
    providerId: "p",
    confidence: 1,
    fetchedAt: "2026-01-01T00:00:00.000Z",
    ttlMs: 1000,
  });
  assert.equal(meta.fetchedAt, "2026-01-01T00:00:00.000Z");
  assert.equal(meta.expiresAt, "2026-01-01T00:00:01.000Z");
});

test("unavailableSource has zero confidence and the unavailable type", () => {
  const meta = unavailableSource("seed-x", "Seed");
  assert.equal(meta.sourceType, "unavailable");
  assert.equal(meta.confidence, 0);
  assert.equal(meta.providerId, "seed-x");
  assert.equal(meta.attributionUrl, undefined);
});

test("attributionUrl is carried through when provided", () => {
  const meta = makeSourceMetadata({
    sourceName: "s",
    sourceType: "live",
    providerId: "p",
    confidence: 1,
    attributionUrl: "https://example.com/attribution",
  });
  assert.equal(meta.attributionUrl, "https://example.com/attribution");
});
