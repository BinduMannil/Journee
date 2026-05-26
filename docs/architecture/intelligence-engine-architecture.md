# Intelligence Engine Architecture

_Last updated: 2026-05-26._

## Status

- **Shared scoring core + signal model:** ✅ implemented (`src/lib/intelligence`).
- **Engine scaffolds (destination, events, disruption):** ✅ input→signal mapping implemented & testable.
- **Live data feeds (weather, events, advisories) + persistence + UI surfacing:** 🔜 roadmap.

No live-data or accuracy claims are made for unbuilt feeds. Engines accept
injected inputs so the logic is exercisable now.

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
| Travel Confidence (`engines/confidence.ts`) | other engines' scores | aggregate (sub-engine keys) |

**Travel Confidence** is an aggregate: `aggregateTravelConfidence(results,
weights)` combines sub-engine scores via the same core (each sub-score is a
signal), and sets overall `confidence` to the mean of the inputs' confidences —
so a confident aggregate requires confident inputs, not just their presence.

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

## Roadmap (per the product vision)

**Discovery (scaffolded):** Travel DNA (`travel-dna.ts`, mood-affinity
preference model + `rankByDNA`) and Pathfinder (`pathfinder.ts`, vibe/avoid
query ranking, exposed at `GET /api/pathfinder`) — pure, unit-tested,
explainable match reasons. A learned/behavioral model can later produce the
same `TravelDNA` shape without changing consumers.

**Dynamic itinerary (scaffolded):** `itinerary.ts` packs experiences into days
under a pacing-based intensity budget (relaxed/balanced/packed) for fatigue-aware
experience pacing — pure + unit-tested.

**Environmental (scaffolded):** `comfort.ts` maps temperature/humidity/wind/AQI
to a 0..1 comfort signal (weather-feed ready).

Remaining engines — safety/risk, visa/entry, local culture, city energy,
memory/reflection — will be built on this same core. Each gets its own architecture section/doc and ADR **when its
data integration and persistence are designed**, not before. A `confidence`
aggregate across engines is the natural basis for the Travel Confidence Engine.
