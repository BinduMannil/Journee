import { ImageResponse } from "next/og";
import { resolve } from "@/lib/providers/registry";
import "@/lib/providers/register";
import { featuredDestinations, type Destination } from "@/content/destinations";

export const dynamicParams = false;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return featuredDestinations.map((d) => ({ id: d.id }));
}

/**
 * Cinematic dynamic OG image per destination — generated at build, no external
 * service. Uses the destination's mood + name for an editorial card.
 */
export default async function OgImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const destinations =
    (await resolve<readonly Destination[]>("destinations")) ?? featuredDestinations;
  const d = destinations.find((x) => x.id === id);
  const name = d?.name ?? "Journee";
  const country = d?.country ?? "";
  const mood = d?.mood ?? "Cinematic travel intelligence";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "linear-gradient(135deg, #11100e 0%, #1b1916 60%, #9c7b2f 200%)",
          padding: 72,
          color: "#f4ede2",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#e7c878",
          }}
        >
          {mood}
        </div>
        <div style={{ fontSize: 110, fontWeight: 700, marginTop: 12 }}>{name}</div>
        <div style={{ fontSize: 32, letterSpacing: 6, color: "#8a8175", textTransform: "uppercase" }}>
          {country}
        </div>
        <div style={{ marginTop: 28, fontSize: 26, color: "#c9a24b" }}>Journee</div>
      </div>
    ),
    size,
  );
}
