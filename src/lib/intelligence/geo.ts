/**
 * Great-circle geography (pure, no network).
 *
 * Haversine distance between coordinates, plus a route total over an ordered
 * list of stops. Used to give the trip planner real spatial context (how far
 * apart the chosen destinations are) from the catalog's coordinates — no
 * external API. Deterministic and unit-tested.
 */
export interface Coord {
  readonly lat: number;
  readonly lon: number;
}

const EARTH_RADIUS_KM = 6371;
const RAD = Math.PI / 180;

/** Great-circle distance between two coordinates, in kilometres. */
export function haversineKm(a: Coord, b: Coord): number {
  const dLat = (b.lat - a.lat) * RAD;
  const dLon = (b.lon - a.lon) * RAD;
  const lat1 = a.lat * RAD;
  const lat2 = b.lat * RAD;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

export interface RouteDistance {
  /** Sum of consecutive legs, in kilometres. */
  readonly totalKm: number;
  /** Longest single leg, in kilometres (0 for fewer than two stops). */
  readonly longestLegKm: number;
}

/** Total + longest-leg distance along an ordered list of stops. */
export function routeDistanceKm(stops: readonly Coord[]): RouteDistance {
  let totalKm = 0;
  let longestLegKm = 0;
  for (let i = 1; i < stops.length; i++) {
    const leg = haversineKm(stops[i - 1]!, stops[i]!);
    totalKm += leg;
    if (leg > longestLegKm) longestLegKm = leg;
  }
  return { totalKm: Math.round(totalKm), longestLegKm: Math.round(longestLegKm) };
}
