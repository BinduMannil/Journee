import { test } from "node:test";
import assert from "node:assert/strict";
import {
  intensityForMood,
  moodIntensity,
  defaultMoodIntensity,
  featuredDestinations,
} from "../src/content/destinations";
import { platformSystems } from "../src/content/systems";

test("intensityForMood returns known values and falls back to default", () => {
  assert.equal(intensityForMood("Electric"), moodIntensity["Electric"]);
  assert.equal(intensityForMood("DefinitelyUnknownMood"), defaultMoodIntensity);
});

test("all mood intensities are within 0..1", () => {
  for (const v of Object.values(moodIntensity)) {
    assert.ok(v >= 0 && v <= 1, `intensity ${v} out of range`);
  }
  assert.ok(defaultMoodIntensity >= 0 && defaultMoodIntensity <= 1);
});

test("seed destinations have unique ids and required fields", () => {
  const ids = featuredDestinations.map((d) => d.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const d of featuredDestinations) {
    assert.ok(d.name && d.country && d.headline && d.mood && d.imageUrl);
  }
});

test("platform systems have valid statuses", () => {
  const valid = new Set(["live", "scaffold", "roadmap"]);
  for (const s of platformSystems) {
    assert.ok(valid.has(s.status), `bad status ${s.status} for ${s.name}`);
    assert.ok(s.name.length > 0 && s.note.length > 0);
  }
});
