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
| Editorial catalog | `src/content/destinations.ts` | Typed data; shape == future provider return type. |
| Hero quotes | `src/content/destinations.ts` (`heroQuotes`) | Passed into `QuoteRotator` as props. |
| Image allow-list | `next.config.mjs` `remotePatterns` | Sources are config, not inline in components. |
| Env / secrets | `.env.local` (template: `.env.example`) | Read at the config boundary, never inlined. |

## Principles

1. **Components are dumb about content.** They receive data via props or read
   from `lib/config` — they never contain product copy or business thresholds
   as literals.
2. **Config has a stable shape.** Typed interfaces mean the *source* can change
   (file → CMS → database) without touching consumers.
3. **Validate at the boundary.** When env-driven config arrives, it is parsed
   and validated once, at the edge, then passed as typed values inward.

## Roadmap

- **Feature flags.** `JOURNEE_ENABLED_FEATURES` exists in `.env.example` as the
  intended seam; a typed `flags` accessor and runtime evaluation come with the
  first flagged feature.
- **DB/CMS-backed config provider.** Will register under the `content`
  capability (see provider architecture) so config becomes swappable like any
  other provider.
- **Versioned, tunable scoring.** When intelligence engines land, their weights
  and thresholds live in versioned config — never as code constants — so they
  are explainable and auditable.
