import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getUvProtectionProfile,
  protectionFor,
  isHighUv,
  UV_PROTECTION_NOTE,
} from "../src/lib/intelligence/uv-protection";
import { uvProtectionProfiles } from "../src/content/uv-protection";

const UV_BANDS = ["low", "moderate", "high", "very_high", "extreme"];
const PROTECTION_ELEMENTS = ["sun", "heat", "wind", "cold", "rain"];

test("getUvProtectionProfile returns a profile for a known destination, null otherwise", () => {
  assert.equal(getUvProtectionProfile("marrakech")?.destinationId, "marrakech");
  assert.equal(getUvProtectionProfile("atlantis"), null);
});

test("every profile has a valid UV band, months, summary and well-formed customs", () => {
  assert.ok(uvProtectionProfiles.length > 0);
  for (const p of uvProtectionProfiles) {
    assert.ok(UV_BANDS.includes(p.peakUvBand), `${p.destinationId} peakUvBand`);
    assert.ok(p.peakUvMonths.length > 0, `${p.destinationId} peakUvMonths`);
    assert.ok(p.summary.length > 0, `${p.destinationId} summary`);
    assert.ok(p.customs.length >= 1, `${p.destinationId} customs`);
    for (const c of p.customs) {
      assert.ok(PROTECTION_ELEMENTS.includes(c.element), `${p.destinationId} element ${c.element}`);
      assert.ok(c.custom && c.custom.length > 0, `${p.destinationId} ${c.element} custom`);
    }
  }
});

test("UV_PROTECTION_NOTE carries a strong, non-forecast disclaimer", () => {
  assert.match(UV_PROTECTION_NOTE, /UV/i);
  assert.match(UV_PROTECTION_NOTE, /not a (forecast|prediction|live)/i);
});

test("protectionFor returns customs filtered by element; [] for unknown", () => {
  const sun = protectionFor("santorini", "sun");
  assert.ok(sun.length >= 1);
  assert.ok(sun.every((c) => c.element === "sun"));
  assert.deepEqual(protectionFor("atlantis", "sun"), []);
});

test("isHighUv reflects the peak UV band; false for unknown", () => {
  assert.equal(isHighUv("marrakech"), true);
  assert.equal(isHighUv("santorini"), true);
  assert.equal(isHighUv("patagonia"), true);
  assert.equal(isHighUv("kyoto"), true);
  assert.equal(isHighUv("atlantis"), false);
});
