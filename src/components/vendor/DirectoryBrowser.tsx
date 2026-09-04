import { Suspense } from "react";
import { FilterSidebar, type FilterGroup } from "./FilterSidebar";
import { VendorGrid } from "./VendorGrid";
import type { Framework, Vendor } from "@/data/types";

export function DirectoryBrowser({
  vendors,
  frameworks,
  groups,
  totalCount,
}: {
  vendors: Vendor[];
  frameworks: Pick<Framework, "slug" | "name">[];
  groups: FilterGroup[];
  totalCount: number;
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-[15rem_1fr]">
      <Suspense fallback={<div className="text-sm text-muted">Filters</div>}>
        <FilterSidebar groups={groups} />
      </Suspense>

      <div className="min-w-0">
        <p className="text-sm text-muted">
          Showing <span className="font-semibold text-ink">{vendors.length}</span>{" "}
          of {totalCount} vendors
        </p>
        <div className="mt-4">
          <VendorGrid vendors={vendors} frameworks={frameworks} />
        </div>
      </div>
    </div>
  );
}
