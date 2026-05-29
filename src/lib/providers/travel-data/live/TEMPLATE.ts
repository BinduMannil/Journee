/**
 * TEMPLATE for a LIVE travel-data provider — copy this file to implement a real
 * vendor.  Do **not** import or register this file. It is documentation in code
 * form, kept compilable so the pattern stays correct as the contracts evolve.
 *
 * Steps when copying:
 *   1. Move to e.g. `live/opentripmap-places.ts` (or your vendor name).
 *   2. Replace `LIVE_TEMPLATE_*` with your vendor's id/name.
 *   3. Add env config to `src/lib/config/env.ts` (zod schema + a typed getter
 *      e.g. `getOpentripmapConfig(): { apiKey: string } | null`).
 *   4. Add a feature flag to `KNOWN_FLAGS` in `src/lib/config/flags.ts` (e.g.
 *      `"live-places-opentripmap"`).
 *   5. Implement `fetch` to call the vendor (`fetch(...)` with AbortController
 *      + timeout). NEVER throw; wrap network failures into `errorResponse`.
 *   6. Carry honest `confidence` (e.g. 0.9 if the vendor is authoritative) and
 *      set `expiresAt` from the vendor's freshness guarantee — the TTL cache
 *      will respect it automatically.
 *   7. Register in `src/lib/providers/travel-data/register.ts` AFTER seed (the
 *      trust-ordered registry will prefer `live` automatically).
 *   8. Observability is automatic: `travel_data_resolve_*`, `_cache_*`,
 *      `_duration_ms_total` start emitting for your `providerId`.
 *   9. Add tests under `test/travel-data.<vendor>.test.ts` covering: ok shape,
 *      isAvailable() gating on env + flag, network failure → errorResponse,
 *      timeout → errorResponse, and the per-call cache key stability.
 */
import {
  errorResponse,
  okResponse,
  type Place,
  type PlacesProvider,
  type PlacesQuery,
  type TravelDataResponse,
} from "../contracts";
import { makeSourceMetadata } from "../source";
// import { isFeatureEnabled } from "@/lib/config/flags";  // uncomment when wiring
// import { getEnv } from "@/lib/config/env";              // uncomment when wiring

const LIVE_TEMPLATE_PROVIDER_ID = "live-template-places";
const LIVE_TEMPLATE_NAME = "Live Places (TEMPLATE — do not register)";

/** Vendor's stated freshness window in ms; tune per vendor SLA. */
const LIVE_TTL_MS = 60 * 60 * 1000;
/** Confidence we assign the vendor's data — honest, not aspirational. */
const LIVE_CONFIDENCE = 0.9;

/** Honest attribution URL for the vendor, when available. */
const LIVE_ATTRIBUTION_URL: string | undefined = undefined;

function isConfigured(): boolean {
  // Replace with a real check once env config is wired, e.g.:
  // return Boolean(getEnv().LIVE_PLACES_API_KEY);
  return false;
}

function isFlagOn(): boolean {
  // Replace with a real flag once added to KNOWN_FLAGS, e.g.:
  // return isFeatureEnabled("live-places-opentripmap");
  return false;
}

export const liveTemplatePlacesProvider: PlacesProvider = {
  id: LIVE_TEMPLATE_PROVIDER_ID,
  name: LIVE_TEMPLATE_NAME,
  kind: "places",
  sourceType: "live",
  // Both checks must pass: secret AND flag. Either off → seed handles the call.
  isAvailable: () => isConfigured() && isFlagOn(),
  async fetch(query: PlacesQuery): Promise<TravelDataResponse<readonly Place[]>> {
    void query; // unused in the template; real impl reads query.destinationId
    const fetchedAt = new Date();
    const source = makeSourceMetadata({
      sourceName: LIVE_TEMPLATE_NAME,
      sourceType: "live",
      providerId: LIVE_TEMPLATE_PROVIDER_ID,
      confidence: LIVE_CONFIDENCE,
      fetchedAt,
      ttlMs: LIVE_TTL_MS,
      ...(LIVE_ATTRIBUTION_URL ? { attributionUrl: LIVE_ATTRIBUTION_URL } : {}),
    });

    // ── Replace this block with the real vendor call ─────────────────────
    // try {
    //   const ctrl = new AbortController();
    //   const timeout = setTimeout(() => ctrl.abort(), 5_000);
    //   const res = await fetch(`https://api.example.com/places?...`, {
    //     headers: { authorization: `Bearer ${apiKey}` },
    //     signal: ctrl.signal,
    //   });
    //   clearTimeout(timeout);
    //   if (!res.ok) {
    //     return errorResponse(
    //       LIVE_TEMPLATE_PROVIDER_ID, "places",
    //       `vendor responded ${res.status}`, source,
    //     );
    //   }
    //   const data: readonly Place[] = await res.json();
    //   return okResponse(LIVE_TEMPLATE_PROVIDER_ID, "places", data, source);
    // } catch (err) {
    //   return errorResponse(
    //     LIVE_TEMPLATE_PROVIDER_ID, "places",
    //     err instanceof Error ? err.message : String(err),
    //     source,
    //   );
    // }
    // ─────────────────────────────────────────────────────────────────────

    // Template returns errorResponse so it never produces fake "live" data
    // even if someone accidentally imports it.
    void okResponse; // referenced so the import isn't reported unused
    return errorResponse(
      LIVE_TEMPLATE_PROVIDER_ID,
      "places",
      "TEMPLATE file — not a real provider; copy to live/<vendor>.ts and implement",
      source,
    );
  },
};
