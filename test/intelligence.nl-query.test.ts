import { test } from "node:test";
import assert from "node:assert/strict";
import { parseQuery, MOOD_SYNONYMS } from "../src/lib/intelligence/nl-query";

test("maps a positive mood phrase to a vibe", () => {
  const q = parseQuery("somewhere calm and quiet");
  assert.equal(q.vibe, "Contemplative");
  assert.deepEqual(q.avoid, []);
  assert.ok(q.matched.includes("calm"));
});

test("detects negation into avoid", () => {
  const q = parseQuery("warm but not too lively");
  assert.equal(q.vibe, "Luminous"); // warm → Luminous
  assert.deepEqual(q.avoid, ["Electric"]); // not lively → avoid Electric
});

test("negation overrides a positive mention of the same mood", () => {
  const q = parseQuery("lively but actually no nightlife");
  // both map to Electric; the explicit "no" wins → avoided, no vibe
  assert.deepEqual(q.avoid, ["Electric"]);
  assert.equal(q.vibe, undefined);
});

test("handles several avoids", () => {
  const q = parseQuery("peaceful, without crowds and not wild");
  assert.equal(q.vibe, "Contemplative");
  assert.ok(q.avoid.includes("Untamed"));
});

test("empty / unrecognized input is a safe empty query", () => {
  const q = parseQuery("xyzzy 123 ???");
  assert.equal(q.vibe, undefined);
  assert.deepEqual(q.avoid, []);
  assert.deepEqual(q.matched, []);
});

test("synonym table only references real catalog moods", () => {
  const moods = new Set(Object.values(MOOD_SYNONYMS));
  for (const m of moods) {
    assert.ok(["Contemplative", "Luminous", "Electric", "Untamed"].includes(m), m);
  }
});

test("parsing is deterministic", () => {
  const text = "bright and adventurous, not busy";
  assert.deepEqual(parseQuery(text), parseQuery(text));
});
