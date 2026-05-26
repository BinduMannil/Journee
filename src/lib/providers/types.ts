/**
 * Provider adapter contracts.
 *
 * Journee is provider-agnostic by design (docs/decisions/ADR-003). Application
 * and intelligence code depends only on these interfaces — never on a concrete
 * vendor SDK. Concrete adapters (Supabase, a CMS, a flights API, an affiliate
 * network, etc.) implement a contract and register themselves so they can be
 * swapped or failed over without touching callers.
 */

/** Stable identifiers for the kinds of capability a provider can offer. */
export type ProviderCapability =
  | "content"
  | "destinations"
  | "affiliate"
  | "weather"
  | "events";

export interface ProviderMeta {
  /** Unique, stable id, e.g. "supabase-content". */
  readonly id: string;
  /** Human-readable name for dashboards and audit logs. */
  readonly name: string;
  readonly capability: ProviderCapability;
  /** Lower number = preferred. Routing tries providers in priority order. */
  readonly priority: number;
}

/** A provider that can answer for a given capability. */
export interface Provider<TResult> extends ProviderMeta {
  /** Cheap liveness/config check used before routing traffic to this provider. */
  isAvailable(): Promise<boolean> | boolean;
  fetch(): Promise<TResult>;
}

import type { Destination } from "@/content/destinations";

export type DestinationProvider = Provider<readonly Destination[]>;
