/**
 * Schema.org structured data (JSON-LD) builders (pure).
 *
 * Produces standards-compliant linked-data objects for richer search results
 * (Google/Bing rich snippets, knowledge-graph eligibility). Builders are pure
 * and unit-tested; the page server-renders the output via `jsonLdScript`, which
 * also escapes `<` to keep the inline data block injection-safe.
 */
import type { Destination } from "@/content/destinations";

type JsonLd = Record<string, unknown>;

/** A destination as a schema.org TouristAttraction, with geo when known. */
export function destinationJsonLd(destination: Destination, url: string): JsonLd {
  const data: JsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: destination.name,
    description: destination.description ?? destination.headline,
    url,
    image: destination.imageUrl,
    address: {
      "@type": "PostalAddress",
      addressCountry: destination.country,
    },
  };
  if (destination.coordinates) {
    data.geo = {
      "@type": "GeoCoordinates",
      latitude: destination.coordinates.lat,
      longitude: destination.coordinates.lon,
    };
  }
  return data;
}

/** Site-level WebSite + Organization graph for the home page. */
export function siteJsonLd(opts: {
  name: string;
  description: string;
  url: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: opts.name,
        description: opts.description,
        url: opts.url,
      },
      {
        "@type": "Organization",
        name: opts.name,
        url: opts.url,
      },
    ],
  };
}

/** Serialize for an inline <script type="application/ld+json"> block, escaping
 * `<` so embedded content can't break out of the script element. */
export function jsonLdScript(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
