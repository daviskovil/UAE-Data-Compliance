import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { ButtonLink } from "@/components/ui/Button";
import { VendorGrid } from "@/components/vendor/VendorGrid";
import { db } from "@/data";
import { getFramework, getFrameworks } from "@/lib/content";
import { faqJsonLd, pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return getFrameworks().map((framework) => ({ slug: framework.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const framework = getFramework(slug);
  if (!framework) return pageMeta({ title: "Framework not found" });
  return pageMeta({
    title: `${framework.name} - ${framework.fullName}`,
    description: framework.summary,
    path: `/frameworks/${framework.slug}`,
  });
}

export default async function FrameworkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const framework = getFramework(slug);
  if (!framework) notFound();

  const vendors = await db.listVendors({ framework: framework.slug });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(framework.faq)),
        }}
      />

      <div className="border-b border-line bg-surface">
        <Container className="py-12">
          <nav className="text-sm text-muted">
            <Link href="/frameworks" className="hover:text-brand-700">
              Frameworks
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink">{framework.name}</span>
          </nav>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-ink">
              {framework.name}
            </h1>
            {framework.priority ? (
              <Badge tone="accent">Start here</Badge>
            ) : null}
          </div>
          <p className="mt-1 text-sm font-medium uppercase tracking-wide text-muted">
            {framework.fullName}
          </p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
            {framework.summary}
          </p>
        </Container>
      </div>

      <Container className="grid gap-10 py-12 lg:grid-cols-[1fr_20rem]">
        <div className="min-w-0">
          <article
            className="prose prose-slate max-w-none prose-headings:tracking-tight prose-h2:text-xl prose-a:text-brand-700"
            dangerouslySetInnerHTML={{ __html: framework.bodyHtml }}
          />

          {framework.faq.length > 0 ? (
            <section className="mt-10">
              <h2 className="text-xl font-bold text-ink">
                Frequently asked questions
              </h2>
              <dl className="mt-4 divide-y divide-line rounded-[var(--radius-card)] border border-line bg-surface">
                {framework.faq.map((item) => (
                  <div key={item.question} className="p-5">
                    <dt className="text-sm font-semibold text-ink">
                      {item.question}
                    </dt>
                    <dd className="mt-2 text-sm leading-relaxed text-muted">
                      {item.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          <Disclaimer className="mt-10" />
        </div>

        <aside className="space-y-6">
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-ink">Who it applies to</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {framework.appliesTo.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-5">
            <h2 className="text-sm font-semibold text-ink">
              Penalties in brief
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {framework.penaltiesSummary}
            </p>
          </Card>

          <Card className="bg-brand-50 p-5">
            <h2 className="text-sm font-semibold text-ink">
              Not sure this applies to you?
            </h2>
            <p className="mt-2 text-sm text-muted">
              The checker maps your business to the frameworks that likely apply.
            </p>
            <ButtonLink
              href="/checker"
              variant="primary"
              size="sm"
              className="mt-4"
            >
              Run the checker
            </ButtonLink>
          </Card>
        </aside>
      </Container>

      <div className="border-t border-line bg-surface">
        <Container className="py-12">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-ink">
                Vendors who help with {framework.name}
              </h2>
              <p className="mt-1 text-sm text-muted">
                Consultants and providers who tag {framework.name} as a
                specialism.
              </p>
            </div>
            <Link
              href={`/directory?framework=${framework.slug}`}
              className="shrink-0 text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              View all &rarr;
            </Link>
          </div>
          <div className="mt-6">
            <VendorGrid
              vendors={vendors.slice(0, 3)}
              frameworks={getFrameworks()}
              emptyMessage={`No vendors are tagged for ${framework.name} yet. Check the full directory.`}
            />
          </div>
        </Container>
      </div>
    </>
  );
}
