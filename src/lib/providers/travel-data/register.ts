/**
 * Central registration for travel-data providers.
 *
 * Importing this module wires up every available adapter. Today that is only
 * the SEED adapters — live vendors are added here under the same contract when
 * (and only when) they are actually implemented. Mirrors
 * src/lib/providers/register.ts for the no-arg capability registry.
 */
import { registerTravelDataProvider } from "./registry";
import { seedTravelDataProviders } from "./seed";

/** Register the seed adapters. Exported so tests can repopulate after a reset. */
export function registerSeedTravelDataProviders(): void {
  for (const provider of seedTravelDataProviders) {
    registerTravelDataProvider(provider);
  }
}

registerSeedTravelDataProviders();
