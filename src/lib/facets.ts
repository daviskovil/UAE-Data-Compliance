import type { FilterGroup } from "@/components/vendor/FilterSidebar";
import type { Framework, Sector, Vendor } from "@/data/types";

/**
 * Build filter-sidebar groups (framework / sector / region) with result counts,
 * from the set of vendors in the current scope.
 */
export function buildVendorFacets({
  vendors,
  frameworks,
  sectors,
}: {
  vendors: Vendor[];
  frameworks: Pick<Framework, "slug" | "name">[];
  sectors: Pick<Sector, "slug" | "name">[];
}): FilterGroup[] {
  const count = (predicate: (vendor: Vendor) => boolean) =>
    vendors.filter(predicate).length;

  const frameworkOptions = frameworks
    .map((framework) => ({
      value: framework.slug,
      label: framework.name,
      count: count((vendor) => vendor.frameworks.includes(framework.slug)),
    }))
    .filter((option) => option.count > 0);

  const sectorOptions = sectors
    .map((sector) => ({
      value: sector.slug,
      label: sector.name,
      count: count((vendor) => vendor.sectors.includes(sector.slug)),
    }))
    .filter((option) => option.count > 0);

  const regionOptions = [...new Set(vendors.flatMap((v) => v.regions))]
    .sort()
    .map((region) => ({
      value: region,
      label: region,
      count: count((vendor) => vendor.regions.includes(region)),
    }));

  const groups: FilterGroup[] = [];
  if (frameworkOptions.length)
    groups.push({ key: "framework", label: "Framework", options: frameworkOptions });
  if (sectorOptions.length)
    groups.push({ key: "sector", label: "Sector served", options: sectorOptions });
  if (regionOptions.length)
    groups.push({ key: "region", label: "Region", options: regionOptions });
  return groups;
}
