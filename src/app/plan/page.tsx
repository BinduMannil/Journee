import type { Metadata } from "next";
import { resolve } from "@/lib/providers/registry";
import "@/lib/providers/register";
import {
  featuredDestinations,
  intensityForMood,
  type Destination,
} from "@/content/destinations";
import { planCopy } from "@/content/pages";
import { commonCopy } from "@/content/common";
import { TripBuilder } from "@/components/TripBuilder";
import { ButtonLink, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: planCopy.title,
  description: planCopy.description,
  alternates: { canonical: "/plan" },
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
      <ButtonLink
        href="/"
        variant="ghost"
        size="sm"
        className="mb-8 border-0 px-0 text-gold-bright hover:text-gold"
      >
        {commonCopy.backToHome}
      </ButtonLink>
      <SectionHeading
        title={planCopy.title}
        description={planCopy.description}
        as="h1"
        className="mb-12"
      />
      <TripBuilder destinations={plannable} />
    </main>
  );
}
