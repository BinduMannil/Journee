-- Migration 0003: indexes for affiliate analytics
-- Supports per-campaign aggregation and time-windowed queries
-- (GET /api/affiliate/analytics ?since=&until=). Event tables are append-only
-- and grow unbounded, so these indexes matter as volume increases.

create index if not exists idx_click_events_campaign
  on public.affiliate_click_events (campaign_id);
create index if not exists idx_click_events_occurred
  on public.affiliate_click_events (occurred_at);

create index if not exists idx_conversion_events_campaign
  on public.affiliate_conversion_events (campaign_id);
create index if not exists idx_conversion_events_occurred
  on public.affiliate_conversion_events (occurred_at);
