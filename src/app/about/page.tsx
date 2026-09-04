import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "About",
  description: `About ${site.name} - what it is, who it's for, and how it makes money.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <Container className="py-14">
      <article className="prose prose-slate mx-auto max-w-2xl prose-a:text-brand-700">
        <h1>About {site.name}</h1>
        <p>
          {site.name} is a directory and information site for businesses trying
          to understand which UAE data protection and residency laws apply to
          them, and to find vendors who can help them comply.
        </p>
        <h2>What we do</h2>
        <ul>
          <li>
            Publish plain-English explainers of the UAE&apos;s main data
            frameworks.
          </li>
          <li>
            Run a free <Link href="/checker">compliance checker</Link> that maps
            your business to the frameworks that likely apply.
          </li>
          <li>
            List vendors - consultants, GRC firms, outsourced DPOs, law firms
            and data centers - in a filterable{" "}
            <Link href="/directory">directory</Link>.
          </li>
        </ul>
        <h2>What we are not</h2>
        <p>
          We are a media and lead-generation business, not a consulting firm. We
          do not implement, deploy or advise on compliance ourselves, and
          nothing on this site is legal advice.
        </p>
        <h2>How we make money</h2>
        <p>
          Basic vendor listings are free. Revenue comes from featured listings
          and per-lead fees. Featured placement never changes the plain-English
          explainer content or a checker result.
        </p>
        <h2>Contact</h2>
        <p>
          Corrections and questions: <Link href="/contact">contact page</Link>.
        </p>
      </article>
    </Container>
  );
}
