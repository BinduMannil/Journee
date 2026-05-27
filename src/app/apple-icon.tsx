import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** iOS home-screen icon: gold serif "J" on ink. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#11100e",
          color: "#c9a24b",
          fontSize: 120,
          fontWeight: 700,
          fontFamily: "serif",
        }}
      >
        J
      </div>
    ),
    size,
  );
}
