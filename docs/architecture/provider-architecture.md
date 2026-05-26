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
| `local-seed` (`destinations.local.ts`) | destinations | 100 (lowest) | always |

The seed provider is an always-available fallback so the product renders even
with nothing else configured.

## Adding a provider (e.g. Supabase destinations)

1. Implement `DestinationProvider` in `destinations.supabase.ts`.
2. Make `isAvailable()` return false when env/config is missing (so it cleanly
   yields to the seed fallback).
3. Register with a lower `priority` number than the seed (e.g. `10`).
4. Import it where the registry is initialized.

No caller changes — `resolve("destinations")` now prefers Supabase and falls
back to seed automatically.

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
