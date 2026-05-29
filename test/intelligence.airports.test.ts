import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getAirportsProfile,
  primaryAirport,
  AIRPORTS_DATA_NOTE,
} from "../src/lib/intelligence/airports";
import { airportsProfiles } from "../src/content/airports";

test("getAirportsProfile returns airports for a known destination, null otherwise", () => {
  assert.equal(getAirportsProfile("kyoto")?.destinationId, "kyoto");
  assert.equal(getAirportsProfile("atlantis"), null);
});

test("every airport has a code, terminals >= 1, a distance, and access modes", () => {
  for (const p of airportsProfiles) {
    assert.ok(p.airports.length > 0, `${p.destinationId} has airports`);
    for (const a of p.airports) {
      assert.match(a.code, /^[A-Z]{3}$/, `${a.code} IATA shape`);
      assert.ok(a.terminals >= 1, `${a.code} terminals`);
      assert.ok(a.distanceToCityKm >= 0, `${a.code} distance`);
      assert.ok(a.cityAccess.length > 0, `${a.code} access`);
      // Single-terminal airports must not claim an inter-terminal transfer.
      if (a.terminals === 1) assert.equal(a.interTerminalTransfer, "none", `${a.code} single-terminal`);
      else assert.notEqual(a.interTerminalTransfer, "none", `${a.code} multi-terminal`);
    }
  }
  assert.match(AIRPORTS_DATA_NOTE, /verify/i);
});

test("primaryAirport returns the first-listed airport; null for unknown dest", () => {
  assert.equal(primaryAirport("kyoto")?.code, "KIX");
  assert.equal(primaryAirport("marrakech")?.code, "RAK");
  assert.equal(primaryAirport("atlantis"), null);
});
