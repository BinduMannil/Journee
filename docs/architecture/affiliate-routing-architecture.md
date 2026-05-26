# Affiliate Routing Architecture

_Last updated: 2026-05-26._

## Status

- **Domain model + routing resolver:** ✅ implemented (`src/lib/affiliate`).
- **Schema/RLS:** ✅ migration scaffold (`supabase/migrations/0002_affiliate.sql`).
- **Data wiring (catalog from DB) + event ingestion + UI surfacing:** 🔜 roadmap.

This document describes what exists and what is intentionally still ahead. No
operational/SLA claims are made for unbuilt pieces.

## Purpose

Monetize without hardcoding. Every affiliate link is **data** (`urlTemplate`),
selected at runtime by region/priority/fallback rules. The platform can add
providers, run campaigns, A/B test, and route geographically — all by changing
config/data, never code.

## Model

| Entity | Role |
| --- | --- |
| `AffiliateProvider` | An affiliate network/partner. |
| `AffiliateCampaign` | A time-boxed, category-scoped monetization effort under a provider. |
| `AffiliateLink` | A URL *template* (with placeholders) belonging to a campaign. |
| `AffiliateRegionRule` | Allow/deny a campaign for ISO country sets. |
| `AffiliatePriorityRule` | Ranking; region-specific beats global. |
| `AffiliateFallbackRule` | Category default when nothing else qualifies. |
| `AffiliateAttribution` | Opaque token bound to link/campaign. |
| `AffiliateClickEvent` / `AffiliateConversionEvent` | Analytics, in minor currency units. |

Categories: flights, hotels, experiences, tours, restaurants, insurance, esim,
ticketing, luxury, transportation.

## Resolution flow

```
request(category, region?) 
   │
   ▼
eligible = campaigns where category matches, enabled,
           provider enabled, time-window active, region allowed
   │
   ├─ has priority rule + enabled link? → pick lowest priority   (reason: "priority")
   │      (region-specific priority preferred over global)
   │
   └─ else → first category fallback rule with an enabled link    (reason: "fallback")
   │
   ▼
AffiliateResolution | null
```

The resolver (`routing.ts`) is a **pure function** over an injected
`AffiliateCatalog`, so it is deterministic and unit-testable now, independent of
the eventual data source.

## Failure behavior

| Scenario | Behavior |
| --- | --- |
| No eligible campaign, no fallback | Returns `null`; caller renders no affiliate CTA. |
| Region denied | Campaign excluded; deny rules take precedence over allow. |
| Campaign outside time window | Excluded. |
| Provider disabled | All its campaigns excluded. |

## Security & privacy

- Catalog tables are public-readable; **event tables are not** (deny-by-default
  RLS, write-only ingestion via privileged server paths).
- URL templates are validated/escaped when rendered; no raw link is baked into
  components.
- Attribution tokens are opaque and carry no PII.

## Catalog loading

The `AffiliateCatalog` is loaded by the `supabase-affiliate` provider
(`src/lib/providers/affiliate.supabase.ts`) under the `affiliate` capability,
gated on the `affiliate-catalog` flag + Supabase config. Callers obtain it via
`resolve<AffiliateCatalog>("affiliate")` and pass it to `resolveAffiliateLink`.

## Event ingestion

`POST /api/affiliate/click` validates the body (`src/lib/affiliate/events.ts`)
and inserts via the privileged **service-role** client
(`getSupabaseServiceClient`, server-only). When ingestion is unconfigured it
returns **503** rather than silently dropping data. Validation + row building
are pure and unit-tested; the route is a thin shell.

## Roadmap

1. ✅ Catalog provider that loads `AffiliateCatalog` from Supabase.
2. ✅ Click ingestion endpoint (server-only write). Conversion endpoint next.
3. ✅ UI surfacing of resolved links (gated `AffiliateCta`, safe rendering).
4. Conversion ingestion + revenue analytics + A/B assignment.
