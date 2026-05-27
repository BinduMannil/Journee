# Journee Documentation

This is the entry point for engineering documentation. It is deliberately
**honest about maturity**: where a system is not yet built, the docs say
"roadmap" rather than describing it as if it exists.

## Map

- **architecture/** — how the system is structured.
  - [`system-architecture.md`](architecture/system-architecture.md) — the overview; read this first.
  - [`provider-architecture.md`](architecture/provider-architecture.md) — the provider-agnostic adapter pattern.
  - [`configuration-architecture.md`](architecture/configuration-architecture.md) — config-driven / no-hardcoding approach.
  - [`affiliate-routing-architecture.md`](architecture/affiliate-routing-architecture.md) — data-driven monetization & link routing.
  - [`intelligence-engine-architecture.md`](architecture/intelligence-engine-architecture.md) — shared explainable scoring + engine scaffolds.
  - [`monitoring-observability-architecture.md`](architecture/monitoring-observability-architecture.md) — logging, metrics, health.
  - [`service-dependency-map.md`](architecture/service-dependency-map.md) — real dependency register.
  - [`failure-and-recovery.md`](architecture/failure-and-recovery.md) — failure domains, propagation, recovery (diagrams).
  - [`control-plane-architecture.md`](architecture/control-plane-architecture.md) — admin status endpoint, secure-by-default.
  - [`data-flow-architecture.md`](architecture/data-flow-architecture.md) — read/write/analytics flows + trust boundaries.
  - [`authentication-architecture.md`](architecture/authentication-architecture.md) — key separation now; Supabase Auth + RLS roadmap.
  - [`deployment-and-environment-architecture.md`](architecture/deployment-and-environment-architecture.md) — build, env separation, rollback.
- **runbooks/** — operational procedures.
  - [`hosted-enablement.md`](runbooks/hosted-enablement.md) — config-only turn-on for hosted Supabase + LLM + weather.
  - [`supabase-local-setup.md`](runbooks/supabase-local-setup.md) · [`incident-response.md`](runbooks/incident-response.md) · [`recovery.md`](runbooks/recovery.md)
- **decisions/** — Architecture Decision Records (ADRs). One file per significant choice.
- **governance/** — how we develop: branching, PRs, change management.
- **security/** — security posture and the path toward SOC 2 readiness.

## Documentation principles

1. **Describe what exists.** Roadmap items are labeled as roadmap.
2. **Explain the *why*,** not just the *what* — that's what ADRs are for.
3. **Co-evolve with code.** A change that alters architecture updates the
   relevant doc in the same PR.
4. **No fiction.** We do not document failure modes, recovery runbooks, or
   monitoring for components that have no implementation. Those documents are
   created when the component is.

## Roadmap (not yet implemented)

The product vision includes a set of intelligence engines. These are **future
work**; tracking them here keeps the direction visible without pretending they
are built:

**Scaffolded (logic/contracts in place; live data feeds still roadmap):**
Affiliate & monetization (model + resolver) · Destination intelligence ·
Festival & cultural (events engine) · Political & disruption · shared explainable
scoring core.

**Not yet started:** Real-time conditions · AI planning · Pathfinder discovery ·
Travel DNA · Dynamic itinerary · Weather & environmental · Safety & risk ·
Social & creator · Memory & reflection · Travel confidence · Visa & entry ·
Local culture · City energy.

Each not-yet-started system gets its own architecture doc and ADRs **when design
and implementation begin** — not before.
