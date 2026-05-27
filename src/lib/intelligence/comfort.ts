/**
 * Environmental comfort scoring (pure).
 *
 * Maps raw weather/air inputs to a 0..1 comfort value usable as a destination
 * or disruption signal. This is the deterministic logic that a live weather
 * provider will feed once egress to a weather API is permitted (Open-Meteo was
 * blocked by the current network policy). Pure + unit-tested so it's correct
 * the moment a feed is attached.
 */
export interface ComfortInput {
  /** Air temperature in Celsius. */
  readonly temperatureC: number;
  /** Relative humidity 0..100. */
  readonly humidityPct?: number;
  /** Wind speed in km/h. */
  readonly windKph?: number;
  /** Air Quality Index (US EPA scale, 0..500). */
  readonly aqi?: number;
}

/** Triangular comfort around an ideal band, tapering to 0 at the edges. */
function band(value: number, ideal: number, halfWidth: number): number {
  const d = Math.abs(value - ideal);
  return Math.max(0, 1 - d / halfWidth);
}

/** 0..1 environmental comfort; 1 = ideal. Missing inputs are simply skipped. */
export function comfortScore(input: ComfortInput): number {
  const parts: number[] = [];

  // Temperature: most comfortable around 22C, taper to 0 by ~16C away.
  parts.push(band(input.temperatureC, 22, 16));

  if (input.humidityPct !== undefined) {
    // Ideal ~45%, taper to 0 by ~45 points away.
    parts.push(band(input.humidityPct, 45, 45));
  }
  if (input.windKph !== undefined) {
    // Calm-ish is best; 0 km/h ideal, taper to 0 by 40 km/h.
    parts.push(Math.max(0, 1 - input.windKph / 40));
  }
  if (input.aqi !== undefined) {
    // 0 AQI ideal; 150 (unhealthy) -> 0.
    parts.push(Math.max(0, 1 - input.aqi / 150));
  }

  if (parts.length === 0) return 0;
  return parts.reduce((sum, p) => sum + p, 0) / parts.length;
}
