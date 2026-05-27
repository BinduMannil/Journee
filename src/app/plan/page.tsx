import Link from "next/link";
import type { Metadata } from "next";
import { resolve } from "@/lib/providers/registry";
import "@/lib/providers/register";
import {
  featuredDestinations,
  intensityForMood,
  type Destination,
} from "@/content/destinations";
import { TripBuilder } from "@/components/TripBuilder";

export const metadata: Metadata = {
  title: "Plan a trip",
  description: "Build a fatigue-aware, paced itinerary across destinations.",
};

export default async function PlanPage() {
  const destinations =
    (await resolve<readonly Destination[]>("destinations")) ?? featuredDestinations;
  const plannable = destinations.map((d) => ({
    id: d.id,
    name: d.name,
    mood: d.mood,
    intensity: intensityForMood(d.mood),
    coordinates: d.coordinates,
  }));

  return (
    <main className="mx-auto max-w-5xl px-6 py-20 sm:px-12">
      <Link
        href="/"
        className="mb-8 inline-block text-sm uppercase tracking-[0.25em] text-gold-bright hover:text-gold"
      >
        &larr; Home
      </Link>
      <h1 className="mb-3 font-display text-4xl font-semibold text-sand sm:text-5xl">
        Plan a trip
      </h1>
      <p className="mb-12 max-w-2xl text-sand/70">
        Pick destinations and a pace. We pack them into days under a fatigue-aware
        intensity budget — fewer days when relaxed, denser when packed.
      </p>
      <TripBuilder destinations={plannable} />
    </main>
  );
}
