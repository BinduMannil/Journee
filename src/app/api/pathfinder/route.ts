import { resolve } from "@/lib/providers/registry";
import "@/lib/providers/register";
import { featuredDestinations, type Destination } from "@/content/destinations";
import { pathfind } from "@/lib/intelligence/pathfinder";
import { parseQuery } from "@/lib/intelligence/nl-query";

/**
 * Pathfinder discovery over the resolved catalog. `?vibe=Electric&avoid=Luminous`
 * returns destinations ranked toward the vibe with explainable match reasons.
 * A free-text `?q=` is parsed (deterministically, no LLM needed) into vibe/avoid
 * and merged with any explicit params.
 */
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  const params = new URL(request.url).searchParams;
  const q = params.get("q");
  const parsed = q ? parseQuery(q) : { vibe: undefined, avoid: [], matched: [] };
  const vibe = params.get("vibe") ?? parsed.vibe ?? undefined;
  const avoid = [...new Set([...params.getAll("avoid"), ...(parsed.avoid ?? [])])];

  const destinations =
    (await resolve<readonly Destination[]>("destinations")) ?? featuredDestinations;
  const ranked = pathfind(
    destinations.map((d) => ({ id: d.id, mood: d.mood })),
    { vibe, avoid },
  );

  const byId = new Map(destinations.map((d) => [d.id, d]));
  return Response.json({
    query: { q: q ?? null, vibe: vibe ?? null, avoid, matched: parsed.matched },
    results: ranked.map((r) => ({
      id: r.id,
      name: byId.get(r.id)?.name ?? r.id,
      mood: byId.get(r.id)?.mood ?? null,
      score: r.score,
      reason: r.reason,
    })),
  });
}
