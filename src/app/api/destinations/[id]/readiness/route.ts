import { resolve } from "@/lib/providers/registry";
import "@/lib/providers/register";
import { featuredDestinations, type Destination } from "@/content/destinations";
import { assembleDestinationReadiness } from "@/lib/intelligence/destination-readiness";
import { defaultTravelDataCache } from "@/lib/providers/travel-data/cache";
import "@/lib/providers/travel-data/register";

/**
 * Public, read-only Travel Confidence for a single destination — the REAL,
 * seed-fed aggregate (advisories + local events resolved through the provider
 * registry, scored by the engines). Same shape the destination page renders.
 *
 * Public (no admin gate) because it exposes only non-sensitive, seed-labelled
 * intelligence; every source carries its `sourceType` so consumers see seed vs
 * live. Unknown destination → 404 (mirrors the detail page). A live feed slots
 * in behind the same contract with no change here.
 */
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;
  const destinations =
    (await resolve<readonly Destination[]>("destinations")) ?? featuredDestinations;
  if (!destinations.some((d) => d.id === id)) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  const readiness = await assembleDestinationReadiness({
    destinationId: id,
    cache: defaultTravelDataCache,
  });
  return Response.json({ time: new Date().toISOString(), result: readiness });
}
