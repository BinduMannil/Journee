# ADR-005: Data-driven affiliate routing (no hardcoded links)

- **Status:** Accepted (model + resolver implemented; data wiring roadmap)
- **Date:** 2026-05-26
- **Deciders:** Founding engineering

## Context

Journee monetizes via affiliate links across many categories (flights, hotels,
experiences, insurance, eSIMs, ...) and many partners, with geo-aware routing,
campaigns, and A/B testing on the roadmap.

## Problem

Decide how affiliate links are stored, selected, and attributed so that nothing
is hardcoded and monetization is fully tunable and auditable.

## Decision

Model affiliate monetization as **data**: providers, campaigns, link templates,
region rules, priority rules, and fallback rules. A **pure routing resolver**
selects the best link per (category, region) by eligibility → region → priority
→ fallback. Links are URL *templates*; the final URL is composed at render time.
Click/conversion events are recorded for attribution and analytics.

## Alternatives considered

- **Hardcoded links per surface.** Fastest, but violates the no-hardcoding
  policy, can't do geo/AB/campaigns, and isn't auditable.
- **Third-party affiliate aggregator only.** Useful as *a provider*, but we
  still need vendor-agnostic routing/attribution above it.
- **Rules engine / DSL.** Overkill now; the typed rule tables cover current
  needs and can grow.

## Tradeoffs

- (+) Fully configurable, geo-aware, campaign- and A/B-ready, auditable.
- (+) Resolver is pure → trivially testable and deterministic.
- (−) More moving parts (several tables) than inline links.
- (−) Requires an ingestion path for events (roadmap).

## Security implications

Catalog is public-readable; **event tables are write-only** to the public and
ingested via privileged server paths (deny-by-default RLS). URL templates are
escaped at render. Attribution tokens carry no PII.

## Operational implications

Monetization changes are data changes (no deploy). Revenue analytics derive from
event tables. A/B assignment plugs into the resolver via priority/region rules.

## Rollback strategy

The resolver is isolated and pure; if the model proved wrong, only
`src/lib/affiliate` and the migration change — no UI coupling exists yet. Data
changes are reversible via migration down-steps.

## Scaling considerations

Catalogs are small and cacheable. Event tables are append-only and partition by
time as volume grows. Region/priority rules let routing shard per market.
