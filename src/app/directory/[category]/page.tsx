import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { DirectoryBrowser } from "@/components/vendor/DirectoryBrowser";
import { db } from "@/data";
import { getFrameworks } from "@/lib/content";
import { buildVendorFacets } from "@/lib/facets";
import { pageMeta } from "@/lib/seo";
import type { VendorFilter } from "@/data/types";

export async function generateStaticParams() {
  const categories = await db.listCategories();
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await db.getCategory(slug);
  if (!category) return pageMeta({ title: "Category not found" });
  return pageMeta({
    title: category.name,
    description: category.description,
    path: `/directory/${category.slug}`,
  });
}

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: SearchParams;
}) {
  const { category: slug } = await params;
  const category = await db.getCategory(slug);
  if (!category) notFound();

  const sp = await searchParams;
  const baseFilter: VendorFilter = { category: category.slug };
  const filter: VendorFilter = {
    ...baseFilter,
    framework: firstValue(sp.framework),
    sector: firstValue(sp.sector),
    region: firstValue(sp.region),
  };

  const frameworks = getFrameworks();
  const sectors = await db.listSectors();
  const inCategory = await db.listVendors(baseFilter);
  const vendors = await db.listVendors(filter);
  const groups = buildVendorFacets({ vendors: inCategory, frameworks, sectors });

  return (
    <>
      <div className="border-b border-line bg-surface">
        <Container className="py-12">
          <nav className="text-sm text-muted">
            <Link href="/directory" className="hover:text-brand-700">
              Directory
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink">{category.name}</span>
          </nav>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink">
            {category.name}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
            {category.description}
          </p>
        </Container>
      </div>

      <Container className="py-12">
        <DirectoryBrowser
          vendors={vendors}
          frameworks={frameworks}
          groups={groups}
          totalCount={inCategory.length}
        />
      </Container>
    </>
  );
}
