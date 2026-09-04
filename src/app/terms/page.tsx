import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Terms of Use",
  description: `The terms that govern use of ${site.name}.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <Container className="py-14">
      <article className="prose prose-slate mx-auto max-w-2xl prose-a:text-brand-700">
        <h1>Terms of Use</h1>
        <p>
          <strong>Draft.</strong> Placeholder scaffolding - review with a
          qualified adviser before launch.
        </p>

        <h2>Information only, not advice</h2>
        <p>
          {site.name} provides general information about UAE data protection and
          residency frameworks. It is not legal, regulatory or compliance
          advice, does not create any professional relationship, and must not be
          relied on for compliance decisions. Always consult a licensed
          professional about your specific situation.
        </p>

        <h2>Vendor listings</h2>
        <p>
          Listings are provided by the vendors or compiled from public sources.
          A &quot;Verified&quot; badge reflects a basic manual check only and is
          not an endorsement, certification or guarantee of any vendor&apos;s
          services. We are not a party to any engagement you enter into with a
          vendor.
        </p>

        <h2>No warranty</h2>
        <p>
          Content is provided &quot;as is&quot;. Frameworks and their
          requirements change, and the site may be incomplete or out of date. To
          the extent permitted by law, we disclaim liability for any loss
          arising from use of the site.
        </p>

        <h2>Acceptable use</h2>
        <p>
          Do not scrape, republish or misuse the directory, submit false vendor
          information, or use the contact and lead forms for spam.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these terms: <a href="/contact">contact page</a>.
        </p>
      </article>
    </Container>
  );
}
