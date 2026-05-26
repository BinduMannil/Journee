# ADR-002: Supabase + PostgreSQL + RLS as the data platform

- **Status:** Accepted (direction); **not yet implemented**
- **Date:** 2026-05-26
- **Deciders:** Founding engineering

## Context

The platform will need relational data (destinations, content, users, affiliate
config, intelligence outputs), authentication, and row-level access control.

## Problem

Choose a data platform that provides Postgres, auth, and authorization without
standing up bespoke infrastructure early, while keeping the door open to move
off it later.

## Decision

Adopt **Supabase** (managed **PostgreSQL** + auth + **Row Level Security**) as
the data platform. Access will be mediated through a provider adapter
(ADR-003), so application code depends on capability contracts, not the Supabase
SDK directly.

> This decision is recorded now to guide structure. No database code exists yet;
> `.env.example` reserves the relevant variables.

## Alternatives considered

- **Raw Postgres + custom auth.** Maximum control, much higher build/ops cost.
- **Firebase.** Great DX but document model and weaker relational/SQL fit.
- **PlanetScale / Neon + separate auth.** Viable; more moving parts than the
  Supabase bundle for an early-stage team.

## Tradeoffs

- (+) Postgres + RLS + auth in one platform; fast to start; standard SQL.
- (−) Vendor coupling risk — mitigated by the adapter boundary.
- (−) RLS policies require discipline and review.

## Security implications

RLS is the primary authorization control and must be designed per-table with
deny-by-default. The service-role key is server-only and never shipped to the
client. Anon vs. service keys are separated in `.env.example`.

## Operational implications

Managed backups and migrations via Supabase tooling. Environment separation
(local / staging / prod) is required before production data exists.

## Rollback strategy

Because access is behind a provider adapter, migrating to another Postgres host
means writing a new adapter and porting schema/migrations — callers are
unaffected. Standard SQL/Postgres maximizes portability.

## Scaling considerations

Postgres scales vertically and via read replicas/connection pooling. Heavy
intelligence workloads should be isolated (separate schemas/services) rather
than contending with transactional tables.
