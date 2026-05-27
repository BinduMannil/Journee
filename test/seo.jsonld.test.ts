import { test } from "node:test";
import assert from "node:assert/strict";
import { destinationJsonLd, siteJsonLd, jsonLdScript } from "../src/lib/seo/jsonld";
import type { Destination } from "../src/content/destinations";

const kyoto: Destination = {
  id: "kyoto",
  name: "Kyoto",
  country: "Japan",
  headline: "Lantern-lit alleys.",
  mood: "Contemplative",
  imageUrl: "https://example.com/kyoto.jpg",
  coordinates: { lat: 35.0116, lon: 135.7681 },
  description: "Slow rituals.",
};

test("destination JSON-LD is a TouristAttraction with geo + address", () => {
  const d = destinationJsonLd(kyoto, "https://journee.example/destinations/kyoto");
  assert.equal(d["@type"], "TouristAttraction");
  assert.equal(d.name, "Kyoto");
  assert.equal(d.description, "Slow rituals.");
  assert.equal(d.url, "https://journee.example/destinations/kyoto");
  assert.deepEqual(d.geo, {
    "@type": "GeoCoordinates",
    latitude: 35.0116,
    longitude: 135.7681,
  });
  assert.equal((d.address as Record<string, unknown>).addressCountry, "Japan");
});

test("falls back to the headline when no description, and omits geo without coords", () => {
  const { description: _d, coordinates: _c, ...bare } = kyoto;
  const d = destinationJsonLd(bare as Destination, "https://x/y");
  assert.equal(d.description, "Lantern-lit alleys.");
  assert.equal(d.geo, undefined);
});

test("site JSON-LD graphs a WebSite and an Organization", () => {
  const s = siteJsonLd({ name: "Journee", description: "Travel.", url: "https://journee.example" });
  const graph = s["@graph"] as Array<Record<string, unknown>>;
  assert.equal(graph.length, 2);
  assert.deepEqual(
    graph.map((g) => g["@type"]).sort(),
    ["Organization", "WebSite"],
  );
});

test("jsonLdScript escapes < to prevent breaking out of the script element", () => {
  const out = jsonLdScript({ name: "</script><script>alert(1)" } as Record<string, unknown>);
  assert.ok(!out.includes("</script>"), "must not contain a literal closing tag");
  assert.ok(out.includes("\\u003c"));
});
