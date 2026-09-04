import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { CheckerWizard } from "@/components/checker/CheckerWizard";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Free UAE data compliance checker",
  description:
    "Answer a few questions and see which UAE data protection and residency frameworks likely apply to your business - PDPL, CBUAE, NESA, DESC, health data and cloud residency rules.",
  path: "/checker",
});

export default function CheckerPage() {
  return (
    <Container className="py-14">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-bold tracking-tight text-ink">
          Which UAE data laws apply to you?
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted">
          A few quick questions. No sign-up, no email required to see your
          result. Takes about a minute.
        </p>

        <div className="mt-8">
          <CheckerWizard />
        </div>

        <Disclaimer className="mt-6" />
      </div>
    </Container>
  );
}
