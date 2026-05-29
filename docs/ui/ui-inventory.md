# Journee — UI Inventory & Build Checklist

> A living checklist of every screen, surface, and reusable component the
> product needs. We tick items off as they ship. **This document tracks UI
> only** — engines, providers, and APIs are tracked separately in
> [`docs/README.md`](../README.md) and the architecture docs.

## How to read this

Each item carries a status:

- ✅ **Built** — exists and renders in the running app.
- 🟡 **Partial** — a basic version exists; listed sub-items extend it.
- 🔜 **To build** — not started.

Sub-items use checkboxes so we can tick them off as they land:

- `[ ]` not done · `[x]` done

Keep this honest: only check a box when the UI actually renders in the app.
When a surface depends on a roadmap engine or data feed, note the dependency
rather than faking the UI.

---

## 0. Global / shared UI (applies to every page)

The shell that wraps every route. Living mostly in `src/app/layout.tsx` and
`src/components/`.

- ✅ **Top navigation** (`Nav.tsx`) — sticky, active-route aware.
  - [ ] Mobile nav / hamburger menu (current nav is a flat row; no responsive collapse)
  - [ ] "Saved" count badge in nav
  - [ ] Account / sign-in entry point (depends on Auth, §8)
- ✅ **Footer** (`Footer.tsx`).
  - [ ] Expand footer: nav columns, social, legal links, newsletter capture
- ✅ **Global loading state** (`app/loading.tsx`)
- ✅ **Global error boundary** (`app/error.tsx`)
- ✅ **404 / not-found** (`app/not-found.tsx`)
- ✅ **Design system tokens** (`globals.css` — Playfair/Montserrat, gold/warm palette)
- 🔜 **Reusable UI primitives library** — extract repeated patterns so pages stop re-implementing them:
  - [ ] Button (pill / primary / ghost variants — currently inlined per page)
  - [ ] Tag / chip (mood pills, filters)
  - [ ] Card shell
  - [ ] Section heading (eyebrow + display title — repeated on home/about)
  - [ ] Modal / dialog
  - [ ] Toast / notification
  - [ ] Skeleton loaders (per surface)
  - [ ] Empty-state component
- 🔜 **Cookie / consent banner** (ties to privacy + analytics)

---

## 1. Home / Landing page  — 🟡 Partial (`app/page.tsx`)

The cinematic entry point. Hero + featured destinations exist; the rest of the
editorial landing is open.

- ✅ **Hero** — Ken Burns image, tagline, headline, rotating quotes, CTAs
- ✅ **Featured destinations grid** (`DestinationExplorer` + mood filter/search)
- ✅ **Affiliate CTA** (renders only when a link resolves)
- 🔜 **Sections still to build:**
  - [ ] "How Journee works" / value-proposition section (mood-first, real conditions, explainable)
  - [ ] "Discover by vibe" teaser (preview of the Pathfinder experience)
  - [ ] "Plan a fatigue-aware trip" teaser (preview of the planner)
  - [ ] Live-conditions showcase (light phase / atmosphere — a taste of the intelligence layer)
  - [ ] Editorial story / quote feature block
  - [ ] Testimonials / social proof (when available)
  - [ ] Newsletter / waitlist signup block
  - [ ] Final CTA band

---

## 2. Destinations

### 2a. Destination detail  — ✅ Built (`app/destinations/[id]/page.tsx`)

- ✅ Editorial detail (hero, description, best time)
- ✅ Live light-phase badge (`LightBadge`, `SunSchedule`)
- ✅ Explainable atmosphere score (`AtmosphericScore`)
- ✅ Save button (`SaveButton`)
- ✅ Affiliate CTA
- 🔜 Extensions:
  - [ ] Photo gallery / media strip
  - [ ] Map view (coordinates already exist in catalog)
  - [ ] "Best time to go" detail / seasonality visual
  - [ ] Related / nearby destinations
  - [ ] Weather & environmental panel (depends on weather engine)
  - [ ] Safety & entry/visa summary (depends on safety/visa engines)
  - [ ] "Add to trip" action (links into Plan)
  - [ ] Share / social card actions

### 2b. Destinations index / browse  — 🔜 To build

There is no dedicated browse-all page today (only the home featured grid + API).

- [ ] `/destinations` listing page with filters (mood, region, season)
- [ ] Sort + pagination / infinite scroll
- [ ] Map-based browse mode

---

## 3. Discover (vibe-based)  — 🟡 Partial (`app/discover/page.tsx`, `DiscoverClient`)

- ✅ Vibe-based ranking UI (Pathfinder engine, explainable)
- 🔜 Extensions:
  - [ ] Richer vibe input (multi-select moods, "avoid" tags as chips)
  - [ ] Explain-why expandable detail per result
  - [ ] Save / compare results
  - [ ] Empty + no-match states polished

---

## 4. Plan (trip planner)  — 🟡 Partial (`app/plan/page.tsx`, `TripBuilder`, `TravelReadiness`)

- ✅ Fatigue-aware day-by-day itinerary builder
- ✅ Travel readiness panel
- 🔜 Extensions:
  - [ ] Multi-destination / multi-day trip composition UI
  - [ ] Drag-to-reorder days / activities
  - [ ] Itinerary export UI (export logic exists in `intelligence/itinerary-export.ts`)
  - [ ] Save / name / revisit trips
  - [ ] Shareable itinerary view
  - [ ] Budget / pricing summary (pricing content exists in `content/pricing.ts`)

---

## 5. Saved collection  — ✅ Built (`app/saved/page.tsx`, `SavedList`, `useSaved`)

- ✅ localStorage-backed saved list (no account needed)
- 🔜 Extensions:
  - [ ] Organize into collections / folders
  - [ ] Empty-state with discovery prompts
  - [ ] Sync to account (depends on Auth, §8)

---

## 6. Static / legal pages

- ✅ **About** (`app/about/page.tsx`)
- ✅ **Privacy** (`app/privacy/page.tsx`)
- 🔜 **Terms of service**
- 🔜 **Contact / support**
- 🔜 **FAQ / Help center**
- 🔜 **Pricing page** (content scaffolded in `content/pricing.ts`; no page yet)

---

## 7. Monetization surfaces

- ✅ **Affiliate CTA** (`AffiliateCta`) — config-driven, only renders on resolve
- 🔜 Extensions:
  - [ ] Affiliate disclosure / "why we recommend" microcopy surface
  - [ ] Comparison / partner module on detail pages

---

## 8. Account & Auth  — 🔜 To build (roadmap: Supabase Auth + RLS)

No auth UI exists today. All of this is greenfield and gated on the auth engine.

- [ ] Sign in
- [ ] Sign up / register
- [ ] Forgot / reset password
- [ ] Email verification screen
- [ ] OAuth / social sign-in buttons
- [ ] Account / profile page
- [ ] Account settings (preferences, notifications)
- [ ] Travel DNA profile UI (depends on Travel DNA engine)
- [ ] Sign-out + session expiry handling

---

## 9. Intelligence-driven surfaces  — 🔜 To build (gated on roadmap engines)

These UIs visualize the explainable-intelligence layer. Build each only when
its engine/data feed lands (see roadmap in `docs/README.md`). Listed so the
direction is visible.

- [ ] **Travel Confidence** score widget (aggregate engine — core exists)
- [ ] **Real-time conditions** panel (weather, crowds, events)
- [ ] **Festival & cultural events** surface
- [ ] **Political & disruption** alerts surface
- [ ] **Safety & risk** indicator
- [ ] **Visa & entry** requirements UI
- [ ] **Local culture** / city-energy module
- [ ] **AI planning** assistant (conversational planning UI)
- [ ] **Memory & reflection** (post-trip) surface
- [ ] **Social & creator** content surface

---

## 10. Admin / control plane  — 🔜 To build (API exists, no UI)

`/api/admin/status` and `/api/affiliate/analytics` exist; no admin UI.

- [ ] Admin dashboard shell (gated, secure-by-default)
- [ ] System status / readiness view
- [ ] Affiliate revenue analytics dashboard
- [ ] Feature-flag viewer

---

## Suggested build order

A pragmatic sequence that front-loads shared foundations and visible wins:

1. **Shared UI primitives** (§0) — unblocks every page, kills duplication
2. **Home page sections** (§1) — highest-visibility surface
3. **Destinations index + detail extensions** (§2)
4. **Discover & Plan polish** (§3, §4)
5. **Legal/static pages + pricing** (§6)
6. **Auth & account** (§8) — once Supabase Auth lands
7. **Intelligence surfaces** (§9) — as each engine ships
8. **Admin UI** (§10)

---

_Last updated: 2026-05-29 · Update this file in the same PR as any UI change._
