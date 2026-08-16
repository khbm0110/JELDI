import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

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
          background: "#4A2E1F", // chestnut
          color: "#F2EBDD", // ivory
          fontSize: 22,
          fontWeight: 600,
          fontFamily: "serif"
        }}
      >
        J
      </div>
    ),
    { ...size }
  );
}
