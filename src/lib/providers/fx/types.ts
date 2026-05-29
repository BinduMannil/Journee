/**
 * Foreign-exchange provider contract.
 *
 * A small capability-specific seam (like the weather and LLM contracts): a
 * concrete FX adapter is a drop-in. The seed adapter ships indicative static
 * rates clearly labelled `source: "seed"`; a live FX feed implements the same
 * shape and slots in without touching callers or the pure `convert` math. No
 * live-rate claims are made until a live source is wired.
 */
export type FxSource = "seed" | "live";

export interface FxRates {
  /** ISO 4217 base currency the rates are expressed against. */
  readonly base: string;
  /** currency code -> units of that currency per 1 unit of base. */
  readonly rates: Readonly<Record<string, number>>;
  readonly source: FxSource;
  /** ISO date the rates were captured (so staleness is visible). */
  readonly asOf: string;
}

export interface FxProvider {
  readonly id: string;
  isAvailable(): boolean | Promise<boolean>;
  getRates(base?: string): Promise<FxRates>;
}
