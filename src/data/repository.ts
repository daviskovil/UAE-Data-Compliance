/**
 * Swappable data-access layer.
 *
 * The app only ever imports the `db` singleton from `src/data/index.ts`, typed
 * as `DataRepository`. Today that is `LocalRepository` (JSON seed data + local
 * JSON files for writes). To move to Supabase (SRS section 7) later, implement
 * `SupabaseRepository` against this same interface and swap the singleton - no
 * page or component changes required.
 */

import fs from "node:fs";
import path from "node:path";
import type {
  Category,
  Lead,
  LeadInput,
  Sector,
  Vendor,
  VendorFilter,
  VendorStatus,
  VendorSubmissionInput,
} from "./types";
import categoriesSeed from "./categories.json";
import sectorsSeed from "./sectors.json";
import vendorsSeed from "./vendors.json";

export interface DataRepository {
  listVendors(filter?: VendorFilter): Promise<Vendor[]>;
  getVendor(slug: string): Promise<Vendor | null>;
  countVendors(filter?: VendorFilter): Promise<number>;

  listCategories(): Promise<Category[]>;
  getCategory(slug: string): Promise<Category | null>;

  listSectors(): Promise<Sector[]>;
  getSector(slug: string): Promise<Sector | null>;

  /** Public vendor submission form -> pending review queue (SRS 4.6). */
  createVendorSubmission(
    input: VendorSubmissionInput,
  ): Promise<{ id: string }>;
  listPendingVendors(): Promise<Vendor[]>;
  setSubmissionStatus(
    id: string,
    status: Extract<VendorStatus, "approved" | "rejected">,
  ): Promise<void>;

  /** Lead capture from the checker, vendor profiles and contact form. */
  createLead(input: LeadInput): Promise<{ id: string }>;
}

const DATA_DIR = path.join(process.cwd(), ".data");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJsonArray<T>(file: string): T[] {
  const full = path.join(DATA_DIR, file);
  if (!fs.existsSync(full)) return [];
  try {
    return JSON.parse(fs.readFileSync(full, "utf8")) as T[];
  } catch {
    return [];
  }
}

function writeJsonArray<T>(file: string, records: T[]) {
  ensureDataDir();
  fs.writeFileSync(
    path.join(DATA_DIR, file),
    JSON.stringify(records, null, 2) + "\n",
    "utf8",
  );
}

function appendJsonArray<T>(file: string, record: T) {
  const existing = readJsonArray<T>(file);
  existing.push(record);
  writeJsonArray(file, existing);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function id(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function matchesFilter(vendor: Vendor, filter?: VendorFilter): boolean {
  if (!filter) return vendor.status === "approved";
  const status = filter.status ?? "approved";
  if (status !== "any" && vendor.status !== status) return false;
  if (filter.category && !vendor.categories.includes(filter.category))
    return false;
  if (filter.framework && !vendor.frameworks.includes(filter.framework))
    return false;
  if (filter.sector && !vendor.sectors.includes(filter.sector)) return false;
  if (
    filter.region &&
    !vendor.regions.some(
      (region) => region.toLowerCase() === filter.region!.toLowerCase(),
    )
  )
    return false;
  return true;
}

export class LocalRepository implements DataRepository {
  private allVendors(): Vendor[] {
    // Seed vendors plus any approved locally (e.g. promoted from a submission).
    const local = readJsonArray<Vendor>("vendors.local.json");
    return [...(vendorsSeed as Vendor[]), ...local];
  }

  async listVendors(filter?: VendorFilter): Promise<Vendor[]> {
    return this.allVendors()
      .filter((vendor) => matchesFilter(vendor, filter))
      .sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        if (a.verified !== b.verified) return a.verified ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
  }

  async getVendor(slug: string): Promise<Vendor | null> {
    return this.allVendors().find((vendor) => vendor.slug === slug) ?? null;
  }

  async countVendors(filter?: VendorFilter): Promise<number> {
    return (await this.listVendors(filter)).length;
  }

  async listCategories(): Promise<Category[]> {
    return (categoriesSeed as Category[]).slice();
  }

  async getCategory(slug: string): Promise<Category | null> {
    return (
      (categoriesSeed as Category[]).find((c) => c.slug === slug) ?? null
    );
  }

  async listSectors(): Promise<Sector[]> {
    return (sectorsSeed as Sector[]).slice();
  }

  async getSector(slug: string): Promise<Sector | null> {
    return (sectorsSeed as Sector[]).find((s) => s.slug === slug) ?? null;
  }

  async createVendorSubmission(
    input: VendorSubmissionInput,
  ): Promise<{ id: string }> {
    const submissionId = id("sub");
    const record: Vendor = {
      id: submissionId,
      name: input.name,
      slug: slugify(input.name),
      logoUrl: input.logoUrl ?? "/logos/placeholder.svg",
      description: input.description,
      websiteUrl: input.websiteUrl,
      contactEmail: input.contactEmail,
      frameworks: input.frameworks,
      sectors: input.sectors,
      categories: [],
      regions: [],
      verified: false,
      featured: false,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    appendJsonArray("vendor-submissions.local.json", record);
    // TODO(email): send confirmation email on submission (SRS 4.6).
    return { id: submissionId };
  }

  async listPendingVendors(): Promise<Vendor[]> {
    return readJsonArray<Vendor>("vendor-submissions.local.json").filter(
      (vendor) => vendor.status === "pending",
    );
  }

  async setSubmissionStatus(
    id: string,
    status: Extract<VendorStatus, "approved" | "rejected">,
  ): Promise<void> {
    const submissions = readJsonArray<Vendor>(
      "vendor-submissions.local.json",
    );
    const target = submissions.find((vendor) => vendor.id === id);
    if (!target) return;
    target.status = status;
    writeJsonArray("vendor-submissions.local.json", submissions);

    if (status === "approved") {
      const approved = readJsonArray<Vendor>("vendors.local.json");
      if (!approved.some((vendor) => vendor.id === id)) {
        approved.push({ ...target, status: "approved" });
        writeJsonArray("vendors.local.json", approved);
      }
    }
  }

  async createLead(input: LeadInput): Promise<{ id: string }> {
    const leadId = id("lead");
    const record: Lead = {
      ...input,
      id: leadId,
      createdAt: new Date().toISOString(),
    };
    appendJsonArray("leads.local.json", record);
    // TODO(email): notify the operator / route to matched vendors (SRS 4.2).
    return { id: leadId };
  }
}
