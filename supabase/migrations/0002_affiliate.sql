-- Migration 0002: affiliate & monetization model (scaffold)
-- Backs src/lib/affiliate. See docs/architecture/affiliate-routing-architecture.md
-- and docs/decisions/ADR-005-affiliate-monetization-architecture.md.
--
-- Scaffold migration: defines the catalog the routing resolver consumes plus
-- the event tables for attribution. The resolver works over injected data
-- today; wiring it to these tables is the next step.

create table if not exists public.affiliate_providers (
  id          text primary key,
  name        text not null,
  enabled     boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.affiliate_campaigns (
  id          text primary key,
  provider_id text not null references public.affiliate_providers(id) on delete cascade,
  category    text not null,
  enabled     boolean not null default true,
  starts_at   timestamptz,
  ends_at     timestamptz,
  created_at  timestamptz not null default now()
);

create table if not exists public.affiliate_links (
  id           text primary key,
  campaign_id  text not null references public.affiliate_campaigns(id) on delete cascade,
  category     text not null,
  url_template text not null,
  enabled      boolean not null default true
);

create table if not exists public.affiliate_region_rules (
  campaign_id text not null references public.affiliate_campaigns(id) on delete cascade,
  regions     text[] not null default '{}',
  mode        text not null check (mode in ('allow','deny'))
);

create table if not exists public.affiliate_priority_rules (
  campaign_id text not null references public.affiliate_campaigns(id) on delete cascade,
  category    text not null,
  region      text,
  priority    integer not null
);

create table if not exists public.affiliate_fallback_rules (
  category    text not null,
  campaign_id text not null references public.affiliate_campaigns(id) on delete cascade
);

create table if not exists public.affiliate_click_events (
  id          text primary key,
  link_id     text not null,
  campaign_id text not null,
  region      text,
  occurred_at timestamptz not null default now()
);

create table if not exists public.affiliate_conversion_events (
  id           text primary key,
  click_id     text,
  campaign_id  text not null,
  amount_minor bigint,
  currency     text,
  occurred_at  timestamptz not null default now()
);

-- RLS: catalog tables are public-readable (links are resolved client-paths);
-- event tables are NOT publicly readable (write-only ingestion via privileged
-- server paths). Deny-by-default; only the SELECT policies below are granted.
alter table public.affiliate_providers       enable row level security;
alter table public.affiliate_campaigns        enable row level security;
alter table public.affiliate_links            enable row level security;
alter table public.affiliate_region_rules     enable row level security;
alter table public.affiliate_priority_rules   enable row level security;
alter table public.affiliate_fallback_rules   enable row level security;
alter table public.affiliate_click_events      enable row level security;
alter table public.affiliate_conversion_events enable row level security;

drop policy if exists affiliate_providers_read on public.affiliate_providers;
create policy affiliate_providers_read on public.affiliate_providers for select using (true);
drop policy if exists affiliate_campaigns_read on public.affiliate_campaigns;
create policy affiliate_campaigns_read on public.affiliate_campaigns for select using (true);
drop policy if exists affiliate_links_read on public.affiliate_links;
create policy affiliate_links_read on public.affiliate_links for select using (true);
drop policy if exists affiliate_region_rules_read on public.affiliate_region_rules;
create policy affiliate_region_rules_read on public.affiliate_region_rules for select using (true);
drop policy if exists affiliate_priority_rules_read on public.affiliate_priority_rules;
create policy affiliate_priority_rules_read on public.affiliate_priority_rules for select using (true);
drop policy if exists affiliate_fallback_rules_read on public.affiliate_fallback_rules;
create policy affiliate_fallback_rules_read on public.affiliate_fallback_rules for select using (true);
-- No SELECT policy on event tables: not publicly readable by design.
