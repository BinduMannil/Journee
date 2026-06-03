import { requireAdmin } from "@/lib/auth/admin";
import { assembleDestinationReadiness } from "@/lib/intelligence/destination-readiness";
import { assembleTripReadiness } from "@/lib/intelligence/trip-readiness";
import { defaultTravelDataCache } from "@/lib/providers/travel-data/cache";
import "@/lib/providers/travel-data/register";

/**
 * Read-only control-plane endpoint that exercises the end-to-end backend
 * pipeline (travel-data providers → bridge → assembler) for a single
 * destination, or for a trip via repeated `?stop=` params. Returns the real
 * (seed-fed) `DestinationReadiness`/`TripReadiness` shape including honest
 * per-source provenance.
 *
 * Secure-by-default — disabled (503) unless `JOURNEE_ADMIN_TOKEN` is set, then
 * requires a matching `x-admin-token` header. See
 * docs/architecture/control-plane-architecture.md.
 *
 * Query parameters:
 * - `destinationId` (required, unless `stop` repeated)
 * - `primaryPlaceId` (optional) — feeds the destination `open_now` signal.
 * - `stop` (optional, repeatable) — `"<destinationId>:<primaryPlaceId>"` or
 *   `"<destinationId>"`. When present, returns a trip aggregate across stops.
 */
export const dynamic = "force-dynamic";

interface ParsedStop {
  readonly destinationId: string;
  readonly primaryPlaceId?: string;
}

function parseStops(url: URL): ParsedStop[] {
  const stops: ParsedStop[] = [];
  for (const raw of url.searchParams.getAll("stop")) {
    const [destinationId, primaryPlaceId] = raw.split(":");
    if (destinationId) {
      stops.push({ destinationId, ...(primaryPlaceId ? { primaryPlaceId } : {}) });
    }
  }
  return stops;
}

export async function GET(request: Request): Promise<Response> {
  const denied = requireAdmin(request);
  if (denied) return denied;

  const url = new URL(request.url);
  const stops = parseStops(url);

  if (stops.length > 0) {
    const trip = await assembleTripReadiness({ stops, cache: defaultTravelDataCache });
    return Response.json({ mode: "trip", time: new Date().toISOString(), result: trip });
  }

  const destinationId = url.searchParams.get("destinationId");
  if (!destinationId) {
    return Response.json(
      { error: "bad_request", reason: "destinationId or repeated `stop` is required" },
      { status: 400 },
    );
  }
  const primaryPlaceId = url.searchParams.get("primaryPlaceId") ?? undefined;
  const readiness = await assembleDestinationReadiness({
    destinationId,
    primaryPlaceId,
    cache: defaultTravelDataCache,
  });
  return Response.json({ mode: "destination", time: new Date().toISOString(), result: readiness });
}
