/**
 * Supabase-backed destinations provider.
 *
 * Higher priority than the local seed, so when Supabase is configured AND the
 * `supabase-destinations` flag is on, the catalog comes from the database.
 * Otherwise `isAvailable()` is false and routing falls back to the seed — the
 * page code is unaware either way. See docs/architecture/provider-architecture.md.
 */
import { getSupabaseClient } from "./supabase/client";
import { registerProvider } from "./registry";
import type { DestinationProvider } from "./types";
import type { Destination } from "@/content/destinations";
import { isFeatureEnabled } from "@/lib/config/flags";

interface DestinationRow {
  readonly id: string;
  readonly name: string;
  readonly country: string;
  readonly headline: string;
  readonly mood: string;
  readonly image_url: string;
}

function mapRow(row: DestinationRow): Destination {
  return {
    id: row.id,
    name: row.name,
    country: row.country,
    headline: row.headline,
    mood: row.mood,
    imageUrl: row.image_url,
  };
}

export const supabaseDestinationProvider: DestinationProvider = {
  id: "supabase-destinations",
  name: "Supabase Destinations",
  capability: "destinations",
  priority: 10,
  isAvailable: () =>
    isFeatureEnabled("supabase-destinations") && getSupabaseClient() !== null,
  fetch: async (): Promise<readonly Destination[]> => {
    const client = getSupabaseClient();
    if (!client) throw new Error("Supabase client unavailable");
    const { data, error } = await client
      .from("destinations")
      .select("id,name,country,headline,mood,image_url")
      .order("name");
    if (error) throw new Error(error.message);
    return (data as DestinationRow[]).map(mapRow);
  },
};

registerProvider(supabaseDestinationProvider);
