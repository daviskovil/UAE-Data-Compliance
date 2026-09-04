import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge, VerifiedBadge } from "@/components/ui/Badge";
import type { Framework, Vendor } from "@/data/types";

export function VendorCard({
  vendor,
  frameworks,
}: {
  vendor: Vendor;
  frameworks: Pick<Framework, "slug" | "name">[];
}) {
  const frameworkName = (slug: string) =>
    frameworks.find((f) => f.slug === slug)?.name ?? slug.toUpperCase();

  return (
    <Card interactive className="flex flex-col p-5">
      <div className="flex items-start gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-canvas text-lg font-bold text-brand-700">
          {vendor.logoUrl && !vendor.logoUrl.includes("placeholder") ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={vendor.logoUrl}
              alt={`${vendor.name} logo`}
              className="h-full w-full object-contain"
            />
          ) : (
            vendor.name.slice(0, 2).toUpperCase()
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-ink">
              <Link
                href={`/vendors/${vendor.slug}`}
                className="hover:text-brand-700"
              >
                {vendor.name}
              </Link>
            </h3>
            {vendor.verified ? <VerifiedBadge /> : null}
            {vendor.sample ? <Badge tone="neutral">Sample</Badge> : null}
          </div>
          <p className="mt-1 line-clamp-2 text-sm text-muted">
            {vendor.description}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {vendor.frameworks.slice(0, 4).map((slug) => (
          <Badge key={slug} tone="brand">
            {frameworkName(slug)}
          </Badge>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-3 border-t border-line pt-4">
        <Link
          href={`/vendors/${vendor.slug}`}
          className="text-sm font-semibold text-brand-700 hover:text-brand-800"
        >
          View details
        </Link>
        <a
          href={vendor.websiteUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="ml-auto text-sm font-medium text-muted hover:text-ink"
        >
          Visit website &rarr;
        </a>
      </div>
    </Card>
  );
}
