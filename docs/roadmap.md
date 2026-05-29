# Feature Roadmap & Status Register

_Last updated: 2026-05-29. The canonical "what's built / what's left" register._

This is the single place to see **every feature, its real status, what exists
today, and what it needs to advance**. It is deliberately honest about maturity
(see `docs/README.md` documentation principles): nothing here is described as
working unless it is.

## Sources of truth (this doc consolidates them)

- **`src/content/systems.ts`** — the machine-readable per-system status
  (`live | scaffold | roadmap`) rendered on `/about`. **That file is the status
  source; update it when a system's status changes**, and reflect it here.
- **`docs/architecture/intelligence-engine-architecture.md`** — engine roster +
  signal model.
- **`docs/governance/continuation-handoff.md`** — the rolling per-session
  next-steps queue and the externally-blocked queue.
- **`docs/runbooks/hosted-enablement.md`** — the config-only steps to turn on
  the "built, inert" items below.

Status legend: **✅ live** (real working logic; data may be seed/sample) ·
**🟡 scaffold** (logic + versioned weights real; needs a live data feed and/or
UI) · **🔌 built-inert** (adapter built; enabled by config only) · **⛔ blocked**
(needs external access) · **⬜ not started**.

## Platform features

### ✅ Built & working

| Feature | Status | What exists | Left to build |
| --- | --- | --- | --- |
| Destination Intelligence | ✅ | Explainable score; **real** solar light-phase/golden-hour signal | More live signals (weather/events) as feeds land |
| Pathfinder Discovery (`/discover`) | ✅ | Vibe-based ranking with reasons + avoid arm | — (tune weights as data grows) |
| Dynamic Itinerary (`/plan`) | ✅ | Fatigue-aware day pacing; `.ics` export | Wire to AI planning + live readiness (UI) |
| Affiliate & Monetization | ✅ | Data-driven routing, A/B, click/conversion ingestion, analytics | Live catalog via hosted Supabase (⛔) |
| Travel-data backend | ✅ (seed) | 7 capability contracts, source/freshness/confidence model, trust-ordered registry, TTL cache, strict resolver, readiness assemblers, **JSON-Schema export**, observability, gated admin readiness | **Live vendor adapters** (⛔ egress); UI surfacing (deferred) |
| Observability & control plane | ✅ | Structured logs, counter metrics, `/api/metrics`, `/api/health`, secure-by-default `/api/admin/{status,readiness}` | Cache stats endpoint; latency histograms (non-blocked queue) |

### 🔌 Built, inert — enabled by config only

| Feature | Enable with | Blocked by |
| --- | --- | --- |
| AI Planning (`POST /api/plan/ai`, Anthropic adapter) | `LLM_API_KEY` (+ `LLM_MODEL`) + `ai-planning` flag | ⛔ no LLM key / network egress in this env |
| Live Weather (Open-Meteo `WeatherProvider`) | `live-weather` flag + host egress | ⛔ Open-Meteo egress blocked by network allow-list |
| Hosted destinations / affiliate catalog (Supabase adapters) | env secrets + `supabase db push` + flags | ⛔ hosted Supabase access |

### 🟡 Scaffolded — engine logic real, needs a live feed and/or UI

Each has a pure, tested engine (input→signal mapping) + versioned weights; what's
left is a **live data source** (and eventually UI surfacing). See
`intelligence-engine-architecture.md` for the signal tables.

| Engine / system | Left to build (the data feed) |
| --- | --- |
| Travel Confidence (aggregate) | Nothing structural — improves as sub-engine feeds land |
| Event & Cultural | Live event/holiday calendars |
| Political & Disruption | Government advisory feeds |
| Weather & Environmental | Live weather feed (see Open-Meteo, ⛔ egress) |
| Safety & Risk | Safety/crime datasets |
| Visa & Entry | Visa/entry-rules dataset |
| Local Culture | Etiquette/culture datasets |
| Real-Time Conditions | Live airport/transit status |
| City Energy | Live density/crowd signals |
| Memory & Reflection | Capture/feedback loop |
| Travel DNA | (model live; deepen with behavioral data) |
| Social & Creator | Server persistence (saved is `localStorage` today) |

### ⬜ Not started (no code yet)

- **Auth & user sessions** — Supabase Auth + RLS (key-separation scaffold exists;
  see `authentication-architecture.md`).
- **UI surfacing of the travel-data backend** — intentionally deferred while the
  backend is completed (no `.tsx`/page work this phase).
- Each not-yet-started system gets its own architecture doc + ADR **when design
  begins** — not before.

## Near-term non-blocked backend queue

Mirrors `continuation-handoff.md` (kept in sync each session):

1. Cache stats / clear admin endpoint (`/api/admin/cache`).
2. Per-kind latency histograms (`_duration_ms_bucket{le=…}`).
3. Engine-bridge expansion (reviews → safety; advisory/events → conditions).
4. Per-destination editorial-confidence signal.
5. `resolveTravelDataMany([{kind,query},…])` heterogeneous fan-out.

## Externally blocked (resume when access is granted)

| Blocked item | Needs |
| --- | --- |
| Hosted Supabase (destinations, affiliate catalog, event ingestion) | Real project secrets |
| Live weather feed | Open-Meteo host on the egress allow-list |
| Live LLM / AI planning | An `LLM_API_KEY` + network egress |
| Live travel-data vendors | Vendor access + egress (adapters slot behind existing contracts) |
| Branch protection / org settings | Repo-admin access |

## How this stays current

Per the project conventions, **an architecture-changing PR updates the relevant
doc in the same PR**. For features specifically: when a system changes status,
update `src/content/systems.ts` (the rendered source) **and** the matching row
here, in the same PR. This doc is the human-readable register; `systems.ts` is
the machine-readable one they must agree.
