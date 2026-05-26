/**
 * Provider registry + priority routing with fallback.
 *
 * Callers ask the registry for a capability; the registry returns the result
 * from the highest-priority *available* provider. If a provider is unavailable
 * or throws, routing falls through to the next one. This is the single place
 * where failover policy lives (docs/architecture/provider-architecture.md).
 */
import type { Provider, ProviderCapability } from "./types";
import { log } from "@/lib/observability/logger";

type AnyProvider = Provider<unknown>;

const registry = new Map<ProviderCapability, AnyProvider[]>();

export function registerProvider(provider: AnyProvider): void {
  const list = registry.get(provider.capability) ?? [];
  list.push(provider);
  list.sort((a, b) => a.priority - b.priority);
  registry.set(provider.capability, list);
}

export function listProviders(capability: ProviderCapability): readonly AnyProvider[] {
  return registry.get(capability) ?? [];
}

/**
 * Resolve a capability by trying providers in priority order until one is
 * available and succeeds. Returns null if every provider is exhausted.
 */
export async function resolve<TResult>(
  capability: ProviderCapability,
): Promise<TResult | null> {
  const candidates = listProviders(capability);
  for (const provider of candidates) {
    try {
      if (!(await provider.isAvailable())) continue;
      return (await provider.fetch()) as TResult;
    } catch (error) {
      // Fall through to the next provider, but record the failover so it is
      // observable (see monitoring architecture).
      log.warn("provider_failover", {
        capability,
        providerId: provider.id,
        error: error instanceof Error ? error.message : String(error),
      });
      continue;
    }
  }
  if (candidates.length > 0) {
    log.warn("provider_capability_exhausted", { capability });
  }
  return null;
}
