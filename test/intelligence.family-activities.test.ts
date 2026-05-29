import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getFamilyActivities,
  activitiesForAge,
  activitiesByKind,
  FAMILY_DATA_NOTE,
} from "../src/lib/intelligence/family-activities";
import { familyActivitiesProfiles } from "../src/content/family-activities";

const ACTIVITY_KINDS = [
  "animals_nature",
  "museum_interactive",
  "outdoor_play",
  "boat_water",
  "ride_transport",
  "cultural",
  "food_treat",
  "easy_walk",
];
const AGE_SUITABILITIES = [
  "toddlers",
  "young_kids",
  "older_kids",
  "teens",
  "all_ages",
];

test("getFamilyActivities returns a profile for a known destination, null otherwise", () => {
  assert.equal(getFamilyActivities("kyoto")?.destinationId, "kyoto");
  assert.equal(getFamilyActivities("atlantis"), null);
});

test("every profile has a non-empty summary, boolean strollerFriendly and well-formed activities", () => {
  assert.ok(familyActivitiesProfiles.length > 0);
  for (const p of familyActivitiesProfiles) {
    assert.ok(p.summary.length > 0, `${p.destinationId} summary`);
    assert.equal(typeof p.strollerFriendly, "boolean", `${p.destinationId} strollerFriendly`);
    assert.ok(p.activities.length >= 3, `${p.destinationId} activities count`);
    for (const a of p.activities) {
      assert.ok(a.name.length > 0, `${p.destinationId} activity name`);
      assert.ok(a.note.length > 0, `${p.destinationId} ${a.name} note`);
      assert.ok(ACTIVITY_KINDS.includes(a.kind), `${p.destinationId} kind ${a.kind}`);
      assert.ok(a.suitableFor.length >= 1, `${p.destinationId} ${a.name} suitableFor count`);
      for (const age of a.suitableFor) {
        assert.ok(AGE_SUITABILITIES.includes(age), `${p.destinationId} ${a.name} age ${age}`);
      }
    }
  }
});

test("FAMILY_DATA_NOTE carries a verify/suitability disclaimer aimed at children", () => {
  assert.match(FAMILY_DATA_NOTE, /verify|suitab|individual|change/i);
  assert.match(FAMILY_DATA_NOTE, /child|kid|safety|famil/i);
});

test("activitiesForAge includes all_ages matches; [] for unknown", () => {
  const teens = activitiesForAge("santorini", "teens");
  assert.ok(teens.length > 0);
  assert.ok(
    teens.every((a) => a.suitableFor.includes("teens") || a.suitableFor.includes("all_ages")),
  );
  // includes an all_ages-only activity even though we asked for teens
  assert.ok(teens.some((a) => !a.suitableFor.includes("teens") && a.suitableFor.includes("all_ages")));
  assert.deepEqual(activitiesForAge("atlantis", "teens"), []);
});

test("activitiesByKind filters by kind; [] for unknown destination or kind", () => {
  const water = activitiesByKind("santorini", "boat_water");
  assert.ok(water.length > 0);
  assert.ok(water.every((a) => a.kind === "boat_water"));
  assert.deepEqual(activitiesByKind("kyoto", "food_treat"), []);
  assert.deepEqual(activitiesByKind("atlantis", "boat_water"), []);
});
