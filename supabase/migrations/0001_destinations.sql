-- Migration 0001: destinations catalog
-- Backs the Supabase destinations provider (src/lib/providers/destinations.supabase.ts).
-- See docs/decisions/ADR-002-supabase-data-platform.md.
--
-- This is a scaffold migration: apply it against a Supabase project to enable
-- the database-backed catalog. The app runs without it (falls back to seed).

create table if not exists public.destinations (
  id          text primary key,
  name        text not null,
  country     text not null,
  headline    text not null,
  mood        text not null,
  image_url   text not null,
  created_at  timestamptz not null default now()
);

-- RLS is deny-by-default. We add only a public SELECT policy; INSERT/UPDATE/DELETE
-- have no policy, so they are reachable only by the service role (which bypasses
-- RLS) via privileged server paths — never the anon client.
alter table public.destinations enable row level security;

drop policy if exists destinations_public_read on public.destinations;
create policy destinations_public_read
  on public.destinations
  for select
  using (true);
