import type { Metadata } from "next";
import { DestinationExplorer } from "@/components/DestinationExplorer";
import { AffiliateCta } from "@/components/AffiliateCta";
import { ButtonLink, SectionHeading } from "@/components/ui";
import { resolve } from "@/lib/providers/registry";
import "@/lib/providers/register";
import {
  destinationsIndexCopy,
  featuredDestinations,
  type Destination,
} from "@/content/destinations";
import { commonCopy, stayAffiliate } from "@/content/common";

export const metadata: Metadata = {
  title: destinationsIndexCopy.eyebrow,
  description: destinationsIndexCopy.description,
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
        {commonCopy.backToHome}
      </ButtonLink>

      <SectionHeading
        eyebrow={destinationsIndexCopy.eyebrow}
        title={destinationsIndexCopy.title}
        description={destinationsIndexCopy.description}
        as="h1"
        className="mb-14"
      />

      <DestinationExplorer destinations={destinations} />

      <div className="mt-12 flex justify-center">
        <AffiliateCta
          category={stayAffiliate.category}
          label={stayAffiliate.label}
        />
      </div>
    </main>
  );
}
