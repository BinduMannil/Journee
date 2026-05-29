# Provider Architecture

_Last updated: 2026-05-27. Reflects code in `src/lib/providers`._

## Purpose

Keep Journee **provider-agnostic**. No application, UI, or (future) intelligence
code should import a vendor SDK directly. Instead they depend on capability
**contracts**, and concrete adapters are swapped or failed over behind a
registry.

## Contracts (`types.ts`)

- `ProviderCapability` — the kinds of thing a provider can answer for
  (`content`, `destinations`, `affiliate`, `weather`, `events`).
- `Provider<TResult>` — `{ id, name, capability, priority, isAvailable(), fetch() }`.
- Typed aliases per capability, e.g. `DestinationProvider`.

## Registry & routing (`registry.ts`)

- `registerProvider(p)` — adapters self-register; the list is kept sorted by
  `priority` (lower = preferred).
- `resolve<T>(capability)` — tries providers in priority order, skipping any
  that report unavailable or throw, and returns the first success — or `null`
  if all are exhausted.

This is the **single place** failover policy lives. Timeouts, caching, retries,
circuit-breaking, and structured logging/metrics belong here.

## Current providers

| Provider | Capability | Priority | Availability |
| --- | --- | --- | --- |
| `supabase-destinations` (`destinations.supabase.ts`) | destinations | 10 | flag `supabase-destinations` ON **and** Supabase configured |
| `local-seed` (`destinations.local.ts`) | destinations | 100 (lowest) | always |

Adapters self-register via `src/lib/providers/register.ts`. The seed provider is
an always-available fallback so the product renders even with nothing else
configured. The Supabase provider is preferred (lower priority number) but only
becomes available when both its feature flag is on and connection config is
present — otherwise routing falls through to the seed with no caller changes.

## Adding a provider (worked example: the Supabase adapter)

This is exactly how `destinations.supabase.ts` was built:

1. Implement `DestinationProvider`.
2. Gate `isAvailable()` on configuration (and, here, a feature flag) so it
   cleanly yields to the fallback when not ready.
3. Use a lower `priority` number than the fallback (`10` vs `100`).
4. Add the import to `register.ts`.

No caller changes — `resolve("destinations")` now prefers Supabase and falls
back to seed automatically. The backing schema + RLS live in
`supabase/migrations/0001_destinations.sql`.

## Failure behavior

| Scenario | Behavior |
| --- | --- |
| Preferred provider unconfigured | `isAvailable()` false → next provider. |
| Preferred provider throws | Caught → next provider. |
| All providers fail | `resolve` returns `null`; callers render an empty/sensible state. |

## Travel-data provider layer (`travel-data/`)

A second, **backend-only** provider family for real-world travel intelligence
lives under `src/lib/providers/travel-data`. These capabilities are
parameterized by a query (a destination or a place), so — like the weather
provider — they use their own small contract + registry rather than the no-arg
capability `resolve()`.

**Status: contract-ready only.** The contracts and the shared
source/freshness/confidence model are implemented and tested. The **only**
adapters wired today are clearly-labeled **SEED** adapters. No live travel-data
vendor is integrated, and none will be claimed as live until it is actually
implemented behind these contracts.

### Contracts (`contracts.ts`)

`TravelDataKind` covers seven domains: `places`, `opening-hours`,
`ticket-prices`, `ticket-links`, `reviews`, `local-events`,
`safety-advisories`. Each is a `TravelDataProvider<TQuery, TData>` with
`{ id, name, kind, sourceType, isAvailable(), fetch(query) }`.

`fetch` always resolves to a **fallback-safe** `TravelDataResponse<TData>` — a
discriminated union of `ok | unavailable | error` where `data` is always a
present key (`null` unless `ok`) and non-ok states carry a `reason` rather than
throwing. Every response carries `SourceMetadata`.

### Source attribution (`source.ts`)

`SourceMetadata` = `{ sourceName, sourceType, providerId, confidence,
fetchedAt?, expiresAt?, attributionUrl? }`. `sourceType` is one of
`seed | mock | live | stale | unavailable` (providers may only *declare*
`seed | mock | live`; `stale`/`unavailable` are runtime-derived). Confidence is
always clamped to 0..1 so a source can never claim out-of-range certainty.

### Freshness, confidence & quality (`freshness.ts`)

Pure, deterministic helpers (no I/O): `computeFreshness`/`isStale` (from
`expiresAt`), `normalizeConfidence` + `confidenceLevel` banding,
`effectiveSourceType` (demotes expired data to `stale`), `rankSources` (orders
live > seed > mock, then confidence, then recency), and `classifySourceQuality`
(`high|medium|low|none`, demoting stale data a band). This is where "is this
data good enough / fresh enough?" is decided.

### Registry & readiness (`registry.ts`)

Providers self-register (via `register.ts`) and are ordered by trust
(live > seed > mock). `resolveTravelData(kind, query)` tries them in order,
skips unavailable/non-ok, and **always** returns a `TravelDataResponse` (never
throws / never null). `reportTravelDataReadiness()` reports, per kind, whether a
contract exists, the registered providers + availability, the source types in
play, and whether the kind is **blocked** (no live provider wired) and why. It
is surfaced (read-only) under `/api/admin/status`.

### Seed adapters (`seed/`)

Deterministic sample data for the four seed destinations, one adapter per kind.
Seed is the always-available, lowest-trust fallback (mirroring the local-seed
destinations provider); ticket links use a neutral `example.com` placeholder
host so no real ticketing vendor is implied. Honesty is preserved by the `seed`
label on every response — seed data is never presentable as a live observation.

### Caching (`cache.ts`)

`cachedResolveTravelData(kind, query, cache?)` wraps `resolveTravelData` with
an in-process TTL cache. Only `ok` responses are cached; entry TTL prefers the
response's own `source.expiresAt` (so seed/mock/live TTLs all flow through) and
falls back to `defaultTtlMs`. Concurrent identical requests **coalesce** onto
a single in-flight promise (`travel_data_cache_coalesced`) — so fan-out from
the assemblers does not race the cache. The default cache instance is used
under `/api/admin/readiness`; assemblers accept an injected cache.

### Strict resolution (`registry.ts`)

`resolveTravelDataStrict(kind, query, { minQuality, dropStale })` downgrades an
`ok` response whose source quality is below a threshold (or whose source is
stale when `dropStale: true`) to `unavailable` with a clear reason. Use when a
caller cannot tolerate weak data but still wants the fallback-safe shape.

### Runtime schemas & JSON-Schema export (`schemas.ts`, `json-schema.ts`)

`contracts.ts` is the compile-time source of truth. `schemas.ts` mirrors those
shapes as zod schemas so the same contracts can be **validated at runtime** and
**exported as JSON Schema**. The two are kept in lock-step by compile-time
`Mirrors<>` assertions: if a contract interface and its schema drift (a
renamed/added/removed/retyped field on either side), `npm run typecheck` fails.
`readonly` is normalized away in the assertion because it is invisible in JSON.

- **Request validation.** Each travel-data kind has a query schema, exposed as
  `travelDataQuerySchemasByKind` plus per-kind exports
  (`placesQuerySchema`, …). Use `schema.safeParse(input)` at a request boundary
  (e.g. an admin endpoint) to reject malformed queries before resolution.
- **JSON Schema.** `travelDataJsonSchema(name, { target })` exports one named
  contract; `travelDataJsonSchemas()` exports the whole map (keyed by contract
  name) for an OpenAPI `components.schemas` block or a client-SDK generator.
  `target` is `"draft-2020-12"` (default) or `"draft-7"`. Output is pure,
  side-effect-free, and JSON-serializable.

These use zod's v4 API (`zod/v4`, shipped inside the installed `zod@3.25`
package) because `z.toJSONSchema` lives there; the rest of the app uses the
classic `zod` entrypoint and both share one install.

### Adding a LIVE travel-data adapter (worked example)

Live adapters slot in behind the same contract — no changes at call sites:

1. Implement `TravelDataProvider<TQuery, TData>` in
   `src/lib/providers/travel-data/live/<vendor>.ts`. `fetch` must always
   resolve to a `TravelDataResponse` (return `errorResponse(...)` rather than
   throw on failure) and always carry `SourceMetadata` with `sourceType: "live"`.
2. Gate `isAvailable()` on both env config (parsed in
   `src/lib/config/env.ts`) and a feature flag (`KNOWN_FLAGS` in
   `src/lib/config/flags.ts`) so it cleanly yields to the seed fallback when
   not ready.
3. Pick a `confidence` for the source honestly and set `expiresAt` from the
   vendor's freshness guarantee (the cache will respect it).
4. Add the import to `src/lib/providers/travel-data/register.ts`. The registry
   sorts by trust (live > seed > mock), so the live adapter is preferred
   automatically — no caller changes needed.
5. The observability counters (`travel_data_resolve_*`, `travel_data_cache_*`)
   start emitting for the new `providerId` from day one.

## Roadmap

Affiliate and the live travel-data vendors are declared/contracted but have no
live adapters yet. Each will be added under the same contract **only when
actually implemented** — registered ahead of the seed adapter, gated on config
via `isAvailable()`, with its dependency-register row and docs updated in the
same PR.
