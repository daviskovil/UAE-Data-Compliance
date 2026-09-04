import { VendorCard } from "./VendorCard";
import type { Framework, Vendor } from "@/data/types";

export function VendorGrid({
  vendors,
  frameworks,
  emptyMessage = "No vendors match these filters yet.",
}: {
  vendors: Vendor[];
  frameworks: Pick<Framework, "slug" | "name">[];
  emptyMessage?: string;
}) {
  if (vendors.length === 0) {
    return (
      <div className="rounded-[var(--radius-card)] border border-dashed border-line bg-surface p-10 text-center">
        <p className="text-sm text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {vendors.map((vendor) => (
        <VendorCard
          key={vendor.id}
          vendor={vendor}
          frameworks={frameworks}
        />
      ))}
    </div>
  );
}
