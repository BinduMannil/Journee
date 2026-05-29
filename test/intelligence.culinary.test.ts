import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getCulinaryProfile,
  culinaryFlags,
  CULINARY_DATA_NOTE,
} from "../src/lib/intelligence/culinary";
import { culinaryProfiles } from "../src/content/culinary";

test("getCulinaryProfile returns a profile for a known destination, null otherwise", () => {
  assert.equal(getCulinaryProfile("kyoto")?.destinationId, "kyoto");
  assert.equal(getCulinaryProfile("atlantis"), null);
});

test("every catalogued destination has dishes, a drink, and a non-empty note", () => {
  for (const p of culinaryProfiles) {
    assert.ok(p.popularDishes.length > 0, `${p.destinationId} dishes`);
    assert.ok(p.signatureDrink.length > 0, `${p.destinationId} drink`);
  }
  assert.match(CULINARY_DATA_NOTE, /not legal advice/i);
});

test("Marrakech flags pork-unavailable and the alcohol restrictions (halal context)", () => {
  const profile = getCulinaryProfile("marrakech")!;
  const flags = culinaryFlags(profile);
  const texts = flags.map((f) => f.text).join(" | ");
  assert.match(texts, /Pork is not available/i);
  assert.match(texts, /supermarkets/i); // alcohol not in ordinary supermarkets
  assert.match(texts, /public/i); // public drinking not permitted
  assert.ok(flags.some((f) => f.kind === "tip" && /mint tea/i.test(f.text)));
});

test("Kyoto (pork & beef common, public drinking ok) raises no diet/alcohol cautions", () => {
  const flags = culinaryFlags(getCulinaryProfile("kyoto")!);
  // No pork/beef prevalence caution (both common); alcohol is in shops + public ok.
  assert.equal(flags.some((f) => /Pork is|Beef is/.test(f.text)), false);
  assert.equal(flags.some((f) => /supermarkets|public/i.test(f.text)), false);
  assert.ok(flags.some((f) => f.kind === "tip"));
});

test("a 'limited' vegetarian destination surfaces a caution (Patagonia)", () => {
  const flags = culinaryFlags(getCulinaryProfile("patagonia")!);
  assert.ok(flags.some((f) => /Vegetarian options can be limited/i.test(f.text)));
});
