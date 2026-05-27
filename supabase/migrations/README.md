# Migrations

Conventions for `supabase/migrations/*.sql`.

## Rules

- **Numbered, forward-only.** Files are `NNNN_description.sql`, applied in order.
  Don't edit a migration that has run anywhere shared — add a new one.
- **Idempotent where practical.** Use `create table if not exists`,
  `create index if not exists`, `drop policy if exists` before `create policy`.
- **RLS is deny-by-default.** Every table gets `enable row level security`;
  grant only the minimal `select`/`insert` policies needed. Event tables are not
  publicly readable (write-only via the service role).
- **No data/secrets.** Seed data lives in `supabase/seed.sql`, not migrations.

## Applying locally

```bash
supabase start
supabase db reset   # runs every migration in order, then seed.sql
```

`db reset` is destructive to **local** data only. See
`docs/runbooks/supabase-local-setup.md`.

## Current migrations

| File | Purpose |
| --- | --- |
| `0001_destinations.sql` | Destinations catalog + public-read RLS. |
| `0002_affiliate.sql` | Affiliate catalog + event tables + deny-by-default RLS. |
| `0003_event_indexes.sql` | Indexes for analytics aggregation/time-windowing. |
| `0004_destination_details.sql` | Adds coordinates + description + best_time to destinations (parity with the app's `Destination` type / coordinate-driven signals). |

## Hosted environments (externally blocked for the agent)

Applying migrations to a hosted Supabase project requires real project
credentials — out of scope here. The deployment runbook will cover
`supabase db push` / CI migration steps once a project exists.
