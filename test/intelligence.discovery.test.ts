import { test } from "node:test";
import assert from "node:assert/strict";
import { rankByDNA, affinityFor, type TravelDNA } from "../src/lib/intelligence/travel-dna";
import { pathfind } from "../src/lib/intelligence/pathfinder";
import type { DestinationLike } from "../src/lib/intelligence/travel-dna";

const dests: DestinationLike[] = [
  { id: "kyoto", mood: "Contemplative" },
  { id: "marrakech", mood: "Electric" },
  { id: "santorini", mood: "Luminous" },
];

test("affinityFor returns neutral 0.5 for unknown moods", () => {
  assert.equal(affinityFor({ moodAffinity: {} }, "Electric"), 0.5);
  assert.equal(affinityFor({ moodAffinity: { Electric: 0.9 } }, "Electric"), 0.9);
});

test("rankByDNA orders by affinity, ties broken by id", () => {
  const dna: TravelDNA = { moodAffinity: { Contemplative: 0.9, Electric: 0.1 } };
  const ranked = rankByDNA(dna, dests);
  assert.equal(ranked[0]?.id, "kyoto"); // 0.9
  assert.equal(ranked[ranked.length - 1]?.id, "marrakech"); // 0.1
  assert.ok(ranked.every((r) => r.score >= 0 && r.score <= 100));
});

test("pathfind ranks the desired vibe first and avoided moods last", () => {
  const ranked = pathfind(dests, { vibe: "Electric", avoid: ["Luminous"] });
  assert.equal(ranked[0]?.id, "marrakech"); // matches vibe -> 100
  assert.equal(ranked[ranked.length - 1]?.id, "santorini"); // avoided -> 0
});

test("pathfind with no query is neutral and deterministic", () => {
  const a = pathfind(dests, {});
  const b = pathfind(dests, {});
  assert.deepEqual(a, b);
  assert.ok(a.every((r) => r.score === 50));
});
