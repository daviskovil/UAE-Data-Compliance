import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} - ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: "72px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 10,
            background: "#00843D",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="72" height="72" viewBox="0 0 96 96">
            <g stroke="#C8102E" strokeWidth="14" strokeLinecap="round" fill="none">
              <path d="M48 48 24 24" />
              <path d="M48 48 72 24" />
              <path d="M48 48 24 72" />
              <path d="M48 48 72 72" />
            </g>
            <g fill="#C8102E">
              <circle cx="24" cy="24" r="12" />
              <circle cx="72" cy="24" r="12" />
              <circle cx="24" cy="72" r="12" />
              <circle cx="72" cy="72" r="12" />
              <circle cx="48" cy="48" r="9" />
            </g>
            <g fill="#00843D">
              <circle cx="48" cy="13" r="8.5" />
              <circle cx="48" cy="83" r="8.5" />
              <circle cx="13" cy="48" r="8.5" />
              <circle cx="83" cy="48" r="8.5" />
            </g>
          </svg>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              lineHeight: 1,
            }}
          >
            <span style={{ fontSize: 30, fontWeight: 800, color: "#26282e" }}>
              UAE Data
            </span>
            <span
              style={{
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: 6,
                color: "#545b66",
                marginTop: 6,
              }}
            >
              COMPLIANCE
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 58,
              fontWeight: 800,
              color: "#26282e",
              lineHeight: 1.12,
              maxWidth: 950,
            }}
          >
            Which UAE data laws apply to your business?
          </div>
          <div
            style={{
              width: 96,
              height: 6,
              background: "#C8102E",
              borderRadius: 3,
              marginTop: 28,
            }}
          />
          <div
            style={{
              fontSize: 26,
              color: "#545b66",
              marginTop: 28,
              maxWidth: 900,
            }}
          >
            Plain-English explainers, a free compliance checker, and a directory
            of verified vendors.
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 22, color: "#545b66" }}>
          {site.domain}
        </div>
      </div>
    ),
    { ...size },
  );
}
