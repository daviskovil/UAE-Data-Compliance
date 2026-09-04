import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { ContactForm } from "@/components/forms/ContactForm";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Contact",
  description: "Get in touch about corrections, listings or partnerships.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <Container className="py-14">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-bold tracking-tight text-ink">Contact</h1>
        <p className="mt-3 text-base leading-relaxed text-muted">
          Corrections to a framework explainer, questions about a listing, or
          partnership enquiries. We reply by email.
        </p>
        <Card className="mt-8 p-6 sm:p-8">
          <ContactForm />
        </Card>
        <p className="mt-4 text-sm text-muted">
          Prefer email? Write to{" "}
          <a
            href="mailto:hello@uaedatacompliance.com"
            className="text-brand-700 underline"
          >
            hello@uaedatacompliance.com
          </a>
          .
        </p>
      </div>
    </Container>
  );
}
