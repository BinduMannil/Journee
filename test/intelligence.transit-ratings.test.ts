import { test } from "node:test";
import assert from "node:assert/strict";
import {
  overallScore,
  getAirportServiceRating,
  airportRatingsForDestination,
  getAirlineRating,
  airlineClassRatings,
  TRANSIT_RATINGS_NOTE,
} from "../src/lib/intelligence/transit-ratings";
import { airportServiceRatings, airlineRatings } from "../src/content/transit-ratings";
import { airportsProfiles } from "../src/content/airports";

const DIMS = ["staff", "cleanliness", "comfort", "value"] as const;

test("all editorial ratings are within 0..5", () => {
  for (const a of airportServiceRatings) for (const d of DIMS) assert.ok(a.ratings[d] >= 0 && a.ratings[d] <= 5, `${a.code}.${d}`);
  for (const al of airlineRatings) {
    assert.match(al.iata, /^[A-Z0-9]{2}$/, `${al.name} iata`);
    for (const c of al.byClass) for (const d of DIMS) assert.ok(c.ratings[d] >= 0 && c.ratings[d] <= 5, `${al.name}.${c.cabin}.${d}`);
  }
  assert.match(TRANSIT_RATINGS_NOTE, /editorial/i);
});

test("every rated airport code exists in the airports catalogue (no orphans)", () => {
  const known = new Set(airportsProfiles.flatMap((p) => p.airports.map((a) => a.code)));
  for (const a of airportServiceRatings) assert.ok(known.has(a.code), `${a.code} should be a catalogued airport`);
});

test("overallScore is the mean of the four dimensions", () => {
  assert.equal(overallScore({ staff: 4, cleanliness: 4, comfort: 4, value: 4 }), 4);
  assert.equal(overallScore({ staff: 5, cleanliness: 4, comfort: 3, value: 2 }), 3.5);
});

test("airport accessors resolve by code and by destination", () => {
  assert.equal(getAirportServiceRating("KIX")?.destinationId, "kyoto");
  assert.equal(getAirportServiceRating("ZZZ"), null);
  assert.equal(airportRatingsForDestination("patagonia").length, 2); // FTE + BRC
  assert.deepEqual(airportRatingsForDestination("atlantis"), []);
});

test("airline ratings resolve by name or IATA, per cabin class", () => {
  assert.equal(getAirlineRating("Japan Airlines")?.iata, "JL");
  assert.equal(getAirlineRating("jl")?.name, "Japan Airlines"); // case-insensitive IATA
  const biz = airlineClassRatings("JL", "business");
  const eco = airlineClassRatings("JL", "economy");
  assert.ok(biz && eco && overallScore(biz) > overallScore(eco), "business should out-rate economy");
  assert.equal(airlineClassRatings("JL", "first"), null); // not rated
  assert.equal(getAirlineRating("nope"), null);
});
