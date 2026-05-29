/**
 * Itinerary → GeoJSON route export (pure, no network).
 *
 * Turns an ordered list of trip waypoints into a standards-compliant GeoJSON
 * `FeatureCollection`: one `Point` per stop (in visit order) plus an optional
 * `LineString` tracing the route, annotated with its great-circle length (via
 * `geo.ts`). Complements the `.ics` export so a plan can drop straight into any
 * map tool (Leaflet, Mapbox, geojson.io, QGIS, …). Deterministic + unit-tested.
 *
 * GeoJSON (RFC 7946) uses `[longitude, latitude]` coordinate order — handled
 * here so callers pass plain `lat`/`lon` fields and never have to remember it.
 */
import { routeDistanceKm, type Coord } from "./geo";

/** One ordered stop on the trip. */
export interface RouteWaypoint {
  readonly id: string;
  readonly name: string;
  readonly lat: number;
  readonly lon: number;
  /** 1-based itinerary day this stop belongs to, when known. */
  readonly day?: number;
  readonly description?: string;
}

export interface GeoJSONOptions {
  /** Name recorded on the collection + route line (defaults to "Journee trip"). */
  readonly routeName?: string;
  /** Emit the connecting `LineString` (default true; needs >= 2 waypoints). */
  readonly includeRouteLine?: boolean;
}

/** RFC 7946 `[lon, lat]` position. */
export type Position = readonly [number, number];

export interface PointFeature {
  readonly type: "Feature";
  readonly geometry: { readonly type: "Point"; readonly coordinates: Position };
  readonly properties: {
    readonly id: string;
    readonly name: string;
    /** 1-based position in the visit order. */
    readonly order: number;
    readonly day?: number;
    readonly description?: string;
  };
}

export interface LineStringFeature {
  readonly type: "Feature";
  readonly geometry: {
    readonly type: "LineString";
    readonly coordinates: readonly Position[];
  };
  readonly properties: {
    readonly name: string;
    /** Great-circle route length in kilometres (sum of consecutive legs). */
    readonly routeKm: number;
    readonly longestLegKm: number;
  };
}

export type RouteFeature = PointFeature | LineStringFeature;

export interface RouteFeatureCollection {
  readonly type: "FeatureCollection";
  readonly properties: { readonly name: string };
  readonly features: readonly RouteFeature[];
}

function assertValidCoord(w: RouteWaypoint): void {
  if (!Number.isFinite(w.lat) || w.lat < -90 || w.lat > 90) {
    throw new RangeError(`waypoint ${w.id}: lat ${w.lat} out of range [-90, 90]`);
  }
  if (!Number.isFinite(w.lon) || w.lon < -180 || w.lon > 180) {
    throw new RangeError(`waypoint ${w.id}: lon ${w.lon} out of range [-180, 180]`);
  }
}

/**
 * Build a GeoJSON `FeatureCollection` from ordered waypoints. Throws
 * `RangeError` on any out-of-range/non-finite coordinate (a programmer error,
 * not a fallback case). An empty list yields an empty, valid collection.
 */
export function itineraryToGeoJSON(
  waypoints: readonly RouteWaypoint[],
  opts: GeoJSONOptions = {},
): RouteFeatureCollection {
  const name = opts.routeName ?? "Journee trip";
  const includeLine = opts.includeRouteLine ?? true;

  for (const w of waypoints) assertValidCoord(w);

  const points: PointFeature[] = waypoints.map((w, i) => ({
    type: "Feature",
    geometry: { type: "Point", coordinates: [w.lon, w.lat] },
    properties: {
      id: w.id,
      name: w.name,
      order: i + 1,
      ...(w.day !== undefined ? { day: w.day } : {}),
      ...(w.description !== undefined ? { description: w.description } : {}),
    },
  }));

  const features: RouteFeature[] = [...points];

  if (includeLine && waypoints.length >= 2) {
    const coords: readonly Coord[] = waypoints.map((w) => ({ lat: w.lat, lon: w.lon }));
    const { totalKm, longestLegKm } = routeDistanceKm(coords);
    features.push({
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: waypoints.map((w): Position => [w.lon, w.lat]),
      },
      properties: { name, routeKm: totalKm, longestLegKm },
    });
  }

  return { type: "FeatureCollection", properties: { name }, features };
}

/** Convenience: the collection serialized as a GeoJSON string. */
export function itineraryToGeoJSONString(
  waypoints: readonly RouteWaypoint[],
  opts: GeoJSONOptions = {},
): string {
  return JSON.stringify(itineraryToGeoJSON(waypoints, opts));
}
