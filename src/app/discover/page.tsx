import Link from "next/link";
import type { Metadata } from "next";
import { resolve } from "@/lib/providers/registry";
import "@/lib/providers/register";
import { featuredDestinations, type Destination } from "@/content/destinations";
import { DiscoverClient } from "@/components/DiscoverClient";
import { InSeasonNow } from "@/components/InSeasonNow";

export const metadata: Metadata = {
  title: "Discover",
  description: "Find destinations by the vibe you're chasing.",
  alternates: { canonical: "/discover" },
};

export default async function DiscoverPage() {
  const destinations =
    (await resolve<readonly Destination[]>("destinations")) ?? featuredDestinations;

  return (
    <main className="mx-auto max-w-3xl px-6 py-20 sm:px-12">
      <Link
        href="/"
        className="mb-8 inline-block text-sm uppercase tracking-[0.25em] text-gold-bright hover:text-gold"
      >
        &larr; Home
      </Link>
      <h1 className="mb-3 font-display text-4xl font-semibold text-sand sm:text-5xl">
        Discover by vibe
      </h1>
      <p className="mb-12 max-w-2xl text-sand/70">
        Pick the mood you&rsquo;re chasing and any you&rsquo;d rather avoid.
        Pathfinder ranks destinations toward the vibe, away from the rest, and
        tells you why.
      </p>
      <InSeasonNow
        destinations={destinations.map((d) => ({
          id: d.id,
          name: d.name,
          country: d.country,
          bestMonths: d.bestMonths,
        }))}
      />
      <DiscoverClient destinations={destinations} />
    </main>
  );
}
