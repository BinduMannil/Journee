-- Migration 0004: destination coordinates + editorial detail
-- Brings the DB schema to parity with the in-repo Destination type
-- (src/content/destinations.ts). Without these, DB-backed destinations would
-- lose the coordinate-driven signals (light phase, sun/moon schedule,
-- atmosphere score, trip distance) and the editorial copy on detail pages.
--
-- Forward-only and idempotent (add column if not exists), so it is safe whether
-- or not 0001 has already been applied somewhere.

alter table public.destinations
  add column if not exists latitude    double precision,
  add column if not exists longitude   double precision,
  add column if not exists description text,
  add column if not exists best_time   text;
