import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Badge, VerifiedBadge } from "@/components/ui/Badge";
import { VendorInquiryForm } from "@/components/forms/VendorInquiryForm";
import { db } from "@/data";
import { getFrameworks } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export async function generateStaticParams() {
  const vendors = await db.listVendors();
  return vendors.map((vendor) => ({ slug: vendor.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vendor = await db.getVendor(slug);
  if (!vendor) return pageMeta({ title: "Vendor not found" });
  return pageMeta({
    title: vendor.name,
    description: vendor.description,
    path: `/vendors/${vendor.slug}`,
  });
}

export default async function VendorProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vendor = await db.getVendor(slug);
  if (!vendor) notFound();

  const frameworks = getFrameworks();
  const sectors = await db.listSectors();
  const categories = await db.listCategories();

  const frameworkName = (s: string) =>
    frameworks.find((f) => f.slug === s)?.name ?? s.toUpperCase();
  const sectorName = (s: string) =>
    sectors.find((x) => x.slug === s)?.name ?? s;

  return (
    <Container className="py-12">
      <nav className="text-sm text-muted">
        <Link href="/directory" className="hover:text-brand-700">
          Directory
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{vendor.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_20rem]">
        <div className="min-w-0">
          <div className="flex items-start gap-4">
            <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-canvas text-xl font-bold text-brand-700">
              {vendor.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-ink">
                  {vendor.name}
                </h1>
                {vendor.verified ? <VerifiedBadge /> : null}
                {vendor.sample ? <Badge tone="neutral">Sample data</Badge> : null}
              </div>
              <a
                href={vendor.websiteUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="mt-1 inline-block text-sm font-medium text-brand-700 hover:text-brand-800"
              >
                {vendor.websiteUrl.replace(/^https?:\/\//, "")} &rarr;
              </a>
            </div>
          </div>

          <p className="mt-6 text-base leading-relaxed text-ink">
            {vendor.description}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Card className="p-5">
              <h2 className="text-sm font-semibold text-ink">
                Frameworks covered
              </h2>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {vendor.frameworks.map((s) => (
                  <Link key={s} href={`/frameworks/${s}`}>
                    <Badge tone="brand">{frameworkName(s)}</Badge>
                  </Link>
                ))}
              </div>
            </Card>
            <Card className="p-5">
              <h2 className="text-sm font-semibold text-ink">Sectors served</h2>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {vendor.sectors.map((s) => (
                  <Badge key={s} tone="neutral">
                    {sectorName(s)}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>

          {vendor.regions.length > 0 ? (
            <Card className="mt-4 p-5">
              <h2 className="text-sm font-semibold text-ink">Regions</h2>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {vendor.regions.map((r) => (
                  <Badge key={r} tone="neutral">
                    {r}
                  </Badge>
                ))}
              </div>
            </Card>
          ) : null}

          {vendor.categories.length > 0 ? (
            <p className="mt-6 text-sm text-muted">
              Listed under:{" "}
              {vendor.categories.map((c, i) => {
                const cat = categories.find((x) => x.slug === c);
                return (
                  <span key={c}>
                    {i > 0 ? ", " : ""}
                    <Link
                      href={`/directory/${c}`}
                      className="text-brand-700 hover:underline"
                    >
                      {cat?.name ?? c}
                    </Link>
                  </span>
                );
              })}
            </p>
          ) : null}

          {vendor.verified ? null : (
            <p className="mt-6 rounded-lg border border-line bg-canvas px-4 py-3 text-xs text-muted">
              This listing has not yet been through manual verification. The{" "}
              <strong className="font-semibold text-ink">Verified</strong> badge
              is assigned by an admin after a basic check of the company.
            </p>
          )}
        </div>

        <aside>
          <Card className="p-6 lg:sticky lg:top-24">
            <h2 className="text-base font-semibold text-ink">
              Contact {vendor.name}
            </h2>
            <p className="mt-1 text-sm text-muted">
              Send a short brief and we&apos;ll route it to them.
            </p>
            <div className="mt-4">
              <VendorInquiryForm
                vendorId={vendor.id}
                vendorName={vendor.name}
              />
            </div>
          </Card>
        </aside>
      </div>
    </Container>
  );
}
