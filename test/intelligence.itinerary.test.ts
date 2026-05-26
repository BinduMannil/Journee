import { test } from "node:test";
import assert from "node:assert/strict";
import { buildItinerary, type ItineraryItem } from "../src/lib/intelligence/itinerary";

const items: ItineraryItem[] = [
  { id: "a", title: "Temple dawn", intensity: 0.6 },
  { id: "b", title: "Market walk", intensity: 0.5 },
  { id: "c", title: "Mountain hike", intensity: 0.9 },
  { id: "d", title: "Tea house", intensity: 0.3 },
];

function totalItems(days: { items: readonly unknown[] }[]): number {
  return days.reduce((n, d) => n + d.items.length, 0);
}

test("all items are scheduled exactly once", () => {
  for (const pacing of ["relaxed", "balanced", "packed"] as const) {
    const it = buildItinerary(items, pacing);
    assert.equal(totalItems([...it.days]), items.length);
  }
});

test("relaxed pacing uses at least as many days as packed", () => {
  const relaxed = buildItinerary(items, "relaxed");
  const packed = buildItinerary(items, "packed");
  assert.ok(relaxed.days.length >= packed.days.length);
});

test("no multi-item day exceeds its pacing budget", () => {
  const it = buildItinerary(items, "balanced");
  for (const day of it.days) {
    if (day.items.length > 1) assert.ok(day.load <= 1.8 + 1e-9, `load ${day.load}`);
  }
});

test("an oversized single item gets its own day", () => {
  const it = buildItinerary([{ id: "x", title: "Epic", intensity: 1 }], "relaxed");
  assert.equal(it.days.length, 1);
  assert.equal(it.days[0]?.items.length, 1);
});

test("empty input yields no days; output is deterministic", () => {
  assert.deepEqual(buildItinerary([], "balanced").days, []);
  assert.deepEqual(buildItinerary(items, "packed"), buildItinerary(items, "packed"));
});
