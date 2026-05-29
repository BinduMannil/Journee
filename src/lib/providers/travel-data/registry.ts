/**
 * Travel-data provider registry + readiness reporting.
 *
 * Travel-data providers are parameterized by query (unlike the no-arg `Provider`
 * in ../registry), so they get their own small registry rather than going
 * through capability `resolve()`. Providers self-register; the registry keeps
 * them ordered by trust (live > seed > mock) so resolution prefers real data
 * and falls back cleanly. Readiness reporting answers "what exists, what's
 * available, what's blocked and why" for the control plane — honestly.
 */
import {
  TRAVEL_DATA_KINDS,
  unavailableResponse,
  type TravelDataKind,
  type TravelDataProvider,
  type TravelDataResponse,
} from "./contracts";
import type { ProviderSourceClass } from "./source";
import { unavailableSource } from "./source";
import { log } from "@/lib/observability/logger";
import { incrementCounter } from "@/lib/observability/metrics";

type AnyTravelDataProvider = TravelDataProvider<unknown, unknown>;

/** Trust order for resolution + display (lower = preferred). */
const CLASS_ORDER: Readonly<Record<ProviderSourceClass, number>> = {
  live: 0,
  seed: 1,
  mock: 2,
};

const registry = new Map<TravelDataKind, AnyTravelDataProvider[]>();

export function registerTravelDataProvider(provider: AnyTravelDataProvider): void {
  const list = registry.get(provider.kind) ?? [];
  list.push(provider);
  list.sort((a, b) => CLASS_ORDER[a.sourceType] - CLASS_ORDER[b.sourceType]);
  registry.set(provider.kind, list);
}

export function listTravelDataProviders(kind: TravelDataKind): readonly AnyTravelDataProvider[] {
  return registry.get(kind) ?? [];
}

export function allTravelDataProviders(): readonly AnyTravelDataProvider[] {
  return [...registry.values()].flat();
}

/** Reset the registry. Test-only — keeps suites independent of import order. */
export function resetTravelDataRegistry(): void {
  registry.clear();
}

/**
 * Resolve a travel-data kind by trying providers in trust order until one is
 * available and returns an `ok` response. Always resolves to a
 * `TravelDataResponse` (never throws / never null): if every provider is
 * unavailable or non-ok, returns the last non-ok response, or a synthesized
 * `unavailable` when nothing is registered.
 *
 * Each outcome is observable via counters (and warnings for non-ok/throw),
 * mirroring the capability registry — so when a live vendor is wired later it
 * is monitored from day one without further changes here.
 */
export async function resolveTravelData<TQuery, TData>(
  kind: TravelDataKind,
  query: TQuery,
): Promise<TravelDataResponse<TData>> {
  const providers = listTravelDataProviders(kind);
  if (providers.length === 0) {
    incrementCounter("travel_data_kind_no_provider", { kind });
    return unavailableResponse(
      "registry",
      kind,
      `no provider registered for "${kind}"`,
      unavailableSource("registry", "Travel Data Registry"),
    );
  }
  let lastNonOk: TravelDataResponse<TData> | null = null;
  for (const provider of providers) {
    const typed = provider as TravelDataProvider<TQuery, TData>;
    try {
      if (!(await typed.isAvailable())) {
        incrementCounter("travel_data_provider_unavailable", { kind, providerId: provider.id });
        continue;
      }
      const response = await typed.fetch(query);
      if (response.status === "ok") {
        incrementCounter("travel_data_resolve_success", { kind, providerId: provider.id });
        return response;
      }
      const counterName =
        response.status === "unavailable"
          ? "travel_data_resolve_unavailable"
          : "travel_data_resolve_error";
      incrementCounter(counterName, { kind, providerId: provider.id });
      log.warn("travel_data_provider_non_ok", {
        kind,
        providerId: provider.id,
        status: response.status,
        reason: response.reason,
      });
      lastNonOk = response;
    } catch (error) {
      // Defensive: a provider should return an error response, not throw, but
      // if it does we fall through to the next without crashing the caller.
      incrementCounter("travel_data_provider_throw", { kind, providerId: provider.id });
      log.warn("travel_data_provider_throw", {
        kind,
        providerId: provider.id,
        error: error instanceof Error ? error.message : String(error),
      });
      continue;
    }
  }
  incrementCounter("travel_data_kind_exhausted", { kind });
  if (lastNonOk) return lastNonOk;
  return unavailableResponse(
    "registry",
    kind,
    `no available provider for "${kind}"`,
    unavailableSource("registry", "Travel Data Registry"),
  );
}

// ── Readiness reporting ──────────────────────────────────────────────────────

export interface TravelDataProviderReadiness {
  readonly id: string;
  readonly name: string;
  readonly kind: TravelDataKind;
  readonly sourceType: ProviderSourceClass;
  readonly available: boolean;
  readonly unavailableReason?: string;
}

export interface TravelDataKindReadiness {
  readonly kind: TravelDataKind;
  /** A contract exists for this kind (always true — all 7 are defined). */
  readonly contractReady: boolean;
  readonly providerCount: number;
  readonly hasLiveProvider: boolean;
  readonly hasAvailableProvider: boolean;
  readonly sourceTypes: readonly ProviderSourceClass[];
  /** True when no LIVE provider is wired — i.e. seed/mock-only or empty. */
  readonly blocked: boolean;
  readonly blockedReason?: string;
  readonly providers: readonly TravelDataProviderReadiness[];
}

export interface TravelDataReadinessReport {
  readonly generatedAt: string;
  readonly kinds: readonly TravelDataKindReadiness[];
  /** Honest, machine-readable status notes for the control plane. */
  readonly notes: readonly string[];
}

const READINESS_NOTES: readonly string[] = [
  "Travel-data contracts are defined for all kinds; only SEED adapters are wired.",
  "No live travel-data vendor is integrated. Seed responses are labeled `seed` and are not live observations.",
  "Per-response staleness is computed from SourceMetadata via computeFreshness()/classifySourceQuality(), not from this report.",
];

export async function reportTravelDataReadiness(): Promise<TravelDataReadinessReport> {
  const kinds: TravelDataKindReadiness[] = [];
  for (const kind of TRAVEL_DATA_KINDS) {
    const providers = listTravelDataProviders(kind);
    const providerReadiness: TravelDataProviderReadiness[] = await Promise.all(
      providers.map(async (p) => {
        const available = await p.isAvailable();
        return {
          id: p.id,
          name: p.name,
          kind: p.kind,
          sourceType: p.sourceType,
          available,
          unavailableReason: available ? undefined : "provider reports not available",
        };
      }),
    );
    const hasLiveProvider = providerReadiness.some((p) => p.sourceType === "live");
    const hasAvailableProvider = providerReadiness.some((p) => p.available);
    const sourceTypes = [...new Set(providerReadiness.map((p) => p.sourceType))];
    const blocked = !hasLiveProvider;
    const blockedReason = blocked
      ? providers.length === 0
        ? "no provider registered"
        : "no live provider wired (seed/mock only)"
      : undefined;
    kinds.push({
      kind,
      contractReady: true,
      providerCount: providers.length,
      hasLiveProvider,
      hasAvailableProvider,
      sourceTypes,
      blocked,
      blockedReason,
      providers: providerReadiness,
    });
  }
  return { generatedAt: new Date().toISOString(), kinds, notes: READINESS_NOTES };
}
