import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolve } from "@/lib/providers/registry";
import "@/lib/providers/register";
import { featuredDestinations, type Destination } from "@/content/destinations";
import { LightBadge } from "@/components/LightBadge";
import { AtmosphericScore } from "@/components/AtmosphericScore";
import { SunSchedule } from "@/components/SunSchedule";
import { TravelReadiness } from "@/components/TravelReadiness";
import { SaveButton } from "@/components/SaveButton";
import { AffiliateCta } from "@/components/AffiliateCta";
import { isFeatureEnabled } from "@/lib/config/flags";
import { getSiteUrl } from "@/lib/config/env";
import { destinationJsonLd, jsonLdScript } from "@/lib/seo/jsonld";

async function getDestinations(): Promise<readonly Destination[]> {
  return (await resolve<readonly Destination[]>("destinations")) ?? featuredDestinations;
}

async function findDestination(id: string): Promise<Destination | undefined> {
  return (await getDestinations()).find((d) => d.id === id);
}

// Only ids known at build are valid routes; any other id returns a true 404 at
// the router level (no soft-404). generateStaticParams uses the seed baseline.
// NOTE: when DB-backed destinations exist, make this async to include their ids
// (or revisit rendering strategy). See docs/governance/continuation-handoff.md.
export const dynamicParams = false;

export function generateStaticParams() {
  return featuredDestinations.map((d) => ({ id: d.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const destination = await findDestination(id);
  if (!destination) return { title: "Destination not found" };
  return {
    title: `${destination.name}, ${destination.country}`,
    description: destination.headline,
    openGraph: {
      title: `${destination.name}, ${destination.country}`,
      description: destination.headline,
      images: [destination.imageUrl],
    },
  };
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const destination = await findDestination(id);
  if (!destination) notFound();

  const jsonLd = destinationJsonLd(
    destination,
    `${getSiteUrl()}/destinations/${destination.id}`,
  );

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(jsonLd) }}
      />
      <section className="relative flex min-h-[70vh] flex-col justify-end overflow-hidden px-6 pb-16 sm:px-12">
        <Image
          src={destination.imageUrl}
          alt={`${destination.name}, ${destination.country}`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/20" />

        <div className="relative mx-auto w-full max-w-4xl">
          <Link
            href="/"
            className="mb-6 inline-block text-sm uppercase tracking-[0.25em] text-gold-bright hover:text-gold"
          >
            &larr; All destinations
          </Link>
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-full border border-gold/40 px-3 py-1 text-xs uppercase tracking-[0.2em] text-gold-bright">
              {destination.mood}
            </span>
            {destination.coordinates && (
              <LightBadge
                lat={destination.coordinates.lat}
                lon={destination.coordinates.lon}
              />
            )}
          </div>
          <h1 className="font-display text-5xl font-semibold text-sand sm:text-7xl">
            {destination.name}
          </h1>
          <p className="mt-2 text-sm uppercase tracking-[0.3em] text-stone">
            {destination.country}
          </p>
          <div className="mt-5">
            <SaveButton id={destination.id} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20 sm:px-12">
        <p className="font-display text-2xl italic leading-relaxed text-sand/90 sm:text-3xl">
          {destination.headline}
        </p>

        {destination.description && (
          <p className="mt-8 text-lg leading-relaxed text-sand/80">
            {destination.description}
          </p>
        )}

        {destination.bestTime && (
          <p className="mt-6 text-sm text-sand/70">
            <span className="uppercase tracking-[0.25em] text-gold">Best time</span>
            <span className="ml-3">{destination.bestTime}</span>
          </p>
        )}

        {destination.coordinates && (
          <div className="mt-12 rounded-2xl border border-sand/10 p-7">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-gold">
              Atmospheric read
            </p>
            <AtmosphericScore
              lat={destination.coordinates.lat}
              lon={destination.coordinates.lon}
            />
          </div>
        )}

        {destination.coordinates && <SunSchedule lat={destination.coordinates.lat} />}

        {destination.coordinates && isFeatureEnabled("mock-intelligence") && (
          <TravelReadiness
            destinationId={destination.id}
            lat={destination.coordinates.lat}
            lon={destination.coordinates.lon}
          />
        )}

        <div className="mt-12">
          <AffiliateCta category="hotels" label="Plan your stay" />
        </div>
      </section>
    </main>
  );
}
