import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { VendorSubmissionForm } from "@/components/forms/VendorSubmissionForm";
import { db } from "@/data";
import { getFrameworks } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "List your company",
  description:
    "Submit your UAE data compliance company for a free directory listing. Submissions are reviewed by an admin before they go live.",
  path: "/vendors/submit",
});

export default async function VendorSubmitPage() {
  const frameworks = getFrameworks();
  const sectors = await db.listSectors();

  return (
    <Container className="py-14">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-bold tracking-tight text-ink">
          List your company
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted">
          Free listing for companies that help UAE businesses with data
          compliance - consultants, GRC firms, outsourced DPOs, law firms and
          data centers. An admin reviews every submission before it is
          published.
        </p>

        <Card className="mt-8 p-6 sm:p-8">
          <VendorSubmissionForm
            frameworkOptions={frameworks.map((f) => ({
              value: f.slug,
              label: f.name,
            }))}
            sectorOptions={sectors.map((s) => ({
              value: s.slug,
              label: s.name,
            }))}
          />
        </Card>
      </div>
    </Container>
  );
}
