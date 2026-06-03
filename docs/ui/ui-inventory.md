# Journee — UI Inventory & Build Checklist

> A living checklist of every screen, surface, and reusable component the
> product needs — **including the specific links and content that should be
> visible on each page.** We tick items off as they ship. This document tracks
> UI only; engines, providers, and APIs are tracked in
> [`docs/README.md`](../README.md) and the architecture docs.

## How to read this

Each page/surface carries a status:

- ✅ **Built** — exists and renders in the running app.
- 🟡 **Partial** — a basic version exists; listed sub-items extend it.
- 🔜 **To build** — not started.

Under each page:

- **Content** = the blocks/copy/data that should be visible.
- **Links / actions** = every link, button, or CTA on the page and where it goes.
- `[ ]` not done · `[x]` done — tick sub-items as they land.

Keep this honest: only check a box when the UI actually renders. Copy and
structural content live in config (`src/lib/config/site.ts`, `src/content/*`)
per the no-hardcoding policy — point new content there, not into components.

**Wiring reference:** for the code/data/API/components that already exist behind
each surface, see the companion [`ui-code-map.md`](./ui-code-map.md).

---

## 0. Global / shared UI (on every page)

The shell wrapping every route (`src/app/layout.tsx`, `src/components/`).

### ✅ Top navigation (`Nav.tsx`)
- **Content:** logo wordmark "Journee" (links to `/`); active route highlighted.
- **Links (current):** Discover → `/discover` · Plan → `/plan` · Saved → `/saved` · About → `/about`
- [ ] Add **Discover · Plan · Saved · Destinations · Pricing · About** as the full set
- [ ] Mobile hamburger menu (no responsive collapse today)
- [ ] Saved-count badge on the Saved link
- [ ] Account / Sign-in entry (depends on Auth, §8)

### ✅ Footer (`Footer.tsx`)
- **Content (current):** tagline line + "systems roadmap lives in /docs".
- **Links (current):** About → `/about` · Privacy → `/privacy`
- [ ] Expand to columns: **Explore** (Discover, Plan, Destinations, Saved), **Company** (About, Contact, Pricing), **Legal** (Privacy, Terms, Cookie policy)
- [ ] Social links row (placeholders until accounts exist)
- [ ] Newsletter capture (email input + submit)
- [ ] Affiliate disclosure line

### Other global
- ✅ Global loading (`app/loading.tsx`), error (`app/error.tsx`), 404 (`app/not-found.tsx`)
- ✅ Design tokens (`globals.css`)
- 🔜 **Reusable primitives** (extract repeated patterns):
  - [ ] Button (pill / primary / ghost) · [ ] Tag/chip · [ ] Card shell
  - [ ] Section heading (eyebrow + display title) · [ ] Modal · [ ] Toast
  - [ ] Skeleton loaders · [ ] Empty-state
- 🔜 Cookie / consent banner (ties to Privacy + analytics)

---

## 1. Home / Landing  — 🟡 Partial (`app/page.tsx`)

### ✅ Built content
- **Hero:** eyebrow `site.tagline` ("Cinematic travel intelligence") · headline "See the world the way it actually feels." · `site.description` · rotating `heroQuotes` · Ken Burns `site.heroImageUrl`
- **Hero links/actions:** Plan a trip → `/plan` · Discover by vibe → `/discover` · Saved → `/saved`
- **Featured section:** eyebrow "Featured" · title "Destinations chosen by mood, not by map." · `DestinationExplorer` (mood filter + search over catalog) · each card links → `/destinations/[id]`
- **Affiliate CTA:** "Plan your stay" (hotels) — renders only if a link resolves

### 🔜 Sections to add
- [ ] **How Journee works** — 3 pillars (mood-first · real-world conditions · explainable scoring), each with icon + 1-line copy
- [ ] **Discover-by-vibe teaser** — sample mood chips + link → `/discover`
- [ ] **Plan teaser** — fatigue-aware planner preview + link → `/plan`
- [ ] **Live-conditions showcase** — sample light-phase / atmosphere score widget
- [ ] **Editorial story / featured quote** block
- [ ] **Testimonials / social proof** (when available)
- [ ] **Newsletter / waitlist** block (email capture)
- [ ] **Final CTA band** — "Start planning" → `/plan`, "Browse destinations" → `/destinations`

---

## 2. Destinations

### 2a. Destination detail  — ✅ Built (`app/destinations/[id]/page.tsx`)
- **Content:** hero image · name + country · headline · description · best-time-to-go · live light-phase badge (`LightBadge`/`SunSchedule`) · explainable atmosphere score (`AtmosphericScore`) · JSON-LD
- **Links/actions:** ← Home → `/` · Save button (`SaveButton`, localStorage) · Affiliate CTA (resolves)
- 🔜 Extensions:
  - [ ] Photo gallery / media strip
  - [ ] Map (coordinates already in catalog)
  - [ ] Seasonality / best-time visual
  - [ ] Related / nearby destinations (links → other `/destinations/[id]`)
  - [ ] "Add to trip" → `/plan` (prefilled)
  - [ ] Share / social-card actions
  - [ ] Weather panel (weather engine) · Safety & visa summary (safety/visa engines)

### 2b. Destinations index / browse  — 🔜 To build
- **Content:** page title + intro · full catalog grid · filter rail (mood, region, season) · sort + pagination/infinite scroll
- **Links/actions:** each card → `/destinations/[id]` · ← Home → `/` · optional map-browse toggle
- [ ] Build `/destinations` listing page
- [ ] Add to Nav + Footer + home CTAs

---

## 3. Discover (vibe)  — 🟡 Partial (`app/discover/page.tsx`, `DiscoverClient`)
- **Content:** ← Home link · title "Discover by vibe" · intro (pick mood to chase / avoid; Pathfinder explains why) · ranked results with explanations
- **Links/actions:** ← Home → `/` · each result → `/destinations/[id]` · Save per result
- 🔜 Extensions:
  - [ ] Multi-select mood chips + "avoid" chips
  - [ ] Expandable "why this ranked" per result
  - [ ] Save / compare results
  - [ ] Polished empty / no-match state

---

## 4. Plan (trip planner)  — 🟡 Partial (`app/plan/page.tsx`, `TripBuilder`, `TravelReadiness`)
- **Content:** ← Home link · title "Plan a trip" · intro (pick destinations + pace; fatigue-aware day packing) · destination picker · pace control · day-by-day itinerary · travel-readiness panel
- **Links/actions:** ← Home → `/` · add/remove destinations · adjust pace
- 🔜 Extensions:
  - [ ] Multi-destination / multi-day composition
  - [ ] Drag-to-reorder days/activities
  - [ ] Export itinerary (logic in `intelligence/itinerary-export.ts`)
  - [ ] Save / name / revisit trips
  - [ ] Shareable itinerary view
  - [ ] Budget summary (uses `content/pricing.ts`)

---

## 5. Saved  — ✅ Built (`app/saved/page.tsx`, `SavedList`, `useSaved`)
- **Content:** title + intro · saved destinations list (localStorage) · empty state
- **Links/actions:** each item → `/destinations/[id]` · remove/unsave · ← Home → `/`
- 🔜 Extensions:
  - [ ] Collections / folders
  - [ ] Richer empty state with discovery prompts (link → `/discover`)
  - [ ] Sync to account (Auth, §8)

---

## 6. Static / legal

### ✅ About (`app/about/page.tsx`)
- **Content:** ← Home link · title "How Journee thinks" · 2 intro paragraphs · system-status list (`platformSystems`) with Live/Scaffold/Roadmap badges
- 🔜 [ ] Add team / mission / contact CTA

### ✅ Privacy (`app/privacy/page.tsx`)
- **Content:** privacy policy copy
- 🔜 [ ] Keep in sync with analytics/cookie banner + auth data handling

### 🔜 To build
- [ ] **Terms of service** (`/terms`)
- [ ] **Contact / support** (`/contact`) — form or email, response expectations
- [ ] **FAQ / Help** (`/help`)
- [ ] **Pricing** (`/pricing`) — content scaffolded in `content/pricing.ts`:
  - **Content:** free quota line (`FREE_AI_PLANS` = 3 AI plans) · credit packages — **Starter** 10 credits / $5 · **Explorer** 30 / $12 · **Voyager** 100 / $35 (prices are placeholders) · what credits buy (AI trip planning) · FAQ
  - **Links/actions:** Buy / Get started per package → checkout (depends on billing) · link → `/plan`

---

## 7. Monetization surfaces
- ✅ **Affiliate CTA** (`AffiliateCta`) — config-driven, renders only on resolve. Categories available: flights, hotels, experiences, tours, restaurants, insurance, esim, ticketing, luxury, transportation.
- 🔜 [ ] Affiliate disclosure / "why we recommend" microcopy
- 🔜 [ ] Partner comparison module on detail pages (e.g. hotels/flights side by side)

---

## 8. Account & Auth  — 🔜 To build (roadmap: Supabase Auth + RLS)

No auth UI today; all greenfield, gated on the auth engine.

- [ ] **Sign in** (`/signin`) — email/password + OAuth buttons; links → forgot password, sign up
- [ ] **Sign up** (`/signup`) — register form; link → sign in; terms/privacy consent
- [ ] **Forgot / reset password**
- [ ] **Email verification** screen
- [ ] **Account / profile** (`/account`) — profile, saved sync, credit balance (`content/pricing.ts`)
- [ ] **Account settings** — preferences, notifications, delete account
- [ ] **Travel DNA profile** (depends on Travel DNA engine)
- [ ] Sign-out + session-expiry handling

---

## 9. Intelligence-driven surfaces  — 🔜 To build (gated on roadmap engines)

Each visualizes the explainable-intelligence layer; build when its engine/data
feed lands (roadmap in `docs/README.md`). Listed to keep direction visible.

- [ ] **Travel Confidence** score widget (aggregate engine — core exists)
- [ ] **Real-time conditions** panel (weather, crowds, events)
- [ ] **Festival & cultural events** surface
- [ ] **Political & disruption** alerts
- [ ] **Safety & risk** indicator
- [ ] **Visa & entry** requirements
- [ ] **Local culture / city-energy** module
- [ ] **AI planning** assistant (conversational; metered via credits)
- [ ] **Memory & reflection** (post-trip) surface
- [ ] **Social & creator** content surface

---

## 10. Admin / control plane  — 🔜 To build (APIs exist, no UI)

`/api/admin/status` and `/api/affiliate/analytics` exist; no admin UI.

- [ ] Admin dashboard shell (gated, secure-by-default)
- [ ] System status / readiness view (from `/api/admin/status`)
- [ ] Affiliate revenue analytics dashboard (from `/api/affiliate/analytics`)
- [ ] Feature-flag viewer (`config/flags.ts`)

---

## 11. Search & navigation aids  — 🔜 To build

Beyond the per-page mood filter/search, the product needs global navigation.

- [ ] **Global search** — command-palette / overlay (⌘K), searches destinations, moods, guides
- [ ] **Search results page** (`/search?q=`) — grouped results, filters, empty state
- [ ] **Autocomplete / suggestions** dropdown
- [ ] **Breadcrumbs** (detail/listing pages)
- [ ] **Filter & sort** components (shared, reused by Destinations index & Discover)
- [ ] **Pagination / "load more"** component
- [ ] **HTML sitemap page** (`/sitemap`, human-readable; XML already exists)

---

## 12. Onboarding & first-run  — 🔜 To build

- [ ] **Welcome / first-run** overlay or `/welcome` (what Journee is, how scoring works)
- [ ] **Preference capture** (moods you love / avoid → seeds Discover & Travel DNA)
- [ ] **Empty-first-visit states** on Saved / Plan (nudge to Discover)
- [ ] **Feature tooltips / coachmarks** for the intelligence widgets

---

## 13. Booking / checkout / billing  — 🔜 To build (gated on billing)

Credits meter AI planning (`content/pricing.ts`); affiliate links are external,
but in-app purchases need full commerce UI.

- [ ] **Checkout / purchase credits** flow (select package → pay)
- [ ] **Payment form** (provider widget, e.g. Stripe Elements)
- [ ] **Order / purchase confirmation** page
- [ ] **Receipt / invoice** view + email
- [ ] **Billing history** (in Account)
- [ ] **Payment methods** management
- [ ] **Paywall / upgrade modal** — shown when `FREE_AI_PLANS` (3) is exhausted; links → `/pricing`
- [ ] **Promo / coupon code** input

---

## 14. Notifications & transactional email  — 🔜 To build

UI surfaces and the email templates the product will send.

- [ ] **In-app notifications center / inbox** (alerts: disruption, price, trip reminders)
- [ ] **Toast / snackbar** system (save confirmed, errors, copied link)
- [ ] **Email templates** (rendered HTML): welcome · email verification · password reset · purchase receipt · trip/itinerary summary · newsletter · disruption/condition alert
- [ ] **Notification preferences** (in Account settings)

---

## 15. Editorial / content marketing  — 🔜 To build

The brand is "editorial" — this is a core surface, not an afterthought.

- [ ] **Guides / stories index** (`/guides`) — editorial articles
- [ ] **Article / guide detail** (`/guides/[slug]`) — long-form, images, linked destinations
- [ ] **Themed collections** (`/collections/[slug]`, e.g. "Best for solitude", "Shoulder-season escapes") — curated destination lists
- [ ] **Region / country pages** (`/regions/[slug]`) — destinations grouped geographically
- [ ] **Mood landing pages** (`/moods/[mood]`) — SEO pages per mood
- [ ] **Newsletter signup confirmation / archive**

---

## 16. Trips management  — 🔜 To build (distinct from the Plan builder)

The planner builds an itinerary; users also need to manage saved trips.

- [ ] **My trips** list (`/trips`) — saved/named trips
- [ ] **Trip detail / itinerary view** (read-only, shareable)
- [ ] **Print / PDF itinerary** view
- [ ] **Trip collaboration / sharing** (invite, view-only link)
- [ ] **Calendar / date-range picker** component

---

## 17. Sharing & social  — 🔜 To build

- [ ] **Share modal** (copy link, social targets) for destinations / trips / results
- [ ] **Dynamic social / OG cards** per trip & guide (destination OG already exists)
- [ ] **Referral / invite-a-friend** UI
- [ ] **Save-to-board / collection** picker

---

## 18. System states & edge cases  — 🟡 Partial

Global loading/error/404 exist; these specific states do not.

- [ ] **Out-of-credits / paywall** state (see §13)
- [ ] **Rate-limited** state (`FREE_AI_PLANS_PER_IP` = 15)
- [ ] **Offline / network-error** state
- [ ] **Maintenance** page
- [ ] **500 / unexpected error** variant (beyond generic boundary)
- [ ] **Provider-unavailable** graceful states (e.g. no destinations resolved)
- [ ] **Per-surface skeleton loaders**

---

## 19. Company / marketing pages  — 🔜 To build

- [ ] **Careers** (`/careers`)
- [ ] **Press / media kit** (`/press`)
- [ ] **Partner / affiliate program** (`/partners`) — recruit supply-side partners
- [ ] **Public status page** (uptime; ties to `/api/health`)
- [ ] **Changelog / what's new** (`/changelog`)
- [ ] **Gift cards** (optional, if commerce expands)

---

## 20. Localization & accessibility  — 🔜 To build

- [ ] **Language switcher** + i18n scaffolding (copy already centralized in config/content)
- [ ] **Currency / region switcher** (pricing & affiliate routing are region-aware)
- [ ] **Skip-to-content** link + audited focus states
- [ ] **Reduced-motion** honoring (Ken Burns / fade animations)
- [ ] **Theme**: dark is default; decide on light-mode toggle

---

## Suggested build order

1. **Shared primitives + full Nav/Footer links** (§0) — unblocks every page
2. **Home page sections** (§1) — highest-visibility surface
3. **Destinations index + detail extensions** (§2)
4. **Discover & Plan polish** (§3, §4)
5. **Legal/static + Pricing** (§6)
6. **Auth & account** (§8) — once Supabase Auth lands
7. **Intelligence surfaces** (§9) — as each engine ships
8. **Admin UI** (§10)

---

_Last updated: 2026-05-29 · Update this file in the same PR as any UI change._
