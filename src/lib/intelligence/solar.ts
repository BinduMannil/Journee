/**
 * Solar position (pure, no network).
 *
 * Computes the sun's altitude for a coordinate + instant using a standard
 * approximation (declination + hour angle; equation-of-time omitted, so it's
 * accurate to a few minutes — fine for "is it golden hour right now?"). Used to
 * derive a *real* atmospheric signal for destinations without any external
 * data. Deterministic and unit-tested.
 */
const RAD = Math.PI / 180;

function dayOfYear(date: Date): number {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  return Math.floor((date.getTime() - start) / 86_400_000);
}

/** Sun altitude in degrees above the horizon. */
export function solarAltitudeDeg(date: Date, latDeg: number, lonDeg: number): number {
  const decl = 23.45 * Math.sin(RAD * (360 / 365) * (dayOfYear(date) + 284));
  const utcHours =
    date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  const localSolarTime = utcHours + lonDeg / 15;
  const hourAngle = 15 * (localSolarTime - 12);
  const sinAlt =
    Math.sin(RAD * latDeg) * Math.sin(RAD * decl) +
    Math.cos(RAD * latDeg) * Math.cos(RAD * decl) * Math.cos(RAD * hourAngle);
  return Math.asin(Math.max(-1, Math.min(1, sinAlt))) / RAD;
}

export type LightPhase = "night" | "golden" | "daylight";

export function lightPhase(altitudeDeg: number): LightPhase {
  if (altitudeDeg < -6) return "night";
  if (altitudeDeg <= 6) return "golden";
  return "daylight";
}

export function isDaytime(altitudeDeg: number): boolean {
  return altitudeDeg > 0;
}

/** 0..1 proximity to golden light; peaks in the low-sun band [-6, 6]. */
export function goldenHourProximity(altitudeDeg: number): number {
  if (altitudeDeg >= -6 && altitudeDeg <= 6) return 1;
  if (altitudeDeg < -6) return Math.max(0, (altitudeDeg + 12) / 6);
  return Math.max(0, (18 - altitudeDeg) / 12);
}
