# Configuration Architecture

_Last updated: 2026-05-26._

## Purpose

Encode the **no-hardcoding policy**: user-facing copy, content, and tunable
behavior are sourced from configuration/data, not embedded in components. This
keeps the platform CMS-manageable, feature-flag capable, and auditable as it
grows.

## Current implementation

| Concern | Source | Notes |
| --- | --- | --- |
| Site identity / copy | `src/lib/config/site.ts` | Single `SiteConfig` object consumed by layout + page. |
| Editorial catalog | `src/content/destinations.ts` | Typed data; shape == provider return type. |
| Hero quotes | `src/content/destinations.ts` (`heroQuotes`) | Passed into `QuoteRotator` as props. |
| Image allow-list | `next.config.mjs` `remotePatterns` | Sources are config, not inline in components. |
| Env validation | `src/lib/config/env.ts` | **zod-validated boundary.** Parsed once; throws only on malformed values. Inner code never reads `process.env`. |
| Feature flags | `src/lib/config/flags.ts` | Typed `FeatureFlag` union from `JOURNEE_ENABLED_FEATURES`; `isFeatureEnabled()` accessor. |
| Env / secrets | `.env.local` (template: `.env.example`) | Read at the config boundary, never inlined. |

## Principles

1. **Components are dumb about content.** They receive data via props or read
   from `lib/config` — they never contain product copy or business thresholds
   as literals.
2. **Config has a stable shape.** Typed interfaces mean the *source* can change
   (file → CMS → database) without touching consumers.
3. **Validate at the boundary.** When env-driven config arrives, it is parsed
   and validated once, at the edge, then passed as typed values inward.

## Experimentation / A-B assignment

`src/lib/experiments/assignment.ts` provides deterministic, storage-free
bucketing: `assignVariant(key, variants)` hashes a stable key (session/user id)
into a weighted variant, so the same key always resolves to the same variant in
stateless server rendering. This is the seam for monetization A/B tests and
gradual rollouts (e.g. weighting affiliate priority rules). Pure and unit-tested.

## Roadmap

- **Remote flag service.** `flags.ts` is the seam; today flags come from env.
  A remote evaluation service can replace the source without touching callers.
- **DB/CMS-backed config provider.** Will register under the `content`
  capability (see provider architecture) so config becomes swappable like any
  other provider.
- **Versioned, tunable scoring.** When intelligence engines land, their weights
  and thresholds live in versioned config — never as code constants — so they
  are explainable and auditable.
