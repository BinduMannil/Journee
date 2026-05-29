/**
 * Indicative foreign-exchange reference rates (editorial SEED data).
 *
 * A small, versioned table of *indicative* exchange rates (units of each
 * currency per 1 USD) used to normalize the app's approximate USD cost anchors
 * into other currencies for orientation. These are **not live FX rates** — they
 * are a rounded, dated seed snapshot that drifts (sometimes sharply, e.g. ARS)
 * and must never be presented as a live quote. `FX_DATA_NOTE` is surfaced with
 * every consumer. When a live FX feed is wired (behind a provider, ⛔ egress),
 * it slots in ahead of this seed table without changing the accessor shape.
 */

export interface FxRate {
  /** ISO 4217 currency code (e.g. "EUR"). */
  readonly currency: string;
  /** Units of this currency per 1 USD (USD itself is 1). */
  readonly perUsd: number;
}

/** Bump when the seed snapshot or its shape changes. */
export const FX_MODEL_VERSION = "fx-seed-v1";

/** Indicative reference month for the snapshot (orientation only). */
export const FX_AS_OF = "2026-01";

/** Shown with any converted figure so it reads as indicative, not a live quote. */
export const FX_DATA_NOTE =
  "Indicative SEED exchange rates from a dated reference snapshot (" +
  FX_AS_OF +
  "), not live foreign-exchange data. Rates drift — sometimes sharply — so " +
  "converted figures are for rough orientation only; check a live rate before " +
  "exchanging money or budgeting precisely.";

export const seedFxRates: readonly FxRate[] = [
  { currency: "USD", perUsd: 1 },
  { currency: "EUR", perUsd: 0.92 },
  { currency: "GBP", perUsd: 0.79 },
  { currency: "JPY", perUsd: 150 },
  { currency: "MAD", perUsd: 10 },
  { currency: "ARS", perUsd: 1000 },
  { currency: "CLP", perUsd: 950 },
];
