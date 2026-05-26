import { z } from "zod";

/**
 * Environment validation boundary.
 *
 * All env-driven configuration is parsed and validated here, once, at the edge
 * (docs/architecture/configuration-architecture.md). Inner code receives typed
 * values and never reads `process.env` directly. Fields are optional because
 * the platform must boot in a minimal/unconfigured state and degrade via
 * provider fallback rather than crash.
 */
const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  JOURNEE_ENABLED_FEATURES: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | null = null;

/** Parse + validate the environment. Throws only on *malformed* values. */
export function getEnv(): Env {
  if (cached) return cached;
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    JOURNEE_ENABLED_FEATURES: process.env.JOURNEE_ENABLED_FEATURES,
  });
  if (!parsed.success) {
    throw new Error(
      "Invalid environment configuration: " + parsed.error.message,
    );
  }
  cached = parsed.data;
  return cached;
}

export interface SupabaseClientConfig {
  readonly url: string;
  readonly anonKey: string;
}

/** Returns Supabase connection config, or null when not configured. */
export function getSupabaseConfig(): SupabaseClientConfig | null {
  const env = getEnv();
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }
  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}
