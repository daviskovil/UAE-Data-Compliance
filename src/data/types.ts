/**
 * Domain types for the UAE Data Compliance Directory.
 *
 * These mirror the entities in the SRS (section 6). Content-style entities
 * (Framework, BlogPost) are sourced from markdown in `src/content` via
 * `src/lib/content.ts`. Dynamic entities (Vendor, Lead, vendor submissions)
 * go through the swappable `DataRepository` in `src/data/repository.ts`.
 */

export type FrameworkSlug =
  | "pdpl"
  | "tdra-ccrf"
  | "nesa"
  | "desc"
  | "cbuae"
  | "mohap";

export type SectorSlug =
  | "healthcare"
  | "finance"
  | "government"
  | "general-sme";

export interface FrameworkFaq {
  question: string;
  answer: string;
}

export interface Framework {
  name: string;
  slug: string;
  fullName: string;
  order: number;
  priority: boolean;
  summary: string;
  appliesTo: string[];
  penaltiesSummary: string;
  relatedSectors: string[];
  faq: FrameworkFaq[];
  /** Rendered HTML from the markdown body. */
  bodyHtml: string;
}

export interface Sector {
  id: string;
  name: string;
  slug: string;
  blurb: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export type VendorStatus = "pending" | "approved" | "rejected";

export interface Vendor {
  id: string;
  name: string;
  slug: string;
  /** Marks scaffold seed data so the UI can flag it and admin can clear it. */
  sample?: boolean;
  logoUrl: string;
  description: string;
  websiteUrl: string;
  contactEmail: string;
  frameworks: string[];
  sectors: string[];
  categories: string[];
  regions: string[];
  verified: boolean;
  /** Phase 2 (paid featured listings). */
  featured: boolean;
  status: VendorStatus;
  createdAt: string;
}

export interface VendorFilter {
  category?: string;
  framework?: string;
  sector?: string;
  region?: string;
  /** Defaults to "approved" only. */
  status?: VendorStatus | "any";
}

export interface VendorSubmissionInput {
  name: string;
  websiteUrl: string;
  description: string;
  frameworks: string[];
  sectors: string[];
  contactEmail: string;
  logoUrl?: string;
}

export type LeadSource =
  | "compliance_checker"
  | "vendor_profile"
  | "contact_form";

export interface CheckerAnswers {
  sector: SectorSlug | "other";
  hosting: "uae" | "gcc" | "international";
  handlesUaePersonalData: boolean;
  governmentContracts: boolean;
  sizeBand: "1-10" | "11-50" | "51-200" | "200+";
}

export interface LeadInput {
  source: LeadSource;
  visitorEmail?: string;
  message?: string;
  checkerAnswers?: CheckerAnswers;
  matchedFrameworks?: string[];
  matchedVendorIds?: string[];
}

export interface Lead extends LeadInput {
  id: string;
  createdAt: string;
}

export interface BlogPost {
  title: string;
  slug: string;
  publishedAt: string;
  excerpt: string;
  relatedFramework?: string;
  bodyHtml: string;
}
