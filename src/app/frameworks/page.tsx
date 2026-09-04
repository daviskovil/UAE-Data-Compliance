import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { getFrameworks } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "UAE data compliance frameworks",
  description:
    "Plain-English explainers of the UAE's main data protection and residency frameworks: PDPL, TDRA/CCRF, NESA, DESC, CBUAE and health data law.",
  path: "/frameworks",
});

export default function FrameworksIndexPage() {
  const frameworks = getFrameworks();

  return (
    <Container as="section" className="py-14">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-ink">
          UAE data compliance frameworks
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted">
          The UAE does not have a single data rulebook. Obligations come from a
          federal privacy law, sector regulators, and free-zone regimes. These
          explainers cover the six that matter to most businesses.
        </p>
      </div>

      <div className="mt-8 grid items-start gap-4 sm:grid-cols-2">
        {frameworks.map((framework) => (
          <Card
            key={framework.slug}
            as={Link}
            href={`/frameworks/${framework.slug}`}
            interactive
            className="group flex flex-col p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-bold text-ink">
                    {framework.name}
                  </h2>
                  {framework.priority ? (
                    <Badge tone="accent">Start here</Badge>
                  ) : null}
                </div>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                  {framework.fullName}
                </p>
              </div>
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                <svg
                  viewBox="0 0 20 20"
                  className="h-3.5 w-3.5 fill-none stroke-current"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 4l6 6-6 6" />
                </svg>
              </span>
            </div>
            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">
              {framework.summary}
            </p>
            <span className="mt-4 text-sm font-semibold text-brand-700 group-hover:text-brand-800">
              Read the explainer &rarr;
            </span>
          </Card>
        ))}
      </div>

      <Disclaimer className="mt-10" />
    </Container>
  );
}
