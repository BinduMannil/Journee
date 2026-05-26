# Journee

> Cinematic travel intelligence — an editorial, context-aware way to discover
> destinations through mood, atmosphere, and real-world conditions.

Journee is **not** a generic OTA or a static itinerary builder. The long-term
vision is a contextual destination-intelligence platform. This repository is at
the **foundation** stage: a real, runnable Next.js application that establishes
the design system, the provider-agnostic architecture, and the configuration
patterns the rest of the platform will build on.

## Status

| Area | State |
| --- | --- |
| App scaffold (Next.js 15 App Router, TS strict, Tailwind v4) | ✅ Built & building |
| Cinematic design system (Playfair Display + Montserrat, gold/warm palette) | ✅ Built |
| Config-driven content (no hardcoding in components) | ✅ Pattern in place |
| Config validation (zod env boundary) + feature flags | ✅ Built |
| Provider adapter + registry + fallback | ✅ Built (seed + Supabase adapters) |
| Supabase destinations adapter + RLS migration | ✅ Adapter + migration scaffold (flag-gated) |
| Intelligence engines (destination, events, weather, safety, etc.) | 🔜 Roadmap (see `/docs`) |

Everything marked 🔜 is **roadmap, not implemented**. The docs are written to
say so plainly rather than describe systems that don't exist yet.

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run typecheck
npm run lint
```

## Stack

- **Next.js 15** App Router, React 19, Server Components
- **TypeScript** strict mode (`noUncheckedIndexedAccess`, no unused, etc.)
- **Tailwind CSS v4** (CSS-first tokens in `src/app/globals.css`)
- **Supabase / PostgreSQL** planned as the data platform (ADR-002)

## Project structure

```
src/
  app/                 # App Router routes, layout, global styles
  components/          # Presentational, data-via-props components
  content/             # Typed seed content (catalog, quotes)
  lib/
    config/            # Central configuration (the no-hardcoding seam)
    providers/         # Provider-agnostic adapter contracts + registry
docs/                  # Architecture, decisions (ADRs), governance, security
.github/               # PR template + CI workflow
```

## Documentation

Start at [`docs/README.md`](docs/README.md). Key entry points:

- Architecture overview → [`docs/architecture/system-architecture.md`](docs/architecture/system-architecture.md)
- Why the big decisions → [`docs/decisions/`](docs/decisions)
- How we work (branches, PRs) → [`docs/governance/branch-and-pr-governance.md`](docs/governance/branch-and-pr-governance.md)
