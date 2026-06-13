-- Migration 0005: affiliate event retention (data minimization)
-- Backs the retention/disposal control for the append-only event tables
-- defined in 0002. SOC 2 (and GDPR) expect data to be kept only as long as it
-- is needed and then disposed of by a documented mechanism, rather than kept
-- forever because nothing deletes it.
-- See docs/security/soc2-readiness-review-2026-06-10.md (Finding #12).
--
-- Retention window: raw events are kept for 24 months, then deleted. (If you
-- need longer-term reporting, aggregate to monthly campaign totals BEFORE the
-- purge — add that rollup here when the reporting need is real.)
--
-- Requires the pg_cron extension. On Supabase, enable it once in the dashboard
-- (Database -> Extensions -> pg_cron) or via the line below, then apply this
-- migration. pg_cron jobs run in the database named in your project settings
-- (usually `postgres`).

create extension if not exists pg_cron;

-- Idempotent: drop any prior schedule of this job before re-creating it, so the
-- migration is safe to re-apply.
do $$
begin
  perform cron.unschedule('purge-old-affiliate-events');
exception
  when others then null; -- no existing job to unschedule
end
$$;

-- Weekly, Sundays at 03:00 UTC: delete events older than 24 months.
select cron.schedule(
  'purge-old-affiliate-events',
  '0 3 * * 0',
  $$
    delete from public.affiliate_click_events
      where occurred_at < now() - interval '24 months';
    delete from public.affiliate_conversion_events
      where occurred_at < now() - interval '24 months';
  $$
);
