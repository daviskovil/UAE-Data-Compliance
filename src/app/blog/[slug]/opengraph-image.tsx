import { ImageResponse } from "next/og";
import { getBlogPost, getBlogPosts } from "@/lib/content";
import { site } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Article - UAE Data Compliance";

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }));
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  const title = post?.title ?? "UAE Data Compliance";
  const category = post?.category ?? "Blog";

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

        <div
          style={{
            display: "flex",
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#C8102E",
          }}
        >
          {category}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: title.length > 70 ? 52 : 62,
            fontWeight: 800,
            color: "#26282e",
            lineHeight: 1.12,
            maxWidth: 1010,
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="44" height="44" viewBox="0 0 96 96">
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
          <span style={{ fontSize: 24, fontWeight: 700, color: "#26282e" }}>
            {site.name}
          </span>
          <span style={{ fontSize: 22, color: "#545b66" }}>
            · {site.domain}
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
