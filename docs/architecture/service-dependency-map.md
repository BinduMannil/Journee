# Service & Dependency Map

_Last updated: 2026-05-27. Reflects dependencies that actually exist today._

This map is deliberately scoped to **real** dependencies. Planned integrations
appear under "Roadmap" without operational claims.

## Current runtime dependency graph

```
                       ┌──────────────────────┐
   user browser ──────▶│  Next.js app (RSC)    │
                       │   page → provider     │
                       │        registry       │
                       └───────────┬──────────┘
                                   │ resolve("destinations")
                  ┌────────────────┴───────────────┐
                  ▼ (priority 10, flag-gated)        ▼ (priority 100, always)
        ┌───────────────────┐              ┌────────────────────┐
        │ Supabase adapter   │              │ Local seed provider │
        │  → Supabase/Postgres│              │  → in-repo content  │
        └───────────────────┘              └────────────────────┘
        (build-time) Google Fonts via next/font   (runtime) Unsplash images
```

## Dependency register

| Dependency | Why it exists | Failure consequence | Fallback | Recovery | Coupling risk | Security | Monitoring (planned) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Next.js / React | App framework & rendering | App can't build/serve | none (core) | redeploy last good build | high (core) | server-default secret isolation | build status, uptime |
| Supabase / Postgres | DB-backed catalog & future data | DB-backed features unavailable | seed provider serves catalog | reconnect; provider re-enables when `isAvailable()` | medium — isolated behind adapter | anon vs service-role split; RLS deny-by-default | query errors, latency |
| Brand fonts (self-hosted via `@fontsource-variable`) | Brand typography | n/a — bundled, no network | n/a | n/a | none | none | n/a |
| Unsplash (runtime images) | Seed imagery | broken images on cards | replace with owned assets | swap config URLs | low — allow-listed in config | allow-list only | n/a |
| npm registry (build/CI) | Dependency install | CI/build fails | lockfile + cache | retry; vendor cache | low | lockfile pinning, `npm audit` in CI | CI status |

## Internal module dependencies (no external I/O)

| Module | Depends on | Notes |
| --- | --- | --- |
| `app/page` | provider registry, config, content | Never imports a vendor SDK directly. |
| `lib/providers/*` | `config/env`, `config/flags` | Adapters gate availability on config/flags. |
| `lib/providers/travel-data/*` | own contracts/source/freshness only | Pure + seed data; **no external I/O today**. Contracts for places/hours/prices/links/reviews/events/advisories; only SEED adapters wired. |
| `lib/affiliate/routing` | `lib/affiliate/types` only | Pure; no I/O. |
| `lib/intelligence/*` | own types/weights | Pure; no I/O. |
| `lib/intelligence/travel-data-context` | intelligence engine types + travel-data contract/freshness types | Pure bridge; no I/O. Maps travel-data responses → engine input fragments, gated on response status/freshness. |

## Roadmap dependencies (not yet integrated)

Weather/AQI APIs, event/holiday calendars, government travel advisories,
affiliate networks, AI model providers, and the live **travel-data** vendors
(places, opening hours, ticket prices/links, reviews). The travel-data
**contracts** exist now (`lib/providers/travel-data`), backed only by SEED
adapters; no live vendor is wired, so there is **no external dependency to
register yet**. Each will be added **behind a provider adapter** with its own
dependency-register row when integrated — including failure/fallback/recovery
once those are real, not before.
