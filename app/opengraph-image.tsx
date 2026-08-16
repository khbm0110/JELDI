import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Jeldi — Handcrafted in Fez";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "72px",
          background:
            "linear-gradient(135deg, #2E1C12 0%, #4A2E1F 55%, #3A2416 100%)"
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#D9C7A8", // beige
            fontFamily: "monospace",
            marginBottom: 28
          }}
        >
          Fez, Morocco
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 84,
            lineHeight: 1.05,
            color: "#F2EBDD", // ivory
            fontFamily: "serif",
            maxWidth: 920
          }}
        >
          Handcrafted leather, from the Chouara tannery.
        </div>
      </div>
    ),
    { ...size }
  );
}
