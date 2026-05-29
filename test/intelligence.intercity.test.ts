import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getIntercityOptions,
  recommendedRoutes,
  routesByMode,
  INTERCITY_DATA_NOTE,
} from "../src/lib/intelligence/intercity";
import { intercityProfiles } from "../src/content/intercity";

const INTERCITY_MODES = [
  "flight",
  "train",
  "high_speed_train",
  "bus",
  "ferry",
  "car",
  "shared_van",
];

test("getIntercityOptions returns a profile for a known destination, null otherwise", () => {
  assert.equal(getIntercityOptions("kyoto")?.destinationId, "kyoto");
  assert.equal(getIntercityOptions("atlantis"), null);
});

test("every profile has a non-empty summary and well-formed routes", () => {
  assert.ok(intercityProfiles.length > 0);
  for (const p of intercityProfiles) {
    assert.ok(p.summary.length > 0, `${p.destinationId} summary`);
    assert.ok(p.routes.length >= 3, `${p.destinationId} routes >= 3`);
    for (const r of p.routes) {
      assert.ok(r.to.length > 0, `${p.destinationId} route to`);
      assert.ok(INTERCITY_MODES.includes(r.mode), `${p.destinationId} mode ${r.mode}`);
      assert.ok(r.approxDuration.length > 0, `${p.destinationId} ${r.to} approxDuration`);
      assert.ok(r.frequency.length > 0, `${p.destinationId} ${r.to} frequency`);
      assert.ok(r.note.length > 0, `${p.destinationId} ${r.to} note`);
      assert.equal(typeof r.recommended, "boolean", `${p.destinationId} ${r.to} recommended`);
    }
    assert.ok(
      p.routes.some((r) => r.recommended),
      `${p.destinationId} has at least one recommended route`,
    );
  }
});

test("INTERCITY_DATA_NOTE carries a clear, non-live disclaimer", () => {
  assert.match(INTERCITY_DATA_NOTE, /not a live|verify|change/i);
  assert.match(INTERCITY_DATA_NOTE, /route|schedule|fare|book/i);
});

test("recommendedRoutes returns only recommended routes; [] for unknown", () => {
  const kyoto = recommendedRoutes("kyoto");
  assert.ok(kyoto.length > 0);
  assert.ok(kyoto.every((r) => r.recommended));
  assert.deepEqual(recommendedRoutes("atlantis"), []);
});

test("routesByMode filters by travel mode; [] for unknown", () => {
  const ferries = routesByMode("santorini", "ferry");
  assert.ok(ferries.length > 0);
  assert.ok(ferries.every((r) => r.mode === "ferry"));
  assert.deepEqual(routesByMode("atlantis", "flight"), []);
});
