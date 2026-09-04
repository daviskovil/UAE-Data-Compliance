import type { Metadata } from "next";
import { site } from "./site";

interface PageMetaInput {
  title: string;
  description?: string;
  path?: string;
}

/** Build per-page Metadata with sensible directory-wide defaults. */
export function pageMeta({
  title,
  description,
  path = "/",
}: PageMetaInput): Metadata {
  const url = new URL(path, site.url).toString();
  const desc = description ?? site.description;
  return {
    title,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${site.name}`,
      description: desc,
      url,
      siteName: site.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description: desc,
    },
  };
}

/** FAQPage JSON-LD for framework pages (SRS 5, structured data). */
export function faqJsonLd(faq: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    description: site.description,
  };
}
