import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { DirectoryBrowser } from "@/components/vendor/DirectoryBrowser";
import { db } from "@/data";
import { getFrameworks } from "@/lib/content";
import { buildVendorFacets } from "@/lib/facets";
import { pageMeta } from "@/lib/seo";
import type { VendorFilter } from "@/data/types";

export const metadata: Metadata = pageMeta({
  title: "Vendor directory",
  description:
    "Browse verified UAE data compliance vendors - PDPL consultants, GRC and DPO services, data centers, and sector specialists. Filter by framework, sector and region.",
  path: "/directory",
});

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const filter: VendorFilter = {
    framework: firstValue(sp.framework),
    sector: firstValue(sp.sector),
    region: firstValue(sp.region),
  };

  const frameworks = getFrameworks();
  const sectors = await db.listSectors();
  const categories = await db.listCategories();
  const allVendors = await db.listVendors();
  const vendors = await db.listVendors(filter);

  const groups = buildVendorFacets({ vendors: allVendors, frameworks, sectors });

  return (
    <>
      <div className="border-b border-line bg-surface">
        <Container className="py-12">
          <h1 className="text-3xl font-bold tracking-tight text-ink">
            UAE data compliance vendor directory
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
            Consultants, GRC firms, outsourced DPOs, law firms and data centers
            that help UAE businesses comply. Free listings; verified badges are
            assigned manually after a review.
          </p>
          <div className="mt-6">
            <ButtonLink href="/vendors/submit" variant="outline" size="sm">
              List your company
            </ButtonLink>
          </div>
        </Container>
      </div>

      <Container className="py-12">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
          Browse by category
        </h2>
        <div className="mt-4 grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card
              key={category.slug}
              interactive
              as={Link}
              href={`/directory/${category.slug}`}
              className="group flex flex-col p-5"
            >
              <span className="flex items-center justify-between gap-2 text-sm font-bold text-ink">
                {category.name}
                <span className="text-muted transition-transform group-hover:translate-x-0.5">
                  &rarr;
                </span>
              </span>
              <span className="mt-1.5 block text-xs leading-relaxed text-muted">
                {category.description}
              </span>
            </Card>
          ))}
        </div>

        <div className="mt-12">
          <DirectoryBrowser
            vendors={vendors}
            frameworks={frameworks}
            groups={groups}
            totalCount={allVendors.length}
          />
        </div>
      </Container>
    </>
  );
}
