import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getDayTrips,
  dayTripsByType,
  DAY_TRIPS_DATA_NOTE,
} from "../src/lib/intelligence/day-trips";
import { dayTripsProfiles } from "../src/content/day-trips";

const DAY_TRIP_TYPES = [
  "nature",
  "historic",
  "beach",
  "town",
  "mountains",
  "desert",
  "island",
  "wine_food",
];

test("getDayTrips returns a profile for a known destination, null otherwise", () => {
  assert.equal(getDayTrips("kyoto")?.destinationId, "kyoto");
  assert.equal(getDayTrips("atlantis"), null);
});

test("every profile has a summary and well-formed trips", () => {
  assert.ok(dayTripsProfiles.length > 0);
  for (const p of dayTripsProfiles) {
    assert.ok(p.summary.length > 0, `${p.destinationId} summary`);
    assert.ok(p.trips.length > 0, `${p.destinationId} trips`);
    for (const t of p.trips) {
      assert.ok(t.name.length > 0, `${p.destinationId} trip name`);
      assert.ok(t.travelTime.length > 0, `${p.destinationId} ${t.name} travelTime`);
      assert.ok(t.note.length > 0, `${p.destinationId} ${t.name} note`);
      assert.ok(t.types.length > 0, `${p.destinationId} ${t.name} types`);
      assert.ok(t.types.every((x) => DAY_TRIP_TYPES.includes(x)), `${p.destinationId} ${t.name} type`);
    }
  }
});

test("DAY_TRIPS_DATA_NOTE labels times as approximate, not a live feed", () => {
  assert.match(DAY_TRIPS_DATA_NOTE, /approximate|not a live/i);
  assert.match(DAY_TRIPS_DATA_NOTE, /verify|change/i);
});

test("dayTripsByType filters by type; [] for unknown", () => {
  const historic = dayTripsByType("kyoto", "historic");
  assert.ok(historic.length > 0);
  assert.ok(historic.every((t) => t.types.includes("historic")));
  assert.deepEqual(dayTripsByType("atlantis", "historic"), []);
});
