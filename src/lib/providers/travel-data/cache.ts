/**
 * In-process TTL cache for travel-data resolution (pure, no external store).
 *
 * Wraps a resolver so identical (kind, query) calls within a TTL window reuse
 * the prior response. Today only seed adapters exist, so caching is mostly
 * unnecessary — but the seam is here so any live vendor (with rate limits or
 * cost) is cacheable from day one without changes at call sites. Mirrors the
 * counter-metrics scaffold pattern (in-memory, will be swapped for a shared
 * store later behind the same API).
 *
 * Honesty rules:
 * - Only `ok` responses are cached. Unavailable / error / throw responses are
 *   never cached — failures must be retried, not memoized.
 * - Entry TTL prefers the response's own `source.expiresAt` (so seed/mock/live
 *   TTLs are all respected); falls back to `defaultTtlMs` only when absent.
 * - Cache hits/misses/bypasses are counted (`travel_data_cache_*`).
 */
import { resolveTravelData } from "./registry";
import type { TravelDataKind, TravelDataResponse } from "./contracts";
import { incrementCounter } from "@/lib/observability/metrics";

export interface CacheOptions {
  /** Fallback TTL when a response has no `source.expiresAt`. Default: 5 min. */
  readonly defaultTtlMs?: number;
  /** Clock for testability. Default: `() => new Date()`. */
  readonly now?: () => Date;
}

interface CacheEntry {
  readonly response: TravelDataResponse<unknown>;
  readonly expiresAt: number;
}

export interface TravelDataCache {
  /** Returns the cached response for a key if still fresh, else undefined. */
  get<TData>(key: string, now: number): TravelDataResponse<TData> | undefined;
  /** Returns the in-flight promise for a key, if a fetch is already running. */
  getInflight<TData>(key: string): Promise<TravelDataResponse<TData>> | undefined;
  /** Registers an in-flight promise; clears it on settle. */
  setInflight<TData>(key: string, promise: Promise<TravelDataResponse<TData>>): void;
  /** Stores a response under a key with its expiry. */
  set(key: string, entry: CacheEntry): void;
  /** Removes all entries and in-flight handles (test/tooling). */
  clear(): void;
  /** Snapshot of current entry count (for tests/ops). */
  size(): number;
  readonly defaultTtlMs: number;
  readonly now: () => Date;
}

const DEFAULT_TTL_MS = 5 * 60 * 1000;

/** Build a new cache instance. Useful for tests; production uses the default. */
export function createTravelDataCache(options: CacheOptions = {}): TravelDataCache {
  const map = new Map<string, CacheEntry>();
  const inflight = new Map<string, Promise<TravelDataResponse<unknown>>>();
  return {
    defaultTtlMs: options.defaultTtlMs ?? DEFAULT_TTL_MS,
    now: options.now ?? (() => new Date()),
    get<TData>(key: string, now: number): TravelDataResponse<TData> | undefined {
      const entry = map.get(key);
      if (!entry) return undefined;
      if (entry.expiresAt <= now) {
        // Lazy expiry: drop on read so the map doesn't grow unbounded.
        map.delete(key);
        return undefined;
      }
      return entry.response as TravelDataResponse<TData>;
    },
    getInflight<TData>(key: string): Promise<TravelDataResponse<TData>> | undefined {
      return inflight.get(key) as Promise<TravelDataResponse<TData>> | undefined;
    },
    setInflight<TData>(key: string, promise: Promise<TravelDataResponse<TData>>): void {
      inflight.set(key, promise as Promise<TravelDataResponse<unknown>>);
      // Clear the in-flight slot once the request settles (success or failure)
      // so future calls don't reuse a stale handle.
      promise.finally(() => {
        if (inflight.get(key) === (promise as unknown as Promise<TravelDataResponse<unknown>>)) {
          inflight.delete(key);
        }
      });
    },
    set(key: string, entry: CacheEntry): void {
      map.set(key, entry);
    },
    clear(): void {
      map.clear();
      inflight.clear();
    },
    size(): number {
      return map.size;
    },
  };
}

/** Process-wide default cache, used by `cachedResolveTravelData`. */
export const defaultTravelDataCache: TravelDataCache = createTravelDataCache();

/** Sorted-key JSON for stable cache keys regardless of query field order. */
function cacheKey(kind: TravelDataKind, query: unknown): string {
  const queryJson = JSON.stringify(query, Object.keys(query as object).sort());
  return `${kind}|${queryJson}`;
}

function entryExpiry(
  response: TravelDataResponse<unknown>,
  defaultTtlMs: number,
  nowMs: number,
): number {
  if (response.source.expiresAt) {
    const t = new Date(response.source.expiresAt).getTime();
    if (!Number.isNaN(t) && t > nowMs) return t;
  }
  return nowMs + defaultTtlMs;
}

/**
 * Cached variant of `resolveTravelData`. A hit returns the cached `ok` response
 * without re-resolving; a miss resolves through the registry and stores the
 * result if and only if it is `ok`.
 */
export async function cachedResolveTravelData<TQuery, TData>(
  kind: TravelDataKind,
  query: TQuery,
  cache: TravelDataCache = defaultTravelDataCache,
): Promise<TravelDataResponse<TData>> {
  const nowMs = cache.now().getTime();
  const key = cacheKey(kind, query);
  const hit = cache.get<TData>(key, nowMs);
  if (hit) {
    incrementCounter("travel_data_cache_hit", { kind });
    return hit;
  }
  // Coalesce concurrent identical requests onto a single in-flight promise.
  const inflight = cache.getInflight<TData>(key);
  if (inflight) {
    incrementCounter("travel_data_cache_coalesced", { kind });
    return inflight;
  }
  incrementCounter("travel_data_cache_miss", { kind });
  const promise = resolveTravelData<TQuery, TData>(kind, query).then((response) => {
    if (response.status === "ok") {
      cache.set(key, { response, expiresAt: entryExpiry(response, cache.defaultTtlMs, nowMs) });
    } else {
      incrementCounter("travel_data_cache_bypass", { kind });
    }
    return response;
  });
  cache.setInflight<TData>(key, promise);
  return promise;
}
