import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Generated brand mark: gold serif "J" on ink. */
export default function Icon() {
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
          fontSize: 46,
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
