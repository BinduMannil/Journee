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
const DEG = 180 / Math.PI;

function dayOfYear(date: Date): number {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  return Math.floor((date.getTime() - start) / 86_400_000);
}

/** Solar declination (deg) — the single source of truth for sun math here. */
function declinationDeg(date: Date): number {
  return 23.45 * Math.sin(RAD * (360 / 365) * (dayOfYear(date) + 284));
}

/** Sun altitude in degrees above the horizon. */
export function solarAltitudeDeg(date: Date, latDeg: number, lonDeg: number): number {
  const decl = declinationDeg(date);
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

export type SunCondition = "normal" | "midnight-sun" | "polar-night";

export interface GoldenWindow {
  /** Local solar time (hours, 0..24). */
  readonly start: number;
  readonly end: number;
}

export interface SunTimes {
  /** Approx. local solar time (hours, 0..24). Omits time zone, DST, and the
   * equation of time, so it's accurate to a few minutes — honest for "when does
   * the light turn here today?", not a civil-clock guarantee. `null` when the
   * sun doesn't cross the horizon (polar day/night). */
  readonly sunrise: number | null;
  readonly sunset: number | null;
  /** Solar noon is 12 by definition of local solar time. */
  readonly solarNoon: number;
  readonly dayLengthHours: number;
  readonly condition: SunCondition;
  /** Golden-hour windows (sun within [-6°, 6°]) in local solar time. */
  readonly morningGolden: GoldenWindow | null;
  readonly eveningGolden: GoldenWindow | null;
}

type Crossing = { readonly hourAngleDeg: number } | "always-up" | "always-down";

/** Hour angle (deg, 0..180) at which the sun's altitude equals `h0Deg`, or a
 * sentinel when the altitude never reaches it that day. */
function altitudeCrossing(h0Deg: number, latDeg: number, declDeg: number): Crossing {
  const cosH =
    (Math.sin(RAD * h0Deg) - Math.sin(RAD * latDeg) * Math.sin(RAD * declDeg)) /
    (Math.cos(RAD * latDeg) * Math.cos(RAD * declDeg));
  if (cosH <= -1) return "always-up"; // altitude stays above h0 all day
  if (cosH >= 1) return "always-down"; // altitude never reaches h0
  return { hourAngleDeg: Math.acos(cosH) * DEG };
}

/** Sunrise/sunset, day length, and golden-hour windows for a coordinate + date,
 * in local solar time. Pure; no network. Handles polar day/night. */
export function sunTimes(date: Date, latDeg: number): SunTimes {
  const decl = declinationDeg(date);
  const horizon = altitudeCrossing(0, latDeg, decl);

  let sunrise: number | null = null;
  let sunset: number | null = null;
  let dayLengthHours: number;
  let condition: SunCondition = "normal";

  if (horizon === "always-up") {
    dayLengthHours = 24;
    condition = "midnight-sun";
  } else if (horizon === "always-down") {
    dayLengthHours = 0;
    condition = "polar-night";
  } else {
    const h = horizon.hourAngleDeg / 15;
    sunrise = 12 - h;
    sunset = 12 + h;
    dayLengthHours = 2 * h;
  }

  const upper = altitudeCrossing(6, latDeg, decl);
  const lower = altitudeCrossing(-6, latDeg, decl);
  let morningGolden: GoldenWindow | null = null;
  let eveningGolden: GoldenWindow | null = null;
  if (typeof upper === "object" && typeof lower === "object") {
    const hu = upper.hourAngleDeg / 15;
    const hl = lower.hourAngleDeg / 15;
    morningGolden = { start: 12 - hl, end: 12 - hu };
    eveningGolden = { start: 12 + hu, end: 12 + hl };
  }

  return { sunrise, sunset, solarNoon: 12, dayLengthHours, condition, morningGolden, eveningGolden };
}

/** Format a local-solar-time hour (0..24, wraps) as HH:MM. */
export function formatSolarTime(hours: number): string {
  const wrapped = ((hours % 24) + 24) % 24;
  let hh = Math.floor(wrapped);
  let mm = Math.round((wrapped - hh) * 60);
  if (mm === 60) {
    mm = 0;
    hh = (hh + 1) % 24;
  }
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}
