import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getInclusionProfile,
  INCLUSION_DATA_NOTE,
} from "../src/lib/intelligence/inclusion";
import { inclusionProfiles } from "../src/content/inclusion";

const LEGAL_STATUSES = ["legal", "restricted", "illegal", "varies"];
const ACCEPTANCES = ["high", "moderate", "low"];

test("getInclusionProfile returns a profile for a known destination, null otherwise", () => {
  assert.equal(getInclusionProfile("kyoto")?.destinationId, "kyoto");
  assert.equal(getInclusionProfile("atlantis"), null);
});

test("every profile has lgbtq/religiousMinorities/soloWomen with valid enums and notes", () => {
  assert.ok(inclusionProfiles.length > 0, "profiles present");
  for (const p of inclusionProfiles) {
    assert.ok(LEGAL_STATUSES.includes(p.lgbtq.legalStatus), `${p.destinationId} legalStatus`);
    assert.ok(ACCEPTANCES.includes(p.lgbtq.socialClimate), `${p.destinationId} socialClimate`);
    assert.equal(typeof p.lgbtq.sameSexMarriage, "boolean", `${p.destinationId} sameSexMarriage`);
    assert.ok(p.lgbtq.note, `${p.destinationId} lgbtq note`);
    assert.ok(p.religiousMinorities.note, `${p.destinationId} religiousMinorities note`);
    assert.ok(p.soloWomen.note, `${p.destinationId} soloWomen note`);
  }
});

test("factual specifics: Morocco illegal, Greece same-sex marriage legal", () => {
  assert.equal(getInclusionProfile("marrakech")?.lgbtq.legalStatus, "illegal");
  assert.equal(getInclusionProfile("santorini")?.lgbtq.sameSexMarriage, true);
});

test("INCLUSION_DATA_NOTE carries a verify disclaimer mentioning advisories", () => {
  assert.match(INCLUSION_DATA_NOTE, /verify/i);
  assert.match(INCLUSION_DATA_NOTE, /advisor/i);
});
