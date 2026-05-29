# ADR-007: Natural-language discovery & AI concierge (deterministic-fallback pattern)

- **Status:** Accepted (deterministic layer implemented; LLM layer wired, key-gated)
- **Date:** 2026-05-29
- **Deciders:** Founding engineering

## Context

Two product surfaces want "AI": free-text discovery ("somewhere calm and sunny,
not too lively") and a trip concierge that narrates a day-by-day plan. An LLM
makes both richer, but a hosted LLM key is an external dependency that may be
absent (local dev, CI, cost controls) and must never be a hard requirement for
the core experience to work.

## Problem

Decide how AI-flavoured features behave when no LLM provider is configured,
without (a) faking AI output, (b) breaking the feature, or (c) duplicating the
deterministic engines we already have.

## Decision

**A deterministic layer is the product; the LLM is an enhancement on top.**

- **Natural-language discovery** is parsed by a pure, unit-tested function
  (`intelligence/nl-query.ts`): a mood-synonym vocabulary + negation detection
  maps free text to the existing `PathfinderQuery` (`{ vibe, avoid }`). It needs
  no key, runs client-side and server-side (`/api/pathfinder?q=`), and produces
  the exact shape an LLM would — so an LLM can later replace the parser with no
  consumer changes.
- **The AI concierge** (`components/ConciergePlan.tsx`) posts to the existing
  `/api/plan/ai`. When the route returns `503` (no provider) — or on quota
  (`402`/`429`) or any error — it falls back to a deterministic narrative built
  from the same `buildItinerary` result, and **labels the source honestly**
  ("Generated locally (no AI key configured)" vs the real `providerId · model`).

## Alternatives considered

- **Require an LLM key.** Breaks local/CI and couples core UX to a paid vendor.
- **Mock an "AI" response when no key.** Dishonest — violates the repo's
  no-fake-operational-claims rule.
- **Hide the features until a key exists.** Wastes a genuinely useful
  deterministic capability and gives nothing to develop against.

## Tradeoffs

- (+) Features work with zero configuration; the LLM upgrades quality in place.
- (+) Parser is pure and testable; the LLM path reuses the existing billing/
  entitlement guardrails already on `/api/plan/ai`.
- (+) Source labelling keeps the user honestly informed about what produced a plan.
- (−) Deterministic NL parsing is keyword-based (no true semantics) — acceptable
  as a floor, and transparent about what it recognized (`matched`).

## Consequences

The synonym table and negation list are the single tunable source for NL
understanding (like scoring weights, they are config not algorithm). Adding
catalog moods means extending `MOOD_SYNONYMS`. Enabling the LLM is purely an env
concern (`ANTHROPIC_API_KEY` + the `ai-planning` flag); no code path changes.
