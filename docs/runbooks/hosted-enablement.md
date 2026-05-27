# Hosted enablement runbook

How to switch on the externally-gated capabilities once you have credentials.
Everything below is **config-only** — no code changes are required; the seams
are already built and tested.

## 1. Hosted Supabase (DB-backed catalog + affiliate + ingestion)

**You need:** a Supabase project URL, its anon key, and its service-role key.

1. Set environment variables (e.g. in the host / `.env.local`):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
   SUPABASE_SERVICE_ROLE_KEY=<service role key>   # server-only, never exposed
   ```
2. Apply the schema (forward-only migrations in `supabase/migrations/`):
   ```
   supabase link --project-ref <ref>
   supabase db push        # applies 0001..0004 in order
   ```
   Optionally seed sample rows from `supabase/seed.sql`, or insert real data.
3. Enable the flags (comma-separated in `JOURNEE_ENABLED_FEATURES`):
   - `supabase-destinations` — DB catalog replaces the in-repo seed.
   - `affiliate-catalog` — affiliate routing reads partner data from the DB
     (the "deals" CTA renders only once a matching link resolves).
4. Rebuild/redeploy. Behaviour after connect:
   - **Destination detail pages** are generated from the DB catalog at build
     (`generateStaticParams` resolves through the provider). Rows added after a
     build appear on the next build/deploy. Unknown ids remain a true 404.
   - **Provider fallback** still holds: if Supabase is unavailable at request
     time, routing falls back to the in-repo seed (observable via the failover
     counter on `/api/metrics`).
5. Verify: `GET /api/destinations` returns DB rows; `GET /api/health` shows
   Supabase configured; affiliate `GET /api/affiliate/analytics` returns metrics
   (not 503) once events exist.

> Schema parity note: migration `0004` adds `latitude/longitude/description/
> best_time`, so DB destinations keep the coordinate-driven signals (light
> phase, sun/moon schedule, atmosphere, trip distance) and editorial copy.

## 2. LLM / AI trip planning

**You need:** an LLM API key (recommended: Anthropic / Claude).

1. Set environment variables:
   ```
   LLM_API_KEY=<key>
   LLM_MODEL=claude-sonnet-4-6   # optional; sensible Claude Sonnet default
   ```
2. Add `ai-planning` to `JOURNEE_ENABLED_FEATURES`.
3. Rebuild/redeploy. Behaviour:
   - `POST /api/plan/ai` now returns an LLM-generated day-by-day plan; when the
     key/flag are absent it returns `503` and the UI uses the deterministic
     itinerary engine. The provider is **inert until both are set**.
   - The default adapter targets the Anthropic Messages API
     (`src/lib/providers/llm/anthropic.ts`). To use a different vendor, implement
     the `PlanningProvider` contract and add it to the list in
     `src/lib/providers/llm/index.ts`.
4. Verify: `POST /api/plan/ai` with a destinations + pacing body returns a plan
   (200) instead of 503.

## 3. Live weather feed (when a weather host is allow-listed)

Implement `WeatherProvider` (`src/lib/providers/weather/types.ts`) against the
host, register it ahead of the mock in `src/lib/providers/weather/index.ts`, and
the comfort signal goes live with no other change.

## Network note

These integrations require outbound egress to the respective hosts. In a
restricted environment the host allow-list must include them (e.g. the Supabase
project domain, `api.anthropic.com`, the weather host).
