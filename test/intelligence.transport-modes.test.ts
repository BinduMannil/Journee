import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getTransportModes,
  isModeAvailable,
  modesByAvailability,
  TRANSPORT_MODES_NOTE,
} from "../src/lib/intelligence/transport-modes";
import { transportModesProfiles } from "../src/content/transport-modes";

const TRANSPORT_MODES = [
  "metro_subway",
  "bus",
  "tram",
  "train",
  "taxi",
  "rideshare",
  "tuk_tuk",
  "auto_rickshaw",
  "ferry",
  "water_taxi",
  "funicular",
  "cable_car",
  "scooter_rental",
  "atv_quad_rental",
  "car_rental",
  "bike_share",
  "horse_carriage",
  "walk",
];
const AVAILABILITIES = ["ubiquitous", "common", "limited", "tourist_only"];

test("getTransportModes returns a profile for a known destination, null otherwise", () => {
  assert.equal(getTransportModes("kyoto")?.destinationId, "kyoto");
  assert.equal(getTransportModes("atlantis"), null);
});

test("every profile has a non-empty summary and well-formed modes", () => {
  assert.ok(transportModesProfiles.length > 0);
  for (const p of transportModesProfiles) {
    assert.ok(p.summary.length > 0, `${p.destinationId} summary`);
    assert.ok(p.modes.length >= 3, `${p.destinationId} modes`);
    for (const m of p.modes) {
      assert.ok(TRANSPORT_MODES.includes(m.mode), `${p.destinationId} mode ${m.mode}`);
      assert.ok(AVAILABILITIES.includes(m.availability), `${p.destinationId} availability ${m.availability}`);
      assert.ok(m.note && m.note.length > 0, `${p.destinationId} ${m.mode} note`);
    }
  }
});

test("TRANSPORT_MODES_NOTE carries a clear, non-live disclaimer", () => {
  assert.match(TRANSPORT_MODES_NOTE, /not a live|verify|change/i);
  assert.match(TRANSPORT_MODES_NOTE, /transport|mode|fare/i);
});

test("isModeAvailable reflects catalogued modes; false for unknown", () => {
  assert.equal(isModeAvailable("kyoto", "bus"), true);
  assert.equal(isModeAvailable("kyoto", "tuk_tuk"), false);
  assert.equal(isModeAvailable("atlantis", "bus"), false);
});

test("modesByAvailability filters by level; [] for unknown", () => {
  const ubiquitous = modesByAvailability("kyoto", "ubiquitous");
  assert.ok(ubiquitous.length > 0);
  assert.ok(ubiquitous.every((m) => m.availability === "ubiquitous"));
  assert.deepEqual(modesByAvailability("atlantis", "common"), []);
});
