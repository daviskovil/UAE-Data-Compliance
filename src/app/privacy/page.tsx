import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Privacy Policy",
  description: `How ${site.name} collects and uses data, including what the compliance checker stores.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <Container className="py-14">
      <article className="prose prose-slate mx-auto max-w-2xl prose-a:text-brand-700">
        <h1>Privacy Policy</h1>
        <p>
          <strong>Draft.</strong> This policy is placeholder scaffolding and
          must be reviewed by a qualified adviser before launch - especially
          given the subject matter of this site.
        </p>

        <h2>What the compliance checker collects</h2>
        <p>
          The <a href="/checker">compliance checker</a> asks about your sector,
          data hosting location, whether you handle UAE personal data, government
          contracting, and company size. Your answers are used to generate a
          result on the spot. We store completed questionnaire sessions in
          aggregate to understand which frameworks people ask about; this does
          not require an account.
        </p>
        <p>
          You only provide an email address if you explicitly ask for a vendor
          introduction on the result page. If you do, we pass your answers and
          email to the vendor(s) you selected so they can respond.
        </p>

        <h2>Other data we collect</h2>
        <ul>
          <li>
            <strong>Vendor submissions and contact forms:</strong> the details
            you enter, used to review the listing or reply to you.
          </li>
          <li>
            <strong>Basic analytics:</strong> privacy-friendly, aggregate usage
            statistics with no cross-site tracking.
          </li>
        </ul>

        <h2>Retention and your rights</h2>
        <p>
          We keep lead and submission data only as long as needed for the
          purpose above. To request access to or deletion of data you submitted,
          use the <a href="/contact">contact page</a>.
        </p>

        <h2>Third parties</h2>
        <p>
          Data is shared only with vendors you explicitly select, and with
          infrastructure providers needed to run the site.
        </p>
      </article>
    </Container>
  );
}
