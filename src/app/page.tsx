import Image from "next/image";
import type { Metadata } from "next";
import { QuoteRotator } from "@/components/QuoteRotator";
import { DestinationExplorer } from "@/components/DestinationExplorer";
import { AffiliateCta } from "@/components/AffiliateCta";
import { ButtonLink, SectionHeading } from "@/components/ui";
import { site } from "@/lib/config/site";
import { getSiteUrl } from "@/lib/config/env";
import { siteJsonLd, jsonLdScript } from "@/lib/seo/jsonld";
import { heroQuotes, type Destination } from "@/content/destinations";
import { resolve } from "@/lib/providers/registry";
// Importing the registration module wires up all provider adapters.
import "@/lib/providers/register";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function Home() {
  // Resolved via the provider registry, not imported directly — this is the
  // same call shape a Supabase/CMS-backed provider will satisfy later.
  const destinations =
    (await resolve<readonly Destination[]>("destinations")) ?? [];

  const jsonLd = siteJsonLd({
    name: site.name,
    description: site.description,
    url: getSiteUrl(),
  });

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />
      <section className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 sm:px-12">
        <div className="journee-kenburns absolute inset-0 -z-10">
          <Image
            src={site.heroImageUrl}
            alt=""
            aria-hidden
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink/70 via-ink/50 to-ink" />

        <div className="mx-auto w-full max-w-5xl">
          <p className="journee-fade-up mb-6 text-sm uppercase tracking-[0.4em] text-gold-bright">
            {site.tagline}
          </p>
          <h1 className="journee-fade-up font-display text-5xl font-semibold leading-[1.05] text-sand sm:text-7xl">
            See the world the way it
            <span className="text-gold"> actually feels.</span>
          </h1>
          <p className="journee-fade-up mt-6 max-w-2xl text-lg leading-relaxed text-sand/80">
            {site.description}
          </p>
          <div className="mt-10">
            <QuoteRotator quotes={heroQuotes} />
          </div>
          <div className="journee-fade-up mt-10 flex flex-wrap gap-4">
            <ButtonLink href="/plan" variant="primary">
              Plan a trip
            </ButtonLink>
            <ButtonLink href="/discover" variant="ghost">
              Discover by vibe
            </ButtonLink>
            <ButtonLink href="/saved" variant="ghost">
              Saved
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-28 sm:px-12">
        <SectionHeading
          eyebrow="Featured"
          title="Destinations chosen by mood, not by map."
          className="mb-14"
        />

        <DestinationExplorer destinations={destinations} />

        {/* Renders only when an affiliate catalog is configured and a link
            resolves; otherwise nothing is shown (no fabricated links). */}
        <div className="mt-12 flex justify-center">
          <AffiliateCta category="hotels" label="Plan your stay" />
        </div>
      </section>
    </main>
  );
}
