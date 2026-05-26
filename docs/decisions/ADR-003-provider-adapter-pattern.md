# ADR-003: Provider-agnostic adapter pattern with a routing registry

- **Status:** Accepted (implemented for the `destinations` capability)
- **Date:** 2026-05-26
- **Deciders:** Founding engineering

## Context

Journee will integrate many external systems (data store, CMS, flights/hotels,
weather, events, affiliate networks). Coupling UI or business logic directly to
any vendor would make swaps, failover, and testing painful.

## Problem

Define how the codebase talks to external capabilities so vendors can be
swapped, prioritized, and failed over without changing callers.

## Decision

Introduce **capability contracts** (`Provider<TResult>`) plus a **registry**
that routes by priority and **falls back** on unavailability/error. Concrete
adapters implement a contract and self-register. Callers use
`resolve(capability)` and never import a vendor SDK.

Implemented today: the `destinations` capability with an always-available
local-seed fallback provider.

## Alternatives considered

- **Direct SDK calls in components/routes.** Simplest now, but creates pervasive
  coupling and blocks failover/testing.
- **Dependency injection framework.** More machinery than needed; the registry
  is a few small functions.
- **Per-call adapter passed by caller.** Pushes routing/fallback policy to every
  call site instead of centralizing it.

## Tradeoffs

- (+) Vendors are swappable; failover policy is centralized; trivially testable
  with fake providers.
- (+) New capabilities are additive.
- (−) A layer of indirection; slight discipline cost to keep adapters thin.

## Security implications

Adapters are the controlled choke point for credentials and outbound calls —
easier to audit than scattered SDK usage.

## Operational implications

Timeouts, retries, circuit-breaking, caching, and structured
logging/metrics have one home (the registry), so observability is added once.

## Rollback strategy

The pattern is low-cost and isolated; if it proved unnecessary it could be
inlined per capability. We expect the opposite as integrations grow.

## Scaling considerations

Centralized routing makes it cheap to add caching and rate-limit handling as
traffic grows, and to shard providers per region (e.g. geo-aware affiliate
routing) under the same contract.
