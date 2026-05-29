import { test } from "node:test";
import assert from "node:assert/strict";
import {
  similarity,
  similarDestinations,
} from "../src/lib/intelligence/similar";

const catalog = [
  { id: "kyoto", mood: "Contemplative", country: "Japan", bestMonths: [4, 11] },
  { id: "nara", mood: "Contemplative", country: "Japan", bestMonths: [4, 11] },
  { id: "santorini", mood: "Luminous", country: "Greece", bestMonths: [5, 6, 9] },
  { id: "marrakech", mood: "Electric", country: "Morocco", bestMonths: [3, 4, 5] },
];

test("similarity rewards shared mood most, then country and season", () => {
  const kyoto = catalog[0]!;
  const nara = catalog[1]!; // same mood + country + season
  const santorini = catalog[2]!; // nothing shared
  assert.ok(similarity(kyoto, nara) > similarity(kyoto, santorini));
  assert.equal(similarity(kyoto, nara), 1); // identical attributes → max
});

test("similarDestinations excludes the target and ranks by score", () => {
  const matches = similarDestinations(catalog[0]!, catalog);
  assert.ok(!matches.some((m) => m.id === "kyoto"));
  assert.equal(matches[0]!.id, "nara"); // most similar
  for (let i = 1; i < matches.length; i++) {
    assert.ok(matches[i - 1]!.score >= matches[i]!.score);
  }
});

test("similarDestinations honours the limit", () => {
  assert.equal(similarDestinations(catalog[0]!, catalog, 1).length, 1);
  assert.equal(similarDestinations(catalog[0]!, catalog, 0).length, 0);
});

test("match carries a human-readable reason", () => {
  const [top] = similarDestinations(catalog[0]!, catalog, 1);
  assert.match(top!.reason, /mood/);
});
