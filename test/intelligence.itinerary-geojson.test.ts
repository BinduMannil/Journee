import { test } from "node:test";
import assert from "node:assert/strict";
import {
  itineraryToGeoJSON,
  itineraryToGeoJSONString,
  type RouteWaypoint,
  type RouteFeature,
  type PointFeature,
  type LineStringFeature,
} from "../src/lib/intelligence/itinerary-geojson";

const isPoint = (f: RouteFeature): f is PointFeature => f.geometry.type === "Point";
const isLine = (f: RouteFeature): f is LineStringFeature => f.geometry.type === "LineString";

const waypoints: readonly RouteWaypoint[] = [
  { id: "kyoto", name: "Kyoto", lat: 35.0116, lon: 135.7681, day: 1 },
  { id: "santorini", name: "Santorini", lat: 36.3932, lon: 25.4615, day: 3, description: "Caldera views" },
];

test("produces a FeatureCollection with a Point per waypoint plus a route LineString", () => {
  const fc = itineraryToGeoJSON(waypoints);
  assert.equal(fc.type, "FeatureCollection");
  assert.equal(fc.features.filter(isPoint).length, 2);
  assert.equal(fc.features.filter(isLine).length, 1);
});

test("Point coordinates use GeoJSON [lon, lat] order and carry visit order + props", () => {
  const points = itineraryToGeoJSON(waypoints).features.filter(isPoint);
  assert.deepEqual(points[0]!.geometry.coordinates, [135.7681, 35.0116]);
  assert.equal(points[0]!.properties.order, 1);
  assert.equal(points[0]!.properties.name, "Kyoto");
  assert.equal(points[1]!.properties.order, 2);
  assert.equal(points[1]!.properties.day, 3);
  assert.equal(points[1]!.properties.description, "Caldera views");
});

test("LineString carries a positive great-circle route length", () => {
  const line = itineraryToGeoJSON(waypoints, { routeName: "My trip" }).features.find(isLine);
  assert.ok(line);
  assert.equal(line.geometry.coordinates.length, 2);
  assert.equal(line.properties.name, "My trip");
  // Kyoto -> Santorini is ~9,400 km; assert a sane lower bound.
  assert.ok(line.properties.routeKm > 9000, `routeKm=${line.properties.routeKm}`);
  assert.equal(line.properties.longestLegKm, line.properties.routeKm);
});

test("omits the LineString for a single waypoint or when disabled", () => {
  const single = itineraryToGeoJSON([waypoints[0]!]);
  assert.equal(single.features.filter(isLine).length, 0);
  const noLine = itineraryToGeoJSON(waypoints, { includeRouteLine: false });
  assert.equal(noLine.features.filter(isLine).length, 0);
  assert.equal(noLine.features.length, 2);
});

test("empty waypoints yield an empty but valid FeatureCollection", () => {
  const fc = itineraryToGeoJSON([]);
  assert.equal(fc.type, "FeatureCollection");
  assert.equal(fc.features.length, 0);
});

test("throws RangeError on out-of-range coordinates", () => {
  assert.throws(
    () => itineraryToGeoJSON([{ id: "bad", name: "Bad", lat: 99, lon: 0 }]),
    /lat 99 out of range/,
  );
  assert.throws(
    () => itineraryToGeoJSON([{ id: "bad", name: "Bad", lat: 0, lon: 200 }]),
    /lon 200 out of range/,
  );
});

test("itineraryToGeoJSONString round-trips to the same object", () => {
  const str = itineraryToGeoJSONString(waypoints);
  const parsed = JSON.parse(str);
  assert.deepEqual(parsed, itineraryToGeoJSON(waypoints));
});
