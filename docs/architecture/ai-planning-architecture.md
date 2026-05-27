# AI Planning Architecture

_Last updated: 2026-05-27._

## Status

- **Provider seam + Anthropic adapter:** ✅ implemented
  (`src/lib/providers/llm`).
- **Route contract (`POST /api/plan/ai`) + metering/abuse gates:** ✅ implemented
  and tested.
- **Going live:** config-only — set `LLM_API_KEY` (+ optional `LLM_MODEL`) and add
  `ai-planning` to `JOURNEE_ENABLED_FEATURES` (see
  `docs/runbooks/hosted-enablement.md`).
- **UI wiring:** 🔜 intentionally **deferred**. The `/plan` page renders the
  deterministic itinerary engine; connecting it to this endpoint is a separate,
  later task.

This document describes what exists. No operational/SLA claim is made for the
live LLM call beyond what the tests exercise (the network boundary is mocked;
no key is present in CI).

## Purpose

Generate an evocative, structured day-by-day trip plan from a set of chosen
destinations — **without** coupling the app to any one vendor, and **without**
ever being on by default. The capability is a drop-in: connecting a key + flag
is the only step to switch it on, and it cleanly yields to the deterministic
planner when off or failing.

## Seam (`src/lib/providers/llm`)

A small capability-specific seam (like the weather seam), separate from the
generic provider registry:

| Piece | Role |
| --- | --- |
| `PlanningProvider` (`types.ts`) | Contract: `{ id, isAvailable(), generate(request) }`. |
| `anthropicPlanningProvider` (`anthropic.ts`) | Default adapter → Anthropic Messages API. |
| `getPlanningProvider()` (`index.ts`) | Returns the first available provider, or `null`. |

Add another vendor by implementing `PlanningProvider` and adding it to the list
in `index.ts` in priority order. No caller changes.

### Availability (the AND-gate)

`isAvailable()` = `getLlmConfig() !== null` **AND** `isFeatureEnabled("ai-planning")`.
Both halves are required and each is covered by a test. Until both are set the
seam is **inert** — `getPlanningProvider()` returns `null` and the route answers
`503`.

### Server-only guarantee

The adapter reads the **non-public** `LLM_API_KEY` via the validated env boundary
(`getLlmConfig`). Because it lacks the `NEXT_PUBLIC_` prefix, Next.js never inlines
it into the client bundle, and the module is imported only by the server route —
so the key cannot reach the client. The key is never logged or returned.

## Route contract (`POST /api/plan/ai`)

`src/app/api/plan/ai/route.ts` is a thin server handler. Flow:

```
parse JSON ──fail──▶ 400 invalid_json
   │
validate body (zod) ──fail──▶ 400 invalid_body
   │   (1–20 destinations, per-field length caps, notes ≤500 — a cost/abuse bound)
   │
getPlanningProvider() ──null──▶ 503 ai_planning_unavailable
   │
entitlement check (free → credits) ──exhausted──▶ 402 quota_exhausted
   │
per-IP free ceiling (free source only) ──over──▶ 429 ip_free_limit_reached
   │
provider.generate() ──throws──▶ 502 ai_planning_failed   (quota NOT consumed)
   │
   ▼
200 { summary, days[], providerId, model, entitlement }   (consume on success only)
```

| Status | Body `error` | Meaning |
| --- | --- | --- |
| `200` | — | Plan generated; quota consumed exactly once. |
| `400` | `invalid_json` / `invalid_body` | Unparseable or schema-invalid request. |
| `402` | `quota_exhausted` | Free quota + credits used up. |
| `429` | `ip_free_limit_reached` | Per-IP free ceiling hit. |
| `502` | `ai_planning_failed` | LLM error or malformed shape; quota untouched. |
| `503` | `ai_planning_unavailable` | Capability off (key and/or flag missing). |

`GET` (and other methods) → `405` (POST-only). `dynamic = "force-dynamic"`.

## Validation

- **Request:** bounded zod schema (above). The bounds cap how large a prompt — and
  therefore how expensive a call — a single request can produce.
- **Response:** the model's text is fence-stripped, JSON-parsed, then validated by
  `parsePlanResponse` against a strict schema (non-empty `summary`; 1–60 `days`,
  each with a non-empty `title` and an optional `detail`). A truncated/off-shape
  completion **throws**, so the route returns `502` rather than a malformed `200`.

## Metering & abuse gates

Both run **before** the paid LLM call, and consume only **after** a successful
generation (see `docs/runbooks/hosted-enablement.md` §2a for the durability
caveats — the default store is in-memory/per-instance):

- **Entitlement** (`src/lib/billing/entitlements.ts`): free quota first
  (`FREE_AI_PLANS`), then credits; `402` when exhausted.
- **Per-IP free ceiling** (`FREE_AI_PLANS_PER_IP`): bounds free plans per client
  IP so cycling cookies can't farm unlimited free usage; `429` when exceeded.
  Paid (credit) usage is exempt.

The metering subject is the anonymous `jid` cookie, parsed off the request's
`Cookie` header by `getVisitorId(request.headers)` — keeping the handler a pure
function of the `Request` (no `next/headers` request-scope coupling), which is
what makes the entitlement/abuse paths unit-testable.

## Failure behavior

| Scenario | Behavior |
| --- | --- |
| Key and/or flag missing | `503`; client falls back to the deterministic planner. |
| LLM HTTP error (non-2xx) | Adapter throws → `502`; quota not consumed. |
| Malformed/truncated completion | `parsePlanResponse` throws → `502`; quota not consumed. |
| Out of quota + credits | `402` before any LLM call. |
| Per-IP free ceiling reached | `429` before any LLM call. |

## Tests

`test/ai.planning.test.ts` (unconfigured env): missing-key `503`, malformed JSON
`400`, invalid body `400`, fence stripping. `test/ai.planning.enabled.test.ts`
(env + flag set, `fetch` mocked): availability, flag-disabled + missing-key
gating, over-large payload `400`, success `200` (+ quota consumed), LLM failure
`502`, malformed response `502`, quota exhausted `402`, per-IP limit `429`, and
`parsePlanResponse` shape validation. Smoke POSTs the endpoint and asserts the
inert `503`.

## Roadmap

1. ✅ Provider seam + Anthropic adapter (inert until configured).
2. ✅ Route contract with bounded request + strict response validation.
3. ✅ Metering + per-IP abuse gates (consume on success only).
4. UI wiring on `/plan` (deferred) — surface the LLM plan with a graceful
   fallback to the deterministic itinerary.
5. Durable + windowed `UsageStore` (Supabase/Redis) and account-bound quota for
   non-bypassable limits (see hosted-enablement runbook).
