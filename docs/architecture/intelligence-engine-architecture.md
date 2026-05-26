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

Additional engines — Travel DNA, Pathfinder discovery, dynamic itinerary,
safety/risk, weather/environmental (AQI, comfort index), visa/entry, local
culture, city energy, memory/reflection, travel confidence — will be built on
this same core. Each gets its own architecture section/doc and ADR **when its
data integration and persistence are designed**, not before. A `confidence`
aggregate across engines is the natural basis for the Travel Confidence Engine.
