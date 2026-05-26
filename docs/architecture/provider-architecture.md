# Provider Architecture

_Last updated: 2026-05-26. Reflects code in `src/lib/providers`._

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

## Roadmap

Affiliate, weather, and events capabilities are declared in the enum but have no
adapters yet. They will be added under the same contract when those systems are
designed.
