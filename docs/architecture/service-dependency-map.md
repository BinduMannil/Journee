# Service & Dependency Map

_Last updated: 2026-05-26. Reflects dependencies that actually exist today._

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
| Google Fonts (`next/font`, build-time) | Brand typography | build fails if fetch fails | self-host fonts (roadmap) | retry build / cache | low | none | build status |
| Unsplash (runtime images) | Seed imagery | broken images on cards | replace with owned assets | swap config URLs | low — allow-listed in config | allow-list only | n/a |
| npm registry (build/CI) | Dependency install | CI/build fails | lockfile + cache | retry; vendor cache | low | lockfile pinning, `npm audit` in CI | CI status |

## Internal module dependencies (no external I/O)

| Module | Depends on | Notes |
| --- | --- | --- |
| `app/page` | provider registry, config, content | Never imports a vendor SDK directly. |
| `lib/providers/*` | `config/env`, `config/flags` | Adapters gate availability on config/flags. |
| `lib/affiliate/routing` | `lib/affiliate/types` only | Pure; no I/O. |
| `lib/intelligence/*` | own types/weights | Pure; no I/O. |

## Roadmap dependencies (not yet integrated)

Weather/AQI APIs, event/holiday calendars, government travel advisories,
affiliate networks, AI model providers. Each will be added **behind a provider
adapter** with its own dependency-register row when integrated — including
failure/fallback/recovery once those are real, not before.
