import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { ButtonLink } from "@/components/ui/Button";
import { VendorGrid } from "@/components/vendor/VendorGrid";
import { CheckerLeadForm } from "@/components/checker/CheckerLeadForm";
import { db } from "@/data";
import { getFrameworks } from "@/lib/content";
import { evaluateChecker } from "@/lib/checker";
import { pageMeta } from "@/lib/seo";
import type { CheckerAnswers, Vendor } from "@/data/types";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Your compliance checker result",
    path: "/checker/result",
  }),
  robots: { index: false, follow: false },
};

function decodeAnswers(raw: string | undefined): CheckerAnswers | null {
  if (!raw) return null;
  try {
    const json = atob(decodeURIComponent(raw));
    const parsed = JSON.parse(json) as CheckerAnswers;
    if (!parsed.sector || !parsed.hosting) return null;
    return parsed;
  } catch {
    return null;
  }
}

export default async function CheckerResultPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const answers = decodeAnswers(
    Array.isArray(sp.a) ? sp.a[0] : sp.a,
  );

  if (!answers) {
    return (
      <Container className="py-16">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-2xl font-bold text-ink">No result to show</h1>
          <p className="mt-3 text-muted">
            This page shows the outcome of the compliance checker. Run it to see
            which frameworks apply to you.
          </p>
          <ButtonLink href="/checker" variant="accent" className="mt-6">
            Start the checker
          </ButtonLink>
        </div>
      </Container>
    );
  }

  const result = evaluateChecker(answers);
  const allFrameworks = getFrameworks();
  const matchedSlugs: string[] = result.matches.map((m) => m.framework);

  const allVendors = await db.listVendors();
  const scored = allVendors
    .map((vendor: Vendor) => {
      const frameworkHits = vendor.frameworks.filter((f) =>
        matchedSlugs.includes(f),
      ).length;
      const categoryHits = vendor.categories.filter((c) =>
        result.categorySlugs.includes(c),
      ).length;
      return { vendor, score: frameworkHits * 2 + categoryHits };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((entry) => entry.vendor);

  return (
    <>
      <div className="border-b border-line bg-surface">
        <Container className="py-12">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            Your result
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">
            {result.matches.length === 1
              ? "One framework likely applies to you"
              : `${result.matches.length} frameworks likely apply to you`}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
            Based on a {answers.sector.replace("-", " ")} business, data hosted{" "}
            {answers.hosting === "uae" ? "in the UAE" : `outside the UAE (${answers.hosting.toUpperCase()})`}
            {answers.handlesUaePersonalData
              ? ", handling UAE personal data"
              : ""}
            {answers.governmentContracts ? ", with government contracts" : ""}.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {result.matches.map((match) => (
              <Badge key={match.framework} tone="brand">
                {allFrameworks.find((f) => f.slug === match.framework)?.name ??
                  match.framework.toUpperCase()}
              </Badge>
            ))}
          </div>
        </Container>
      </div>

      <Container className="grid gap-10 py-12 lg:grid-cols-[1fr_20rem]">
        <div className="min-w-0 space-y-4">
          {result.matches.map((match) => {
            const framework = allFrameworks.find(
              (f) => f.slug === match.framework,
            );
            return (
              <Card key={match.framework} className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-semibold text-ink">
                    {framework?.name ?? match.framework.toUpperCase()}
                  </h2>
                  {framework ? (
                    <Link
                      href={`/frameworks/${framework.slug}`}
                      className="shrink-0 text-sm font-semibold text-brand-700 hover:text-brand-800"
                    >
                      Full explainer &rarr;
                    </Link>
                  ) : null}
                </div>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted">
                  {framework?.fullName}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink">
                  {match.reason}
                </p>
                {framework ? (
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {framework.summary}
                  </p>
                ) : null}
              </Card>
            );
          })}

          <Disclaimer className="mt-2" />

          <p className="text-sm text-muted">
            <Link href="/checker" className="font-medium text-brand-700 underline">
              Retake the checker
            </Link>{" "}
            if any of your answers were rough guesses.
          </p>
        </div>

        <aside className="space-y-6">
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-ink">
              Vendors matched to your result
            </h2>
            <p className="mt-1 text-xs text-muted">
              Ranked by overlap with the frameworks above.
            </p>
            <div className="mt-4">
              <CheckerLeadForm
                frameworks={matchedSlugs}
                vendorIds={scored.map((v) => v.id)}
                answers={answers}
              />
            </div>
          </Card>
        </aside>
      </Container>

      <div className="border-t border-line bg-surface">
        <Container className="py-12">
          <h2 className="text-xl font-bold text-ink">Matched vendors</h2>
          <div className="mt-6">
            <VendorGrid
              vendors={scored}
              frameworks={allFrameworks}
              emptyMessage="No listed vendors match this result yet. Browse the full directory."
            />
          </div>
          <div className="mt-6">
            <ButtonLink href="/directory" variant="outline" size="sm">
              Browse the full directory
            </ButtonLink>
          </div>
        </Container>
      </div>
    </>
  );
}
