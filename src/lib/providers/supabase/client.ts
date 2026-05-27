import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseConfig, getSupabaseServiceConfig } from "@/lib/config/env";

/**
 * Lazily-created Supabase client using the anon key.
 *
 * Returns null when Supabase is not configured so callers (provider adapters)
 * can report unavailability and let the registry fall back. The service-role
 * key is intentionally NOT used here — privileged access belongs to
 * `getSupabaseServiceClient`, used only by server-only write paths.
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

/**
 * Lazily-created privileged client (service role). Bypasses RLS — use ONLY in
 * server-only paths (e.g. event ingestion). Returns null when unconfigured.
 * Never import this from client components.
 */
let serviceClient: SupabaseClient | null = null;

export function getSupabaseServiceClient(): SupabaseClient | null {
  if (serviceClient) return serviceClient;
  const config = getSupabaseServiceConfig();
  if (!config) return null;
  serviceClient = createClient(config.url, config.serviceRoleKey, {
    auth: { persistSession: false },
  });
  return serviceClient;
}
