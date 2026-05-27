# Intelligence Engine Architecture

_Last updated: 2026-05-27._

## Status

- **Shared scoring core + signal model:** ✅ implemented (`src/lib/intelligence`).
- **Engine scaffolds (destination, events, disruption):** ✅ input→signal mapping implemented & testable.
- **Travel-data provider contracts (places, hours, prices, links, reviews, events, advisories):** ✅ contracts + source/freshness/confidence model + SEED adapters implemented & tested (`src/lib/providers/travel-data`).
- **Live data feeds (weather, events, advisories) + persistence + UI surfacing:** 🔜 roadmap.

No live-data or accuracy claims are made for unbuilt feeds. Engines accept
injected inputs so the logic is exercisable now. The travel-data layer is
**contract-ready only**: just SEED adapters are wired, every response is labeled
with its source type (`seed`), and no live vendor is integrated.

## The pattern

Every engine follows the same shape so they compose and stay explainable:

```
domain input ──(engine.toSignals)──▶ normalized signals (0..1)
                                          │
            versioned weights (config) ──▶ score(signals, weights)
                                          │
                                          ▼
                       IntelligenceScore { score 0..100,
                                           confidence 0..1,
                                           contributions[], weightsVersion }
```

- **Signals** are normalized to `0..1` where `1` is most favorable. Risk-style
  inputs are expressed as *confidence* (1 = safe) so all engines share one
  polarity.
- **Weights are versioned config** (`weights.ts`), never algorithm constants —
  tunable, auditable, and explainable. Every score carries its `weightsVersion`.
- **Scoring is pure** (`scoring.ts`): deterministic, no I/O, returns the full
  contribution breakdown plus a coverage-based confidence.

## Implemented engines (scaffolds)

| Engine | Input | Signals |
| --- | --- | --- |
| Destination (`engines/destination.ts`) | `DestinationContext` | open_now, crowd, season, weather, golden_hour |
| Events/Cultural (`engines/events.ts`) | `EventContext` | festival_intensity, cultural_significance, operational_accessibility, crowd_comfort |
| Political/Weather/Disruption (`engines/disruption.ts`) | `DisruptionContext` | advisory, civil_stability, transport, hazard, weather_severity |
| Safety & Risk (`engines/safety.ts`) | `SafetyContext` | scam, crowd, emergency, health |
| Visa & Entry (`engines/visa.ts`) | `VisaContext` | entry_ease, processing, documents, policy_stability |
| Local Culture (`engines/culture.ts`) | `CultureContext` | etiquette, dress, language, photography |
| Real-Time Conditions (`engines/conditions.ts`) | `ConditionsContext` | airport, transit, access, surge |
| City Energy (`engines/city-energy.ts`) | `CityEnergyContext` | calmness, festivity, nightlife, local_density |
| Memory & Reflection (`engines/memory.ts`) | `MemoryContext` | emotional_peak, novelty, connection, sensory |
| Travel Confidence (`engines/confidence.ts`) | other engines' scores | aggregate (sub-engine keys) |

Plus environmental comfort (`comfort.ts`) and discovery (`travel-dna.ts`,
`pathfinder.ts`, `itinerary.ts`). All share the explainable scoring core +
versioned weights; live data feeds remain roadmap (mock providers stand in).

**Travel Confidence** is an aggregate: `aggregateTravelConfidence(results,
weights)` combines sub-engine scores via the same core (each sub-score is a
signal), and sets overall `confidence` to the mean of the inputs' confidences —
so a confident aggregate requires confident inputs, not just their presence.
The current weighting (`travel-confidence-v2`) spans five sub-engines —
disruption and safety weighted most heavily (both gate whether travel is
advisable), then destination and real-time conditions, then events. The gated
`TravelReadiness` preview surfaces this aggregate; its light signal is real
(solar), while events/disruption/safety/conditions use clearly-labeled sample
contexts (`mock.ts`) until live feeds are wired.

Each maps its domain input to signals. The data that *populates* those inputs
(live weather APIs, event/holiday calendars, government advisories) is roadmap.

**First real signal (no network):** `src/lib/intelligence/solar.ts` computes the
sun's altitude for a destination's coordinates at the current instant (standard
solar approximation) and derives the live **light phase** (golden / daylight /
night) and a `goldenHourProximity` value for the destination engine. Surfaced on
cards via `LightBadge` (client-computed, updates over time). This is genuine,
deterministic data — unit-tested in `test/intelligence.solar.test.ts` — proving
the engine can run on real inputs, not just injected fixtures.

## Explainability (why a score is what it is)

`score()` returns `contributions[]` — for each signal: its value, the weight
applied, and the weighted result — plus `weightsVersion`. Any score can be
fully reconstructed and audited. This is a hard requirement of the
no-hardcoding/auditability policy, not an add-on.

## Confidence

`confidence` = (expected signal keys present) / (expected keys). A score built
from partial data is still returned, but flagged as lower confidence rather than
silently treated as authoritative.

## Travel-data sources (the inputs that populate engine signals)

The engines above map **inputs** to signals; the **travel-data provider layer**
(`src/lib/providers/travel-data`, see provider-architecture.md) is the seam that
will eventually produce those inputs from the real world — places, opening
hours, ticket prices/links, reviews, local events and safety advisories.

Two design points keep this honest and composable:

- **Shared confidence/freshness vocabulary.** Travel-data sources carry
  `SourceMetadata` with a normalized `confidence` (0..1) and a freshness state
  (`computeFreshness`/`classifySourceQuality`). This is the same 0..1 confidence
  the scoring core already speaks, so a source's confidence/quality can later
  flow straight into an engine's per-signal confidence — a stale or seed source
  yields a lower-confidence signal rather than being silently treated as
  authoritative.
- **Contract-ready only, today.** Only SEED adapters exist; no live vendor is
  wired. Engines are *not* yet fed from this layer — wiring source → signal is
  intentionally deferred until a live source is implemented behind the contract,
  so no fake operational claims are introduced.

## Roadmap (per the product vision)

**Discovery (scaffolded):** Travel DNA (`travel-dna.ts`, mood-affinity
preference model + `rankByDNA`) and Pathfinder (`pathfinder.ts`, vibe/avoid
query ranking, exposed at `GET /api/pathfinder`) — pure, unit-tested,
explainable match reasons. A learned/behavioral model can later produce the
same `TravelDNA` shape without changing consumers.

**Dynamic itinerary (scaffolded):** `itinerary.ts` packs experiences into days
under a pacing-based intensity budget (relaxed/balanced/packed) for fatigue-aware
experience pacing — pure + unit-tested. The result reports its per-day `budget`
so consumers (e.g. the `/plan` load meter) can show how full each day is without
duplicating the config.

**Environmental (scaffolded):** `comfort.ts` maps temperature/humidity/wind/AQI
to a 0..1 comfort signal (weather-feed ready).

Remaining engines — safety/risk, visa/entry, local culture, city energy,
memory/reflection — will be built on this same core. Each gets its own architecture section/doc and ADR **when its
data integration and persistence are designed**, not before. A `confidence`
aggregate across engines is the natural basis for the Travel Confidence Engine.
