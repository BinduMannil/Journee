import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getHealthcareProfile,
  facilitiesByKind,
  hasHospital,
  HEALTHCARE_DATA_NOTE,
} from "../src/lib/intelligence/healthcare";
import { healthcareProfiles } from "../src/content/healthcare";

const FACILITY_KINDS = ["hospital", "clinic", "pharmacy", "dental"];

test("getHealthcareProfile returns a profile for a known destination, null otherwise", () => {
  assert.equal(getHealthcareProfile("kyoto")?.destinationId, "kyoto");
  assert.equal(getHealthcareProfile("atlantis"), null);
});

test("every profile has a summary, pharmacy note and well-formed facilities", () => {
  assert.ok(healthcareProfiles.length > 0);
  for (const p of healthcareProfiles) {
    assert.ok(p.summary.length > 0, `${p.destinationId} summary`);
    assert.ok(p.pharmacyNote.length > 0, `${p.destinationId} pharmacyNote`);
    assert.ok(p.facilities.length > 0, `${p.destinationId} facilities`);
    for (const f of p.facilities) {
      assert.ok(f.name.length > 0, `${p.destinationId} facility name`);
      assert.ok(FACILITY_KINDS.includes(f.kind), `${p.destinationId} kind ${f.kind}`);
      assert.ok(f.area.length > 0, `${p.destinationId} ${f.name} area`);
      assert.ok(f.note.length > 0, `${p.destinationId} ${f.name} note`);
    }
  }
});

test("HEALTHCARE_DATA_NOTE makes the non-medical, non-endorsement nature explicit", () => {
  assert.match(HEALTHCARE_DATA_NOTE, /not medical advice/i);
  assert.match(HEALTHCARE_DATA_NOTE, /endorsement|verify/i);
});

test("facilitiesByKind filters by kind; [] for unknown destination", () => {
  const hospitals = facilitiesByKind("kyoto", "hospital");
  assert.ok(hospitals.length > 0);
  assert.ok(hospitals.every((f) => f.kind === "hospital"));
  assert.deepEqual(facilitiesByKind("atlantis", "hospital"), []);
});

test("hasHospital is true where a hospital is catalogued, false for unknown", () => {
  assert.equal(hasHospital("santorini"), true);
  assert.equal(hasHospital("atlantis"), false);
});
