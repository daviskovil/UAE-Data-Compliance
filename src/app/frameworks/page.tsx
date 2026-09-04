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

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {frameworks.map((framework) => (
          <Card key={framework.slug} interactive className="flex flex-col p-6">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-ink">
                <Link
                  href={`/frameworks/${framework.slug}`}
                  className="hover:text-brand-700"
                >
                  {framework.name}
                </Link>
              </h2>
              {framework.priority ? (
                <Badge tone="accent">Start here</Badge>
              ) : null}
            </div>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted">
              {framework.fullName}
            </p>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
              {framework.summary}
            </p>
            <Link
              href={`/frameworks/${framework.slug}`}
              className="mt-4 text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              Read the explainer &rarr;
            </Link>
          </Card>
        ))}
      </div>

      <Disclaimer className="mt-10" />
    </Container>
  );
}
