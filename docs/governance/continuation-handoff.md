# Continuation Handoff

_Last updated: 2026-05-29. Snapshot for the next engineer/agent to resume
without context loss._

## Where things stand (read first)

This session **unified two divergent tracks onto `main`** after a full
read-only audit:

- **AI-planning + live-weather track** — previously developed directly on
  `main` (merge-PRs through #13): server-only Anthropic LLM seam (inert until
  `LLM_API_KEY` + `ai-planning` flag), hardened `POST /api/plan/ai` (bounded
  input, zod-validated response, clean `502`/`402`/`429` contract, quota not
  consumed on failure), a **keyless Open-Meteo live weather provider** (inert
  behind the `live-weather` flag), AI readiness on `/api/health`.
- **Travel-data backend architecture** — previously developed on
  `claude/quirky-keller-2S10c` (PRs #14–#28): contract-ready, seed-fed,
  provider-gated travel intelligence end-to-end (see the layer list below).

Both tracks branched from common base `4c18430` and never shared a tip until
now. They were merged cleanly (only the handoff doc conflicted) and the unified
tree passes `typecheck`, `lint`, `test`, `build`, and the e2e `smoke`.

### Branches & PRs

| Ref | State |
| --- | --- |
| `main` | **Unified this session** — contains both the AI/weather track and the full travel-data architecture (#14–#28) + session-4 work. |
| `claude/quirky-keller-2S10c` | Travel-data integration branch (PRs #14–#28). Should be re-synced to `main` for future work (or branch fresh from `main`). |
| PR #1 | Merged 2026-05-27 (foundation only — predates the travel-data work). |

### Session 4 (2026-05-29) — what shipped

Merged into `claude/quirky-keller-2S10c`, then unified to `main`:

- **#26 — JSON-schema export for the travel-data contracts.** `travel-data/
  schemas.ts` (zod **v4** via `zod/v4`, shipped inside `zod@3.25`) mirrors every
  contract — `SourceMetadata`, domain payloads, per-kind query payloads, the
  fallback-safe discriminated response. Compile-time `Mirrors<>` assertions keep
  schemas in lock-step with `contracts.ts` (drift breaks `typecheck`).
  `travel-data/json-schema.ts` emits pure JSON Schema (`travelDataJsonSchema` /
  `travelDataJsonSchemas`, draft-2020-12 or draft-7) for OpenAPI / SDK / runtime
  validation. Per-kind query schemas (`travelDataQuerySchemasByKind`) ready a
  request boundary to `safeParse`.
- **#27 — Two latent travel-data correctness fixes (found by the audit).**
  (HIGH) `isOpenNow` overnight spans were attributed to today's record instead
  of the previous day's span (only correct under uniform weekday hours). (MEDIUM)
  cache `entryExpiry` granted a fresh default TTL to an `ok` source whose
  `expiresAt` was already past (serving stale-as-fresh). Both latent under seed
  data; both break once a live provider is wired. Regression-tested.
- **#28 — Affiliate categories single source of truth (found by the audit).**
  `/api/affiliate/link`'s `CATEGORIES` Set duplicated the `AffiliateCategory`
  union; derived the type from a canonical `AFFILIATE_CATEGORIES` array (same
  pattern as `KNOWN_FLAGS`). No behavior change.
- **Unification PR — merge travel-data → `main` + weather audit follow-ups.**
  Merged the travel-data branch into `main`; applied the 3 non-blocking
  Open-Meteo follow-ups from the audit (honest "fixed host" comment instead of
  the unimplemented "allow-listed host" claim; `getDestinationComfort` wraps the
  throwing live `fetchCurrent` in try/catch → `null`; lat/lon via
  `URLSearchParams` + finite guards).

### Pre-merge full-codebase audit (this session)

Four read-only agents covered **both** tracks. **Verdict: safe to merge.**

- **Security & honesty — clean.** No committed secrets (env boundary is the only
  reader; keys never logged); admin + LLM + weather paths are secure/inert by
  default; inputs `safeParse`d; SourceMetadata makes seed data structurally
  unpresentable as live. LOW documented roadmap items only (phased CSP; in-memory
  quota store).
- **Correctness — 2 travel-data bugs found and fixed (#27);** AI/weather/LLM
  track correct (timeouts, zod validation, honest failure contract).
- **Code quality / provenance — clean; NO foreign/"codex" drift detected.**
  Uniform house style across both tracks. Mediums fixed (#28 + weather
  follow-ups); remaining are optional LOW hygiene (below).

### Travel-data layers (PRs #14–#25, recap)

All under `src/lib/providers/travel-data` + `src/lib/intelligence`:

1. **#14 Provider contracts** — 7 capabilities (places, opening-hours,
   ticket-prices, ticket-links, reviews, local-events, safety-advisories);
   shared `SourceMetadata` (type ∈ seed|mock|live|stale|unavailable); pure
   freshness/confidence/quality helpers; fallback-safe discriminated
   `TravelDataResponse` (`data` always present); trust-ordered registry +
   `reportTravelDataReadiness()` under `/api/admin/status`; seed-only adapters
   (ticket links use a neutral `example.com` placeholder).
2. **#15 Engine bridge** (`travel-data-context.ts`) — opening hours →
   `isOpenNow` (tz-aware, overnight-safe after #27); advisory → confidence;
   active events → festival intensity. Only `ok` responses yield fragments.
3. **#16 Destination assembler** (`destination-readiness.ts`) — pure compose +
   registry-walking assemble, per-source provenance. Never throws.
4. **#17 Observability counters** — `travel_data_resolve_*`, `_provider_*`,
   `_kind_*`, labeled `{kind, providerId}`.
5. **#18 Trip assembler** (`trip-readiness.ts`) — per-stop compose via scoring
   core + `trip-readiness-v1` weights; mean-of-stops confidence.
6. **#19 In-process TTL cache** (`cache.ts`) — only `ok` cached; TTL prefers
   `source.expiresAt`; `travel_data_cache_{hit,miss,bypass}`.
7. **#20 Gated admin readiness** — `GET /api/admin/readiness` (503/401/400),
   destination + trip modes; smoke-covered.
8. **#21 Quality-aware strict resolver** — `resolveTravelDataStrict({minQuality,
   dropStale})` downgrades weak/stale `ok` → `unavailable` with reason.
9. **#22 Cache through assemblers + in-flight dedupe** — shared cache across
   stops; `travel_data_cache_coalesced`.
10. **#23 Admin route uses default cache + docs** (live-adapter worked example).
11. **#24 Latency instrumentation** — `travel_data_resolve_duration_ms_total
    {kind,providerId,outcome}`.
12. **#25 Live-adapter TEMPLATE** (`live/TEMPLATE.ts`) — compilable, **NOT
    registered**, codifies the live-adapter pattern.

## Session 5 (2026-05-29) — feature build sprint (all merged to `main`)

Autonomous build-out of product-owner feature requests. **Each is a focused PR,
seed/estimate-backed and honestly labeled (a `*_DATA_NOTE` disclaimer), no UI, no
Supabase, no secrets, no live claims.** All merged to `main`, CI `verify` green.

- **#33 `resolveTravelDataMany`** — heterogeneous fan-out over the registry;
  responses aligned by index; optional injected (cache-backed) resolver.
- **#34 `/api/admin/cache`** — gated cache stats (size + `travel_data_cache_*`)
  + DELETE clears the default cache.
- **#35 Trip carbon estimate** (`intelligence/carbon.ts`) — per-passenger CO2e
  from route distance × versioned emission model (`carbon-v1`), mode inferred
  per leg; honest "estimate" basis.
- **#36 Food & drink customs** (`content/culinary.ts` + `intelligence/culinary.ts`)
  — popular dishes, signature drink, pork/beef prevalence, veg-friendliness,
  alcohol-in-supermarkets + public-drinking; derived honest flags.
- **#37 Know-before-you-go essentials** (`content/essentials.ts` +
  `intelligence/essentials.ts`) — emergency numbers (+flat list), healthcare
  note, courtesy phrases (local language), etiquette do's/don'ts.
- **#38 Shopping & essentials** (`content/shopping.ts` + `…/shopping.ts`) —
  malls, markets/souks, online/e-commerce, fuel networks + EV-charging, payment
  norms + tips.
- **#39 Local chains** (`content/chains.ts` + `…/chains.ts`) — recognizable
  cinema/coffee/pharmacy/supermarket/fast-food/hospital chains per destination.
- **#40 Seasonal fruits** (`content/fruits.ts` + `…/fruits.ts`) — in-season (by
  local month) + must-try fruits with editorial global taste/production ratings.

All new content modules cover the 4 seed destinations (kyoto, santorini,
marrakech, patagonia) and are registered on `/about` via `src/content/systems.ts`.
Test count **279 → 314**. Each lib accessor is exported from the
`src/lib/intelligence` barrel and unit-tested directly.

**Pattern for new local-knowledge features (follow this):** `src/content/<x>.ts`
(editorial seed data + a `<X>_DATA_NOTE` disclaimer) + `src/lib/intelligence/<x>.ts`
(pure accessor + small derived helpers) + barrel export + `test/intelligence.<x>.test.ts`
+ a `systems.ts` row + a `docs/roadmap.md` row. Branch off `main`, ONE feature per
PR, run the full gate (`rm -rf .next` before typecheck to avoid stale route
types), squash-merge at green.

## What is real vs. roadmap (read before extending)

- **Real & tested:** all 12 travel-data layers + #26 JSON-schema export; the
  AI-planning backend (config-only to enable) and Open-Meteo live weather
  provider (flag-gated, inert); affiliate vertical; intelligence scoring core +
  engines + solar/moon/geo; observability + admin control plane.
- **Contract-ready only:** travel-data **live vendors** — only seed adapters
  wired; live adapters slot behind the same contract (`provider-architecture.md`
  worked example + `live/TEMPLATE.ts`). Open-Meteo weather + Anthropic LLM are
  built and inert until their flags/keys are set.
- **Externally blocked (need access):** hosted Supabase; live weather egress
  (Open-Meteo host) and a live LLM key (no network in this env); branch
  protection / org settings.
- **UI deferred** — the existing UI is unchanged; no `.tsx`/page files touched
  this session. The gated `TravelReadiness` mock preview was NOT modified.

No operational claims are made for unbuilt systems — keep it that way.

## Non-blocked next steps (pick in order)

**Product-owner requested feature backlog (build next, in this order — same
seed-backed pattern; `docs/roadmap.md` is the live register).** TIP: independent
seed features can be built **in parallel** — spawn one sub-agent per feature to
write only its 3 new files (content + lib accessor + test, no shared-file edits,
self-test with tsx), then the orchestrator wires the barrel/`systems.ts`/roadmap
once and runs one gate (this is how #49 and #50 shipped 6 features in 2 batches).

1. **UV & weather-protection customs** — editorial seed of local protections
   (siesta, parasols, layering, hammam); UV index from the live weather feed
   later (⛔ egress).
2. **Hospital / clinic locations** — extend essentials (live/geo later).
3. **Follow graph & journey feed** — pure feed-composition over a follow set +
   posts. (Storage/auth/UI blocked; build the pure core now.)
4. **Public notes & travel blogs/vlogs** — pure content model + zod validation
   (scaffold like `affiliate/types.ts`). (Storage/auth/UI blocked.)
5. **best-time-to-visit**, **accessibility capability**, **multi-currency
   normalization**, **"explain my ranking" endpoint**, **itinerary GeoJSON
   export**, plus more suggestions (dress code, public-transport how-to,
   timezone & business hours, packing guidance, photography rules) — see
   `docs/roadmap.md` backlog.
6. **Fold seed signals into engines** — e.g. city-vibe friendliness → City
   Energy engine; inclusion → safety; these are currently standalone accessors.

**Engineering hardening (non-blocked):**

7. **Per-kind latency histograms** — extend `_duration_ms_total` with bucketed
   counts (`_bucket{le=…}`) for honest P50/P95.
8. **Engine-bridge expansion** — feed the safety engine from review highlights
   (crowd text → `crowd_safety`), or conditions from advisory/events. Pure.
9. **Per-destination editorial-confidence signal** — seed-readiness × editorial
   coverage % → per-destination "data confidence" under admin readiness.

Done in session 5 (all merged to `main`): `resolveTravelDataMany` (#33),
`/api/admin/cache` (#34), carbon (#35), food/drink customs (#36), essentials
(#37), shopping (#38), chains (#39), seasonal fruits (#40), handoff (#41),
airport intel (#42), ratings core (#43), airport/airline ratings (#44), handoff
(#45), local gems (#46), city vibe (#47), festivals + UI backlog (#48),
**parallel batch 1**: religion + tipping + connectivity (#49), **parallel batch
2**: inclusion + cost index + scams/safety (#50). Test count **279 → 356**.
New this session: `docs/ui-backlog.md` (the deferred-UI register).

> Branch note: session-4/5 work went to `main` directly via PRs branched off
> `main`. `claude/quirky-keller-2S10c` is stale — branch fresh from `main`.

### Optional LOW hygiene backlog (from the audit — non-blocking)

- `isAiPlanningEnabled` (`llm/index.ts`) exported "for status surfaces" but
  unused — wire into `/api/admin/status` or remove.
- `travelDataStatusSchema` (`schemas.ts`) — public schema export not yet
  referenced (intentional API surface).
- Affiliate scaffold domain types overlap snake_case row types in `events.ts` —
  unify when the DB write path lands.
- Comfort-band constants (`comfort.ts`) and `max_tokens` (`anthropic.ts`) are
  inline — consider moving to config.
- FNV-1a hash duplicated in `intelligence/mock.ts` + `experiments/assignment.ts`
  (different return contracts) — extract a shared helper if touched again.

## Hard constraints (do NOT violate — copy verbatim into the next handoff)

- No UI work. No `.tsx` components, no Next.js page files. The only `src/app`
  changes allowed are API routes.
- No Supabase work. No `supabase/` files. No hosted DB migrations applied or
  attempted. Supabase remains externally blocked.
- No LLM-planning changes. `src/lib/providers/llm/*` and `src/app/api/plan/ai/*`
  stay untouched unless shared types force a change.
- No secrets in commits. No real API keys, no environment values.
- No fake live-data claims. Every external-data response must carry
  `SourceMetadata` labeling it seed, mock, or live honestly. Seed data is never
  presentable as live.
- Provider-gated, config-driven, tested, honestly documented for every change.

## Conventions to keep (copy verbatim into the next handoff)

- New external integrations go **behind a provider adapter**, gated by
  `isAvailable()` so fallback holds.
- No hardcoded copy/links/thresholds — use `config`/`content`/versioned weights.
- Every architecture-changing PR updates the relevant `docs/` file in the same
  PR; add an ADR for significant decisions; append to the AI audit trail for
  autonomous changes.
- Do NOT ask for approval mid-task. Implement → audit → test → open PR → merge if
  clean. Only stop to ask if something is genuinely ambiguous, architecturally
  significant, or destructive.
- Each PR scope: ONE focused layer. Squash-merge. Rebase onto the latest base
  before opening the PR so the diff shows only the new layer.
- For every PR: run `npm run typecheck && npm run lint && npm test && npm run
  build && npm run smoke` locally before pushing; subscribe to PR activity and
  merge when CI is green.

## Session-end handoff requirement (propagate forward — do not drop)

You must keep going across multiple PRs until you run out of context tokens.
When tokens get low (or whenever the user explicitly says to stop), produce a
detailed handoff prompt for the session after you, following the same format as
the originating prompt:

1. The hard constraints (copy them verbatim).
2. A "What was shipped last session" section listing every PR you merged with PR
   number, title, and a one-paragraph summary.
3. Updated "real vs. roadmap" and branch/PR state.
4. Updated non-blocked next-steps list (remove what you completed, add what you
   discovered).
5. The conventions (copy verbatim).
6. This "Session-end handoff requirement" section, verbatim, so the chain
   continues across every future session until the architecture is genuinely
   done or the user stops it.

Mirror what was done here in this file (`docs/governance/continuation-handoff.md`)
in your last PR of the session. The goal is that any new session can pick up
cold with no context loss.
