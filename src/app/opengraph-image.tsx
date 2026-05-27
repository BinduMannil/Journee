import { ImageResponse } from "next/og";
import { site } from "@/lib/config/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Brand share card for non-destination pages. */
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(135deg, #11100e 0%, #1b1916 55%, #9c7b2f 220%)",
          padding: 80,
          color: "#f4ede2",
          fontFamily: "serif",
        }}
      >
        <div style={{ fontSize: 30, letterSpacing: 10, textTransform: "uppercase", color: "#e7c878" }}>
          {site.tagline}
        </div>
        <div style={{ fontSize: 120, fontWeight: 700, marginTop: 16 }}>{site.name}</div>
        <div style={{ fontSize: 30, color: "#8a8175", marginTop: 8, maxWidth: 900 }}>
          See the world the way it actually feels.
        </div>
      </div>
    ),
    size,
  );
}
