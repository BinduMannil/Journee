/**
 * User display preferences + unit conversion/formatting (pure, no network).
 *
 * The app stores values in CANONICAL units — temperatures in Celsius, distances
 * in kilometres — and converts to the user's chosen unit only at the *edge*,
 * when formatting for display. Keeping one canonical representation internally
 * means every comparison, score and cache key is unit-stable; the user's
 * preference is a presentation concern, applied last.
 *
 * Currency is DISPLAY/LABEL only: `formatCurrency` renders an amount with the
 * chosen currency's symbol and locale grouping, but performs **no FX
 * conversion** — that requires live exchange rates and is roadmap (see
 * `PREFERENCES_NOTE`). Deterministic + unit-tested.
 */

export type TemperatureUnit = "celsius" | "fahrenheit";
export type DistanceUnit = "km" | "mi";

export interface UserPreferences {
  /** ISO 4217 currency code (e.g. "USD", "JPY"). Display/label only — no FX. */
  readonly currency: string;
  readonly temperatureUnit: TemperatureUnit;
  readonly distanceUnit: DistanceUnit;
}

/** Sensible defaults: US dollars, metric units. */
export const defaultPreferences: UserPreferences = {
  currency: "USD",
  temperatureUnit: "celsius",
  distanceUnit: "km",
};

/** Kilometres per mile factor, used for both directions. */
const KM_PER_MILE_FACTOR = 0.621371;

const round = (n: number): number => Math.round(n);
const round1 = (n: number): number => Math.round(n * 10) / 10;

/** Coerce non-finite input (NaN/Infinity) to 0 so formatting never emits junk. */
const finiteOr0 = (n: number): number => (Number.isFinite(n) ? n : 0);

/** Pure temperature converter: Celsius → Fahrenheit. */
export function celsiusToFahrenheit(c: number): number {
  return finiteOr0(c) * 9 / 5 + 32;
}

/** Pure temperature converter: Fahrenheit → Celsius. */
export function fahrenheitToCelsius(f: number): number {
  return (finiteOr0(f) - 32) * 5 / 9;
}

/** Pure distance converter: kilometres → miles. */
export function kmToMiles(km: number): number {
  return finiteOr0(km) * KM_PER_MILE_FACTOR;
}

/** Pure distance converter: miles → kilometres. */
export function milesToKm(mi: number): number {
  return finiteOr0(mi) / KM_PER_MILE_FACTOR;
}

/**
 * Format a canonical Celsius temperature in the user's preferred unit, rounded
 * to whole degrees, e.g. `"21°C"` or `"70°F"`.
 */
export function formatTemperature(celsius: number, prefs: UserPreferences): string {
  const c = finiteOr0(celsius);
  if (prefs.temperatureUnit === "fahrenheit") {
    return `${round(celsiusToFahrenheit(c))}°F`;
  }
  return `${round(c)}°C`;
}

/**
 * Format a canonical distance in kilometres in the user's preferred unit,
 * rounded to one decimal place, e.g. `"10 km"` or `"6.2 mi"`.
 */
export function formatDistance(km: number, prefs: UserPreferences): string {
  const value = finiteOr0(km);
  if (prefs.distanceUnit === "mi") {
    return `${round1(kmToMiles(value))} mi`;
  }
  return `${round1(value)} km`;
}

/**
 * Format a monetary amount in the user's chosen currency using the runtime
 * locale (`Intl.NumberFormat`). This labels/renders the amount in the chosen
 * currency's symbol and grouping — it does NOT convert between currencies. FX
 * conversion needs live exchange rates and is roadmap (see `PREFERENCES_NOTE`).
 */
export function formatCurrency(amount: number, prefs: UserPreferences): string {
  const value = finiteOr0(amount);
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: prefs.currency,
  }).format(value);
}

export const PREFERENCES_NOTE =
  "Currency formatting is display/label only: the amount is rendered in the " +
  "chosen currency but is NOT FX-converted (live exchange rates are roadmap). " +
  "Temperature and distance ARE converted from the app's canonical Celsius/km " +
  "to the user's preferred unit at display time.";
