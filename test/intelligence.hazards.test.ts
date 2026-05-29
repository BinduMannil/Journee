import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getHazardsProfile,
  highRiskHazards,
  HAZARDS_DATA_NOTE,
} from "../src/lib/intelligence/hazards";
import { hazardsProfiles } from "../src/content/hazards";

const HAZARD_TYPES = [
  "earthquake",
  "volcano",
  "typhoon",
  "hurricane",
  "wildfire",
  "flood",
  "tsunami",
  "extreme_heat",
  "extreme_cold",
];
const RISK_LEVELS = ["low", "moderate", "elevated", "high"];
const CONFLICT_STATUSES = ["none", "localized_unrest", "active_conflict"];

test("getHazardsProfile returns a profile for a known destination, null otherwise", () => {
  assert.equal(getHazardsProfile("kyoto")?.destinationId, "kyoto");
  assert.equal(getHazardsProfile("atlantis"), null);
});

test("every profile has a valid advisory level, conflict status and well-formed hazards", () => {
  assert.ok(hazardsProfiles.length > 0);
  for (const p of hazardsProfiles) {
    assert.ok(p.advisoryLevel >= 1 && p.advisoryLevel <= 4, `${p.destinationId} advisoryLevel`);
    assert.ok(p.advisorySummary.length > 0, `${p.destinationId} advisorySummary`);
    assert.ok(CONFLICT_STATUSES.includes(p.conflictStatus), `${p.destinationId} conflictStatus`);
    assert.ok(p.naturalHazards.length > 0, `${p.destinationId} hazards`);
    for (const h of p.naturalHazards) {
      assert.ok(HAZARD_TYPES.includes(h.type), `${p.destinationId} hazard type ${h.type}`);
      assert.ok(RISK_LEVELS.includes(h.risk), `${p.destinationId} risk ${h.risk}`);
      assert.ok(h.note && h.note.length > 0, `${p.destinationId} ${h.type} note`);
    }
  }
});

test("HAZARDS_DATA_NOTE carries a strong, non-predictive disclaimer", () => {
  assert.match(HAZARDS_DATA_NOTE, /advisor/i);
  assert.match(HAZARDS_DATA_NOTE, /not a (forecast|prediction|guarantee)/i);
});

test("highRiskHazards returns elevated/high hazards; [] for unknown", () => {
  const marrakech = highRiskHazards("marrakech");
  const types = marrakech.map((h) => h.type).sort();
  assert.deepEqual(types, ["earthquake", "extreme_heat"]);
  assert.ok(marrakech.every((h) => h.risk === "elevated" || h.risk === "high"));
  assert.deepEqual(highRiskHazards("atlantis"), []);
});
