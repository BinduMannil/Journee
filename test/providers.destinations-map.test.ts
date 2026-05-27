import { test } from "node:test";
import assert from "node:assert/strict";
import { mapRow, type DestinationRow } from "../src/lib/providers/destinations.supabase";

const base: DestinationRow = {
  id: "kyoto",
  name: "Kyoto",
  country: "Japan",
  headline: "Lantern-lit alleys.",
  mood: "Contemplative",
  image_url: "https://example.com/kyoto.jpg",
  latitude: 35.0116,
  longitude: 135.7681,
  description: "Slow rituals.",
  best_time: "Late November.",
};

test("maps a full row including coordinates and editorial fields", () => {
  const d = mapRow(base);
  assert.equal(d.imageUrl, base.image_url);
  assert.deepEqual(d.coordinates, { lat: 35.0116, lon: 135.7681 });
  assert.equal(d.description, "Slow rituals.");
  assert.equal(d.bestTime, "Late November.");
});

test("omits coordinates unless both latitude and longitude are present", () => {
  assert.equal(mapRow({ ...base, latitude: null }).coordinates, undefined);
  assert.equal(mapRow({ ...base, longitude: null }).coordinates, undefined);
  assert.equal(mapRow({ ...base, latitude: null, longitude: null }).coordinates, undefined);
});

test("maps null editorial fields to undefined", () => {
  const d = mapRow({ ...base, description: null, best_time: null });
  assert.equal(d.description, undefined);
  assert.equal(d.bestTime, undefined);
});
