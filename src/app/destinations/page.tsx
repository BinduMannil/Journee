import type { Metadata } from "next";
import { DestinationExplorer } from "@/components/DestinationExplorer";
import { AffiliateCta } from "@/components/AffiliateCta";
import { ButtonLink, SectionHeading } from "@/components/ui";
import { resolve } from "@/lib/providers/registry";
import "@/lib/providers/register";
import { featuredDestinations, type Destination } from "@/content/destinations";

export const metadata: Metadata = {
  title: "Destinations",
  description:
    "Browse the full Journee catalog — filter by mood, search by name, " +
    "country, or atmosphere.",
  alternates: { canonical: "/destinations" },
};

export default async function DestinationsPage() {
  // Same registry resolution the home page uses; seed fallback when no provider
  // is configured.
  const destinations =
    (await resolve<readonly Destination[]>("destinations")) ?? featuredDestinations;

  return (
    <main className="mx-auto max-w-6xl px-6 py-20 sm:px-12">
      <ButtonLink
        href="/"
        variant="ghost"
        size="sm"
        className="mb-8 border-0 px-0 text-gold-bright hover:text-gold"
      >
        &larr; Home
      </ButtonLink>

      <SectionHeading
        eyebrow="Destinations"
        title="Every place, by the mood it keeps."
        description="Filter by the atmosphere you're after, or search across names, countries, and moods. The catalog grows; the filters grow with it."
        as="h1"
        className="mb-14"
      />

      <DestinationExplorer destinations={destinations} />

      <div className="mt-12 flex justify-center">
        <AffiliateCta category="hotels" label="Plan your stay" />
      </div>
    </main>
  );
}
