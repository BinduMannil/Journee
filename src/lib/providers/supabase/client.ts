import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "@/lib/config/env";

/**
 * Lazily-created Supabase client using the anon key.
 *
 * Returns null when Supabase is not configured so callers (provider adapters)
 * can report unavailability and let the registry fall back. The service-role
 * key is intentionally NOT used here — privileged access belongs to dedicated
 * server-only paths, never the general read client.
 */
let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (client) return client;
  const config = getSupabaseConfig();
  if (!config) return null;
  client = createClient(config.url, config.anonKey, {
    auth: { persistSession: false },
  });
  return client;
}
