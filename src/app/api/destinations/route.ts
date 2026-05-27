import { resolve } from "@/lib/providers/registry";
import "@/lib/providers/register";
import { featuredDestinations, type Destination } from "@/content/destinations";

/**
 * Public destinations feed, resolved through the provider registry (DB-backed
 * when configured, seed otherwise). Demonstrates the same resolution the UI
 * uses, over HTTP.
 */
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const destinations =
    (await resolve<readonly Destination[]>("destinations")) ?? featuredDestinations;
  return Response.json({ destinations });
}
