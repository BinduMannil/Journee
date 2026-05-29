import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getPackingProfile,
  packingForSeason,
  essentialItems,
  PACKING_DATA_NOTE,
} from "../src/lib/intelligence/packing";
import { packingProfiles } from "../src/content/packing";

const SEASONS = ["spring", "summer", "autumn", "winter"];
const PRIORITIES = ["essential", "recommended", "optional"];

test("getPackingProfile returns a profile for a known destination, null otherwise", () => {
  assert.equal(getPackingProfile("kyoto")?.destinationId, "kyoto");
  assert.equal(getPackingProfile("atlantis"), null);
});

test("every profile has a summary, year-round items and well-formed seasonal blocks", () => {
  assert.ok(packingProfiles.length > 0);
  for (const p of packingProfiles) {
    assert.ok(p.summary.length > 0, `${p.destinationId} summary`);
    assert.ok(p.yearRound.length > 0, `${p.destinationId} yearRound`);
    assert.ok(p.seasonal.length > 0, `${p.destinationId} seasonal`);

    const checkItem = (i: { item: string; priority: string; reason: string }, ctx: string) => {
      assert.ok(i.item.length > 0, `${ctx} item name`);
      assert.ok(PRIORITIES.includes(i.priority), `${ctx} priority ${i.priority}`);
      assert.ok(i.reason.length > 0, `${ctx} reason`);
    };

    for (const i of p.yearRound) checkItem(i, `${p.destinationId} yearRound`);
    for (const s of p.seasonal) {
      assert.ok(SEASONS.includes(s.season), `${p.destinationId} season ${s.season}`);
      assert.ok(s.items.length > 0, `${p.destinationId} ${s.season} items`);
      for (const i of s.items) checkItem(i, `${p.destinationId} ${s.season}`);
    }
  }
});

test("PACKING_DATA_NOTE carries a clear, non-guarantee disclaimer", () => {
  assert.match(PACKING_DATA_NOTE, /forecast|weather|verify|vary/i);
  assert.match(PACKING_DATA_NOTE, /pack/i);
});

test("packingForSeason merges year-round with seasonal items; [] for unknown", () => {
  const winter = packingForSeason("kyoto", "winter");
  const profile = getPackingProfile("kyoto");
  assert.ok(profile);
  const seasonalCount = profile.seasonal.find((s) => s.season === "winter")?.items.length ?? 0;
  assert.equal(winter.length, profile.yearRound.length + seasonalCount);
  // includes a year-round item and a winter-specific one
  assert.ok(winter.some((i) => i.item === "Comfortable walking shoes"));
  assert.ok(winter.some((i) => i.item === "Warm coat and thermal layers"));
  assert.deepEqual(packingForSeason("atlantis", "winter"), []);
});

test("essentialItems returns only essential item names", () => {
  const essentials = essentialItems("patagonia", "winter");
  const all = packingForSeason("patagonia", "winter");
  const expected = all.filter((i) => i.priority === "essential").map((i) => i.item);
  assert.deepEqual(essentials, expected);
  assert.ok(essentials.length > 0);
  assert.deepEqual(essentialItems("atlantis", "summer"), []);
});
