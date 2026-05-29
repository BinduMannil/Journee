# UI Backlog (deferred — build after the information architecture is complete)

_Last updated: 2026-05-29._

**Policy:** UI work is intentionally deferred while the backend / information
architecture is built out (no `.tsx`/page changes this phase). This file is the
running list of the **screens & surfaces to build once the data is in place**, so
nothing is forgotten. Each surface already (or soon will) have a backend
accessor + honest `*_DATA_NOTE`; the UI just renders it.

When UI work begins: build per surface, reuse the existing design system, keep
every editorial/seed disclaimer visible, and wire each to its existing
`src/lib/intelligence/*` accessor.

## Per-destination "know this place" surfaces (data ready, seed-backed)

- **Food & drink customs** — dietary flags (pork/beef), alcohol/public-drinking, signature drink (`culinary.ts`).
- **Local gems** — curated eats & drinks with what-to-order (`local-gems.ts`).
- **Know-before-you-go** — emergency numbers, phrases, etiquette do's/don'ts (`essentials.ts`).
- **Shopping & essentials** — malls, markets, online, fuel, payment (`shopping.ts`).
- **Local chains** — cinema/coffee/pharmacy/etc. (`chains.ts`).
- **Seasonal fruits** — in-season + must-try with ratings (`fruits.ts`).
- **Airport & terminal intel** — terminals, transfers, boarding, access (`airports.ts`).
- **Airport & airline ratings** — by cabin class (`transit-ratings.ts`).
- **City vibe & friendliness** — friendliness, vibe, tourist-ease, language (`city-vibe.ts`).
- **Festivals & holidays** — significance, what-to-expect, joinability (`festivals.ts`).
- **Carbon estimate** — per-trip CO2e for the planned route (`carbon.ts`).
- **Travel readiness** — replace the gated mock preview with the real seed-fed assembler output.

## Surfaces pending backend (build the backend first, then the UI)

- **Religious orientation & places of worship** — predominant religions + where to find mosques/temples/churches/synagogues (backend pending).
- **Traveller inclusion & safety** — LGBTQ+ legal status & social climate; religious-minority (incl. Jewish), solo-women safety — factual, sourced, "verify" disclaimer (backend pending).
- **Ratings & recommendations** — user-submitted ratings via the `rating-v1` core (needs auth + persistence).
- **Community / UGC** — public notes/blogs/vlogs, follow graph + journey feed (needs auth + persistence).
- **AI trip planning** — wire `/plan` to `POST /api/plan/ai` (backend built, inert until `LLM_API_KEY`).
- **Live weather signal** — surface comfort/UV once the Open-Meteo feed is enabled.

## Cross-cutting UI

- A consistent **"editorial / seed — verify locally"** badge component for all seed-backed panels.
- Destination page **information-architecture** that composes the above panels.
- Admin dashboards for the gated `/api/admin/{status,readiness,cache}` JSON.

> Source of truth for *feature* status is `docs/roadmap.md` + `src/content/systems.ts`.
> This file tracks the *UI rendering work* those features will need.
