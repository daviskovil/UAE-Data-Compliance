import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { db } from "@/data";
import { getFrameworks } from "@/lib/content";
import { adminApprove, adminLogout, adminReject, isAdmin } from "./actions";
import { AdminLogin } from "./AdminLogin";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const authed = await isAdmin();

  return (
    <Container className="py-14">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-ink">
          Admin - vendor submissions
        </h1>
        {authed ? (
          <form action={adminLogout}>
            <Button type="submit" variant="outline" size="sm">
              Sign out
            </Button>
          </form>
        ) : null}
      </div>

      {!authed ? (
        <div className="mt-8">
          <AdminLogin />
        </div>
      ) : (
        <PendingList />
      )}
    </Container>
  );
}

async function PendingList() {
  const pending = await db.listPendingVendors();
  const frameworks = getFrameworks();
  const frameworkName = (s: string) =>
    frameworks.find((f) => f.slug === s)?.name ?? s.toUpperCase();

  if (pending.length === 0) {
    return (
      <p className="mt-8 text-sm text-muted">
        No pending submissions. New submissions from{" "}
        <code>/vendors/submit</code> land here for approval.
      </p>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      {pending.map((vendor) => (
        <Card key={vendor.id} className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-base font-semibold text-ink">
                {vendor.name}
              </h2>
              <a
                href={vendor.websiteUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-sm text-brand-700 hover:underline"
              >
                {vendor.websiteUrl}
              </a>
              <p className="mt-2 text-sm text-muted">{vendor.description}</p>
              <p className="mt-2 text-xs text-muted">
                {vendor.contactEmail} &middot; submitted{" "}
                {new Date(vendor.createdAt).toLocaleDateString("en-GB")}
              </p>
              {vendor.frameworks.length > 0 ? (
                <p className="mt-1 text-xs text-muted">
                  Frameworks: {vendor.frameworks.map(frameworkName).join(", ")}
                </p>
              ) : null}
            </div>
            <div className="flex shrink-0 gap-2">
              <form action={adminApprove}>
                <input type="hidden" name="id" value={vendor.id} />
                <Button type="submit" size="sm">
                  Approve
                </Button>
              </form>
              <form action={adminReject}>
                <input type="hidden" name="id" value={vendor.id} />
                <Button type="submit" size="sm" variant="outline">
                  Reject
                </Button>
              </form>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
