import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getChainsProfile,
  chainsForCategory,
  CHAINS_DATA_NOTE,
} from "../src/lib/intelligence/chains";
import { chainsProfiles, CHAIN_CATEGORIES } from "../src/content/chains";

test("getChainsProfile returns a profile for a known destination, null otherwise", () => {
  assert.equal(getChainsProfile("kyoto")?.destinationId, "kyoto");
  assert.equal(getChainsProfile("atlantis"), null);
});

test("every destination defines all chain categories (arrays, possibly empty)", () => {
  for (const p of chainsProfiles) {
    for (const cat of CHAIN_CATEGORIES) {
      assert.ok(Array.isArray(p.chains[cat]), `${p.destinationId}.${cat}`);
    }
    // At least the staple categories should be populated.
    assert.ok(p.chains.coffee.length > 0 && p.chains.supermarket.length > 0 && p.chains.hospital.length > 0);
  }
  assert.match(CHAINS_DATA_NOTE, /verify locally/i);
});

test("chainsForCategory returns the category list, or [] for unknown dest/category", () => {
  assert.ok(chainsForCategory("kyoto", "coffee").includes("Starbucks"));
  assert.ok(chainsForCategory("marrakech", "supermarket").includes("Carrefour"));
  assert.deepEqual(chainsForCategory("atlantis", "cinema"), []);
});
