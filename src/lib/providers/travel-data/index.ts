/**
 * Travel-data provider layer — public barrel.
 *
 * Backend-only contracts + helpers for real-world travel intelligence (places,
 * opening hours, ticket prices/links, reviews, local events, safety advisories).
 * Provider-agnostic (ADR-003): only SEED adapters are wired today; live vendors
 * are added behind these same contracts when implemented. See
 * docs/architecture/provider-architecture.md.
 *
 * Note: importing this barrel does NOT register adapters. Import
 * `./register` (side-effecting) where registration is needed, exactly as the
 * capability registry is wired via `@/lib/providers/register`.
 */
export * from "./source";
export * from "./freshness";
export * from "./contracts";
export * from "./registry";
export * from "./schemas";
export * from "./json-schema";
export {
  cachedResolveTravelData,
  createTravelDataCache,
  defaultTravelDataCache,
  type CacheOptions,
  type TravelDataCache,
} from "./cache";
export { seedTravelDataProviders } from "./seed";
