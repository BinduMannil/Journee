# Runbook: Local Supabase + provider failover verification

_Audience: an engineer wiring the DB-backed providers locally. No production
secrets required — the Supabase CLI generates local dev keys._

## Prerequisites

- Docker running.
- Supabase CLI installed (`brew install supabase/tap/supabase` or see
  https://supabase.com/docs/guides/cli).

## 1. Start the local stack + apply migrations & seed

```bash
supabase start          # boots Postgres/API/Studio locally
supabase db reset        # applies supabase/migrations/* then supabase/seed.sql
```

`supabase start` prints local credentials, including:

- `API URL`  → use as `NEXT_PUBLIC_SUPABASE_URL`
- `anon key` → use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role key` → `SUPABASE_SERVICE_ROLE_KEY` (server-only; keep out of client)

## 2. Configure the app (local secrets only — never commit)

Create `.env.local` from the template and paste the printed values:

```bash
cp .env.example .env.local
# then edit .env.local:
#   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
#   NEXT_PUBLIC_SUPABASE_ANON_KEY=<printed anon key>
#   JOURNEE_ENABLED_FEATURES=supabase-destinations,affiliate-catalog
```

`.env.local` is git-ignored. These are local dev keys, not production secrets.

## 3. Run and verify DB-backed providers

```bash
npm run dev   # http://localhost:3000
```

- The destinations grid now renders from Postgres via the `supabase-destinations`
  provider (priority 10), not the seed (priority 100).
- Verify it is really the DB: edit a row and refresh.
  ```bash
  supabase db query "update public.destinations set headline = 'Edited via DB' where id = 'kyoto';"
  ```
  Reload — Kyoto's headline changes. (No code change needed: that's the
  no-hardcoding/config-driven design working.)

## 4. Verify failover (the safety property)

Turn the DB-backed provider off and confirm the app still renders via seed:

- Option A — disable the flag: remove `supabase-destinations` from
  `JOURNEE_ENABLED_FEATURES` in `.env.local`, restart `npm run dev`.
- Option B — stop the backend: `supabase stop`.

Either way the page still renders the seed catalog. `isAvailable()` returns
false → the registry falls through to the always-available seed provider with no
code change. This is the behavior covered by the automated test
`test/providers.failover.test.ts`.

## 5. Affiliate catalog (optional)

With `affiliate-catalog` enabled and the stack running, the
`supabase-affiliate` provider loads the seeded sample catalog;
`resolveAffiliateLink({ category: "hotels" })` returns the sample link by
priority. Replace the seed sample with real partner data before any launch.

## Notes / failure modes

| Symptom | Cause | Fix |
| --- | --- | --- |
| Grid shows seed despite flag on | Supabase not running / wrong URL | `supabase status`; fix `.env.local`. |
| Build fails fetching fonts | Offline build-time Google Fonts | self-host fonts (roadmap; see dependency map). |
| `db reset` errors | Migration conflict | inspect `supabase/migrations/*`; reset is destructive to *local* data only. |
