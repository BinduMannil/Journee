import { resolve } from "@/lib/providers/registry";
import "@/lib/providers/register";
import { featuredDestinations, type Destination } from "@/content/destinations";
import { pathfind } from "@/lib/intelligence/pathfinder";

/**
 * Pathfinder discovery over the resolved catalog. `?vibe=Electric&avoid=Luminous`
 * returns destinations ranked toward the vibe with explainable match reasons.
 */
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  const params = new URL(request.url).searchParams;
  const vibe = params.get("vibe") ?? undefined;
  const avoid = params.getAll("avoid");

  const destinations =
    (await resolve<readonly Destination[]>("destinations")) ?? featuredDestinations;
  const ranked = pathfind(
    destinations.map((d) => ({ id: d.id, mood: d.mood })),
    { vibe, avoid },
  );

  const byId = new Map(destinations.map((d) => [d.id, d]));
  return Response.json({
    query: { vibe: vibe ?? null, avoid },
    results: ranked.map((r) => ({
      id: r.id,
      name: byId.get(r.id)?.name ?? r.id,
      mood: byId.get(r.id)?.mood ?? null,
      score: r.score,
      reason: r.reason,
    })),
  });
}
