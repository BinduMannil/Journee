import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getLocalGems,
  gemsByKind,
  GEMS_DATA_NOTE,
} from "../src/lib/intelligence/local-gems";
import { gemsProfiles } from "../src/content/local-gems";

test("getLocalGems returns gems for a known destination, null otherwise", () => {
  assert.equal(getLocalGems("kyoto")?.destinationId, "kyoto");
  assert.equal(getLocalGems("atlantis"), null);
});

test("every gem has name/area/whatToTry/why and a valid kind", () => {
  for (const p of gemsProfiles) {
    assert.ok(p.gems.length > 0, `${p.destinationId} has gems`);
    for (const g of p.gems) {
      assert.ok(g.name && g.area && g.whatToTry && g.why, `${p.destinationId} gem fields`);
      assert.ok(g.kind === "eat" || g.kind === "drink", `${g.name} kind`);
    }
  }
  assert.match(GEMS_DATA_NOTE, /verify it's open/i);
});

test("gemsByKind filters eat vs drink; unknown dest → []", () => {
  const eats = gemsByKind("kyoto", "eat");
  const drinks = gemsByKind("kyoto", "drink");
  assert.ok(eats.length > 0 && eats.every((g) => g.kind === "eat"));
  assert.ok(drinks.length > 0 && drinks.every((g) => g.kind === "drink"));
  assert.deepEqual(gemsByKind("atlantis", "eat"), []);
});
