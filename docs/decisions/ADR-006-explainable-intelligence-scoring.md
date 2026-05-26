# ADR-006: Explainable, config-weighted intelligence scoring

- **Status:** Accepted (core + engine scaffolds implemented; data feeds roadmap)
- **Date:** 2026-05-26
- **Deciders:** Founding engineering

## Context

Journee's value is contextual intelligence — destination, event, disruption,
weather, safety scoring, and more. These scores drive recommendations and user
trust, so they must be tunable, auditable, and explainable, and engines must
compose rather than each inventing its own math.

## Problem

Decide how engines produce scores so that (a) weights are not hardcoded,
(b) every score is explainable, and (c) engines share one mechanism.

## Decision

A single pure **scoring core**: each engine maps domain input to normalized
`0..1` **signals** (risk expressed as confidence so polarity is uniform), then
`score(signals, weights)` produces a `0..100` value with a full **contribution
breakdown**, a coverage-based **confidence**, and the **weights version**.
**Weights are versioned config**, not constants.

## Alternatives considered

- **Per-engine bespoke formulas.** Inconsistent, hard to audit, duplicated.
- **Hardcoded weights/thresholds.** Violates no-hardcoding; not tunable or
  auditable; can't A/B or regionalize.
- **Opaque ML model now.** Premature without data; not explainable enough for
  user-facing trust at this stage. The signal interface leaves room to add
  model-derived signals later.

## Tradeoffs

- (+) One tested core; uniform, explainable, tunable, versioned scores.
- (+) Engines stay thin (just input→signal mapping).
- (−) Linear weighting is simple; complex interactions need richer signals or a
  future model (the interface accommodates this).

## Security implications

Scores are derived from injected inputs; no secrets involved. Versioned weights
give an audit trail for why a recommendation changed.

## Operational implications

Re-tuning is a config/version change, not a deploy. Low confidence is surfaced
rather than hidden, preventing partial data from masquerading as authoritative.

## Rollback strategy

Weights are versioned — revert to a prior version to restore prior behavior.
The core is isolated; engines depend only on its contracts.

## Scaling considerations

Pure and cheap; trivially cacheable. New engines and model-derived signals plug
into the same interface. Cross-engine confidence aggregation underpins the
future Travel Confidence Engine.
