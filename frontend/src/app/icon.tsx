import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

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
          background: "radial-gradient(circle at 30% 20%, #ffffff, #e9ecef)",
          color: "#111111",
          fontSize: 140,
          fontWeight: 700,
          letterSpacing: -4,
        }}
      >
        SC
      </div>
    ),
    size
  );
}
