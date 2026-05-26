# ADR-004: Config-driven content (no-hardcoding policy)

- **Status:** Accepted (pattern in place)
- **Date:** 2026-05-26
- **Deciders:** Founding engineering

## Context

The product must be editorially flexible and, over time, CMS-manageable,
feature-flaggable, and tunable. Business rules, copy, links, and thresholds
baked into components would make all of that impossible and would not be
auditable.

## Problem

Establish where content and tunable behavior live so they are configurable
without code changes and so future CMS/DB/flag systems plug in cleanly.

## Decision

User-facing copy and content come from a **configuration boundary**
(`src/lib/config`) and **typed data modules** (`src/content`). Components are
"dumb" about content and receive it via props or read from config. Remote
sources (e.g. image hosts) are allow-listed in config, not inlined. Secrets and
env-driven values are read once at the boundary and validated.

## Alternatives considered

- **Inline copy/links in JSX.** Fastest now; violates the policy and rots into
  scattered literals that can't be governed or audited.
- **Full CMS from day one.** Premature; the typed-data shape already matches a
  future provider's return type, so adopting a CMS is a drop-in later.

## Tradeoffs

- (+) Content changes don't require component edits; future CMS/DB/flags are a
  source swap, not a rewrite.
- (−) Slightly more indirection than inlining strings.

## Security implications

Centralizing config keeps secrets out of components and makes the set of
outbound/remote sources explicit and reviewable.

## Operational implications

A single place to audit "what is configurable" and to later add validation and
versioning. Scoring/thresholds (when engines exist) will be versioned config so
changes are explainable and reversible.

## Rollback strategy

The boundary is additive and low-risk. If a particular config source proves
wrong, only that source changes — consumers stay stable.

## Scaling considerations

The typed contracts let the config source scale from files → CMS → database, and
support region-aware and A/B variants without touching the presentation layer.
