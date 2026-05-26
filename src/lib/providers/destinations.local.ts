/**
 * Local seed implementation of the destinations capability.
 *
 * This is the lowest-priority provider — a built-in fallback that is always
 * available. Higher-priority adapters (e.g. Supabase, a CMS) register ahead of
 * it; if they are unconfigured or down, routing falls back here so the product
 * always renders something. See docs/architecture/provider-architecture.md.
 */
import { featuredDestinations, type Destination } from "@/content/destinations";
import { registerProvider } from "./registry";
import type { DestinationProvider } from "./types";

export const localDestinationProvider: DestinationProvider = {
  id: "local-seed",
  name: "Local Seed Catalog",
  capability: "destinations",
  priority: 100,
  isAvailable: () => true,
  fetch: async (): Promise<readonly Destination[]> => featuredDestinations,
};

registerProvider(localDestinationProvider);
