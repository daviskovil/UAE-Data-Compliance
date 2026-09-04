import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { ShortcutGrid } from "@/components/home/ShortcutGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { db } from "@/data";
import { getFrameworks } from "@/lib/content";

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Answer four questions",
    body: "Tell the checker your sector, where your data is hosted, and whether you handle UAE personal data or government contracts.",
  },
  {
    step: "2",
    title: "See which frameworks apply",
    body: "Get a plain-English summary of the laws that likely apply to you, each linked to a full explainer.",
  },
  {
    step: "3",
    title: "Compare vendors who can help",
    body: "Review a shortlist of relevant consultants, GRC firms and providers - and request an intro if you want one.",
  },
];

export default async function HomePage() {
  const frameworks = getFrameworks();
  const sectors = await db.listSectors();
  const vendors = await db.listVendors();
  const verifiedCount = vendors.filter((v) => v.verified).length;

  return (
    <>
      <Hero vendorCount={vendors.length} />
      <TrustBar
        vendorCount={vendors.length}
        frameworkCount={frameworks.length}
        verifiedCount={verifiedCount}
      />

      <Container as="section" className="py-16">
        <SectionHeading
          eyebrow="Start here"
          title="Browse by sector"
          description="Every sector has a different mix of obligations. Jump to the one that fits your business."
        />
        <div className="mt-8">
          <ShortcutGrid
            items={sectors.map((sector) => ({
              label: sector.name,
              href: `/directory?sector=${sector.slug}`,
              description: sector.blurb,
            }))}
          />
        </div>
      </Container>

      <div className="border-y border-line bg-surface">
        <Container as="section" className="py-16">
          <SectionHeading
            eyebrow="The frameworks"
            title="Browse by framework"
            description="Six explainers covering the laws most UAE businesses need to know about."
          />
          <div className="mt-8">
            <ShortcutGrid
              items={frameworks.map((framework) => ({
                label: framework.name,
                href: `/frameworks/${framework.slug}`,
                description: framework.fullName,
              }))}
            />
          </div>
        </Container>
      </div>

      <Container as="section" className="py-16">
        <SectionHeading
          eyebrow="How it works"
          title="From confusion to a shortlist in a few minutes"
          align="center"
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {HOW_IT_WORKS.map((item) => (
            <div key={item.step} className="text-center">
              <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-brand-600 text-base font-bold text-white">
                {item.step}
              </div>
              <h3 className="mt-4 text-base font-semibold text-ink">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {item.body}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <ButtonLink href="/checker" variant="accent" size="lg">
            Start the compliance checker
          </ButtonLink>
        </div>
      </Container>

      <div className="border-t border-line bg-brand-700">
        <Container as="section" className="py-14">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold text-white">
                Run a compliance service?
              </h2>
              <p className="mt-2 text-brand-100">
                List your company in the directory for free and reach UAE
                businesses looking for help right now.
              </p>
            </div>
            <ButtonLink
              href="/vendors/submit"
              variant="accent"
              size="lg"
              className="shrink-0"
            >
              Submit your company
            </ButtonLink>
          </div>
        </Container>
      </div>

      <Container as="section" className="py-16">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading
            eyebrow="Latest"
            title="Regulation updates"
          />
          <Link
            href="/blog"
            className="shrink-0 text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            All updates &rarr;
          </Link>
        </div>
        <p className="mt-6 text-sm text-muted">
          Short notes on changes to UAE data law and what they mean in practice.
          Visit the <Link href="/blog" className="text-brand-700 underline">blog</Link>{" "}
          for the full feed.
        </p>
      </Container>
    </>
  );
}
