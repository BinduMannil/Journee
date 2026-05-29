import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getTippingProfile,
  tippingSummaryLine,
  TIPPING_DATA_NOTE,
} from "../src/lib/intelligence/tipping";
import { tippingProfiles } from "../src/content/tipping";

const EXPECTATIONS = ["not_expected", "round_up", "appreciated", "expected"];

test("getTippingProfile returns a profile for a known destination, null otherwise", () => {
  assert.equal(getTippingProfile("kyoto")?.destinationId, "kyoto");
  assert.equal(getTippingProfile("atlantis"), null);
});

test("every profile has required fields with valid TippingExpectation values", () => {
  assert.ok(tippingProfiles.length > 0, "profiles present");
  for (const p of tippingProfiles) {
    assert.ok(p.destinationId, `${p.destinationId} id`);
    assert.ok(EXPECTATIONS.includes(p.restaurants), `${p.destinationId} restaurants`);
    assert.ok(EXPECTATIONS.includes(p.taxis), `${p.destinationId} taxis`);
    assert.equal(typeof p.serviceChargeIncluded, "boolean", `${p.destinationId} serviceChargeIncluded`);
    assert.ok(p.hotels, `${p.destinationId} hotels`);
    assert.ok(p.summary, `${p.destinationId} summary`);
    if (p.restaurantPct !== undefined) {
      assert.ok(p.restaurantPct.length > 0, `${p.destinationId} restaurantPct`);
    }
  }
  assert.match(TIPPING_DATA_NOTE, /verify/i);
});

test("Japan (kyoto) does not expect tipping in restaurants", () => {
  assert.equal(getTippingProfile("kyoto")?.restaurants, "not_expected");
});

test("tippingSummaryLine returns a non-empty string mentioning Restaurants", () => {
  for (const p of tippingProfiles) {
    const line = tippingSummaryLine(p);
    assert.ok(line.length > 0, `${p.destinationId} line non-empty`);
    assert.match(line, /Restaurants/);
  }
});
