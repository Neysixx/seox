// ABOUTME: Generates the Open Graph image for social media previews
// ABOUTME: Uses Next.js ImageResponse API with the site's visual style

import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "SEOX - Type-safe SEO for Next.js";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: 180,
              fontWeight: 700,
              letterSpacing: "-0.05em",
              color: "rgba(255,255,255,0.6)",
              WebkitTextStroke: "1px rgba(255,255,255,0.8)",
            }}
          >
            SEOX
          </span>
          <span
            style={{
              fontSize: 180,
              fontWeight: 700,
              color: "#39FF14",
            }}
          >
            _
          </span>
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 32,
            color: "rgba(255,255,255,0.6)",
            display: "flex",
          }}
        >
          Type-safe SEO for Next.js
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
