import Image from "next/image";
import type { Destination } from "@/content/destinations";

/**
 * Editorial destination card: full-bleed cinematic image, gold mood tag, and a
 * gradient scrim for readability. Receives data via props — fully reusable.
 */
export function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <article className="group relative h-[26rem] overflow-hidden rounded-2xl">
      <Image
        src={destination.imageUrl}
        alt={`${destination.name}, ${destination.country}`}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-7">
        <span className="mb-3 inline-block rounded-full border border-gold/40 px-3 py-1 text-xs uppercase tracking-[0.2em] text-gold-bright">
          {destination.mood}
        </span>
        <h3 className="font-display text-3xl font-semibold text-sand">
          {destination.name}
        </h3>
        <p className="mt-1 text-sm uppercase tracking-[0.25em] text-stone">
          {destination.country}
        </p>
        <p className="mt-3 max-w-md text-sand/80">{destination.headline}</p>
      </div>
    </article>
  );
}
