import { test } from "node:test";
import assert from "node:assert/strict";
import {
  editorialCoverage,
  editorialConfidence,
  EDITORIAL_FEATURE_KEYS,
} from "../src/lib/intelligence/editorial-confidence";

test("feature keys are non-empty, unique and sorted", () => {
  assert.ok(EDITORIAL_FEATURE_KEYS.length > 10);
  const unique = new Set(EDITORIAL_FEATURE_KEYS);
  assert.equal(unique.size, EDITORIAL_FEATURE_KEYS.length);
  assert.deepEqual([...EDITORIAL_FEATURE_KEYS], [...EDITORIAL_FEATURE_KEYS].sort());
});

test("a fully-seeded destination has high coverage and present+missing partition the keys", () => {
  const cov = editorialCoverage("kyoto");
  assert.equal(cov.destinationId, "kyoto");
  assert.equal(cov.total, EDITORIAL_FEATURE_KEYS.length);
  assert.equal(cov.covered, cov.present.length);
  assert.equal(cov.present.length + cov.missing.length, cov.total);
  assert.ok(cov.coverage > 0.8, `coverage=${cov.coverage}`);
  assert.equal(cov.coverage, editorialConfidence("kyoto"));
});

test("an unknown destination has zero coverage and everything missing", () => {
  const cov = editorialCoverage("atlantis");
  assert.equal(cov.covered, 0);
  assert.deepEqual([...cov.present], []);
  assert.equal(cov.missing.length, cov.total);
  assert.equal(cov.coverage, 0);
});

test("coverage is the covered/total ratio rounded to 2dp", () => {
  const cov = editorialCoverage("santorini");
  assert.equal(cov.coverage, Math.round((cov.covered / cov.total) * 100) / 100);
});
