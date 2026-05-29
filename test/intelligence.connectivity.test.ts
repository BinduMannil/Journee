import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getConnectivityProfile,
  tapWaterAdvice,
  CONNECTIVITY_DATA_NOTE,
} from "../src/lib/intelligence/connectivity";
import { connectivityProfiles } from "../src/content/connectivity";

test("getConnectivityProfile returns a profile for a known destination, null otherwise", () => {
  assert.equal(getConnectivityProfile("kyoto")?.destinationId, "kyoto");
  assert.equal(getConnectivityProfile("atlantis"), null);
});

test("every profile has plugTypes, voltage, simOptions and a boolean tapWaterPotable", () => {
  for (const p of connectivityProfiles) {
    assert.ok(p.plugTypes.length > 0, `${p.destinationId} plugTypes`);
    assert.ok(p.voltage, `${p.destinationId} voltage`);
    assert.ok(p.simOptions.length > 0, `${p.destinationId} simOptions`);
    assert.equal(typeof p.tapWaterPotable, "boolean", `${p.destinationId} tapWaterPotable`);
    assert.ok(p.connectivityNote, `${p.destinationId} connectivityNote`);
  }
  assert.match(CONNECTIVITY_DATA_NOTE, /verify/i);
});

test("tapWaterAdvice gives bottled-water advice for marrakech, safe advice for kyoto, null for unknown", () => {
  assert.equal(tapWaterAdvice("marrakech"), "Stick to bottled water.");
  assert.equal(tapWaterAdvice("kyoto"), "Tap water is generally safe to drink.");
  assert.equal(tapWaterAdvice("atlantis"), null);
});
