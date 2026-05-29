import { test } from "node:test";
import assert from "node:assert/strict";
import {
  generatePackingList,
  tempBand,
  type PackingCategory,
} from "../src/lib/intelligence/packing";

function flat(list: readonly PackingCategory[]): string[] {
  return list.flatMap((c) => c.items);
}

test("tempBand classifies the boundaries", () => {
  assert.equal(tempBand(-5), "freezing");
  assert.equal(tempBand(4.9), "freezing");
  assert.equal(tempBand(10), "cold");
  assert.equal(tempBand(18), "mild");
  assert.equal(tempBand(25), "warm");
  assert.equal(tempBand(30), "hot");
});

test("minimal input yields the universal baseline plus clothing", () => {
  const list = generatePackingList({ conditions: { temperatureC: 18 } });
  const cats = list.map((c) => c.category);
  assert.ok(cats.includes("Essentials"));
  assert.ok(cats.includes("Clothing"));
  assert.ok(!cats.includes("Activities"));
  assert.ok(!cats.includes("Reminders"));
});

test("cold trips pack warm layers; hot trips pack sun protection", () => {
  const cold = flat(generatePackingList({ conditions: { temperatureC: -2 } }));
  assert.ok(cold.some((i) => /thermal/i.test(i)));
  assert.ok(cold.includes("Lip balm"));

  const hot = flat(generatePackingList({ conditions: { temperatureC: 32 } }));
  assert.ok(hot.includes("Sunscreen"));
  assert.ok(hot.includes("Sunglasses"));
});

test("rain and poor air quality add the right items", () => {
  const list = flat(
    generatePackingList({ conditions: { temperatureC: 16, aqi: 130 }, rainChance: 0.5 }),
  );
  assert.ok(list.includes("Compact umbrella"));
  assert.ok(list.includes("Face mask (air quality)"));
});

test("activities contribute deduped, relevant gear", () => {
  const list = generatePackingList({
    conditions: { temperatureC: 24 },
    activities: ["beach", "swimming", "photography"],
  });
  const activities = list.find((c) => c.category === "Activities");
  assert.ok(activities);
  // "Swimwear" appears in both beach and swimming but must be deduped.
  const count = activities!.items.filter((i) => i === "Swimwear").length;
  assert.equal(count, 1);
  assert.ok(activities!.items.includes("Camera & lenses"));
});

test("long trips add a laundry reminder; short trips do not", () => {
  const long = generatePackingList({ conditions: { temperatureC: 20 }, durationDays: 10 });
  assert.ok(long.some((c) => c.category === "Reminders"));
  const short = generatePackingList({ conditions: { temperatureC: 20 }, durationDays: 3 });
  assert.ok(!short.some((c) => c.category === "Reminders"));
});

test("generation is deterministic", () => {
  const input = {
    conditions: { temperatureC: 12, aqi: 40 },
    rainChance: 0.4,
    activities: ["hiking", "city"] as const,
    durationDays: 8,
  };
  assert.deepEqual(generatePackingList(input), generatePackingList(input));
});
