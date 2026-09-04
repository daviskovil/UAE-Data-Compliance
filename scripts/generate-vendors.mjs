// Batch generator for placeholder vendor seed data.
//
// Produces clearly-fictional sample vendors (all flagged sample: true,
// example.com contact details) spread across every category, framework,
// sector and emirate. Designed to be run in four batches of 25 so each
// batch can be reviewed before the next:
//
//   node scripts/generate-vendors.mjs --batch=1
//   node scripts/generate-vendors.mjs --batch=2
//   node scripts/generate-vendors.mjs --batch=3
//   node scripts/generate-vendors.mjs --batch=4
//
// Each run appends only that batch's 25 vendors to src/data/vendors.json
// (skipping anything already present). The full per-category list is
// regenerated deterministically every run (seeded PRNG) and then sliced by
// batch, so re-running an earlier batch is a safe no-op and batches never
// collide or duplicate.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "..", "src", "data", "vendors.json");

const batchArg = process.argv.find((a) => a.startsWith("--batch="));
const BATCH = batchArg ? parseInt(batchArg.split("=")[1], 10) : 1;
if (![1, 2, 3, 4].includes(BATCH)) {
  throw new Error("Pass --batch=1|2|3|4");
}

// --- deterministic PRNG (mulberry32) so every run is reproducible ---
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PREFIXES = [
  "Desert", "Gulf", "Falcon", "Oasis", "Marina", "Dune", "Coral",
  "Zenith", "Meridian", "Sandstone", "Horizon", "Crescent", "Pearl", "Beacon",
  "Atlas", "Compass", "Summit", "Nimbus", "Vantage", "Bridgeway", "Lighthouse",
  "Anchor", "Keystone", "Silverline", "Ironclad", "Bluewave", "Skyline",
  "Metro", "Union", "Apex", "Cedar", "Fortress", "Sentinel", "Vertex",
  "Insight", "Clarity", "Trustline", "Guardian", "Harbor", "Baseline",
  "Cornerstone", "Northstar", "Solace", "Prime", "Nexus", "Meadow", "Highline",
  "Redline", "Bluepeak", "Greenfield", "Silverpoint", "Ridgeline", "Crossgate",
  "Fieldstone", "Brightline", "Clearwater", "Westgate", "Eastport",
  "Southbridge", "Palm", "Amber", "Onyx", "Quartz", "Cobalt", "Ember",
  "Lantern", "Foundry", "Wavecrest", "Northshore", "Redwood", "Slate",
  "Copperline", "Tidewater", "Everline", "Brightpoint", "Ridgecrest",
];

// Per-category target counts (sum 100) and how each splits across the four
// batches of 25 (columns sum to 25, rows sum to the category target).
const CATEGORY_PROFILES = {
  "pdpl-consultants": {
    target: 17,
    batchCounts: [5, 4, 4, 4],
    suffixes: [
      "Privacy Advisors", "Data Protection Partners", "Privacy Consulting",
      "Data Governance Group", "Privacy Solutions", "Compliance Partners",
      "Data Rights Advisory", "Privacy Practice",
    ],
    frameworkPool: ["pdpl", "cbuae", "mohap", "nesa"],
    frameworkCore: ["pdpl"],
    sectorPool: ["general-sme", "finance", "healthcare", "government"],
  },
  "grc-dpo-services": {
    target: 17,
    batchCounts: [4, 5, 4, 4],
    suffixes: [
      "GRC Partners", "Risk & Compliance", "DPO Services",
      "Governance Advisors", "Assurance Group", "Risk Advisory",
      "Compliance Office", "Governance Partners",
    ],
    frameworkPool: ["pdpl", "nesa", "desc", "cbuae"],
    frameworkCore: ["pdpl"],
    sectorPool: ["general-sme", "government", "finance", "healthcare"],
  },
  "uae-data-centers": {
    target: 17,
    batchCounts: [4, 4, 5, 4],
    suffixes: [
      "Data Centers", "Cloud Services", "Digital Infrastructure",
      "Cloud Systems", "Hosting Solutions", "Cloud Partners",
      "Colocation Group", "Cloud Infrastructure",
    ],
    frameworkPool: ["tdra-ccrf", "cbuae", "mohap", "nesa"],
    frameworkCore: ["tdra-ccrf"],
    sectorPool: ["finance", "healthcare", "government", "general-sme"],
  },
  "healthcare-data-compliance": {
    target: 17,
    batchCounts: [4, 4, 4, 5],
    suffixes: [
      "Health Compliance", "MedData Advisors", "Healthcare Privacy",
      "Clinical Data Solutions", "Health Data Partners", "Health Governance",
    ],
    frameworkPool: ["mohap", "pdpl"],
    frameworkCore: ["mohap"],
    sectorPool: ["healthcare"],
  },
  "finance-cbuae-compliance": {
    target: 16,
    batchCounts: [4, 4, 4, 4],
    suffixes: [
      "Financial Compliance", "Banking Advisors", "FinReg Partners",
      "Capital Compliance", "Financial Risk Advisors", "Banking Governance",
    ],
    frameworkPool: ["cbuae", "pdpl"],
    frameworkCore: ["cbuae"],
    sectorPool: ["finance"],
  },
  "law-firms-data-protection": {
    target: 16,
    batchCounts: [4, 4, 4, 4],
    suffixes: [
      "Law Firm", "Legal Advisors", "& Co Advocates", "Legal Consultants",
      "& Partners LLP", "Legal Practice",
    ],
    frameworkPool: ["pdpl", "cbuae", "mohap"],
    frameworkCore: ["pdpl"],
    sectorPool: ["general-sme", "finance", "healthcare", "government"],
  },
};

const REGIONS = [
  "Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah",
  "Umm Al Quwain", "Remote / UAE-wide",
];

// Singular, grammatically-safe noun per category (avoids "a ... partners"
// style mismatches from pluralised firm-type suffixes like "Advisors").
const CATEGORY_NOUN = {
  "pdpl-consultants": "PDPL consultancy",
  "grc-dpo-services": "GRC and DPO services provider",
  "uae-data-centers": "UAE data centre and cloud provider",
  "healthcare-data-compliance": "healthcare data compliance specialist",
  "finance-cbuae-compliance": "financial compliance advisor",
  "law-firms-data-protection": "law firm",
};

const DESCRIPTION_TEMPLATES = [
  "Sample listing. A {categoryNoun} working with {sectorText} on {frameworkText} compliance.",
  "Sample listing. Helps {sectorText} meet {frameworkText} obligations end to end.",
  "Sample listing. A UAE-based {categoryNoun} focused on {frameworkText} readiness for {sectorText}.",
  "Sample listing. Runs practical {frameworkText} programmes for {sectorText}.",
];

const SECTOR_LABELS = {
  "general-sme": "general SMEs",
  finance: "financial institutions",
  healthcare: "healthcare providers",
  government: "government-adjacent organisations",
};

const FRAMEWORK_LABELS = {
  pdpl: "PDPL",
  "tdra-ccrf": "TDRA/CCRF",
  nesa: "NESA",
  desc: "DESC",
  cbuae: "CBUAE",
  mohap: "MOHAP",
};

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function daysAgoIso(rngFn, maxDays) {
  const d = new Date("2026-09-04T00:00:00Z");
  d.setUTCDate(d.getUTCDate() - Math.floor(rngFn() * maxDays + 1));
  return d.toISOString().slice(0, 10);
}

function generateFullCategory(categorySlug, profile, globalUsedSlugs) {
  // Seed is derived only from the category name, so the full deterministic
  // list for a category never shifts based on batch number or run order.
  let seed = 0;
  for (const ch of categorySlug) seed = (seed * 31 + ch.charCodeAt(0)) | 0;
  const rng = mulberry32(seed);
  const pick = (arr) => arr[Math.floor(rng() * arr.length)];
  const pickSome = (arr, min, max) => {
    const n = Math.min(arr.length, min + Math.floor(rng() * (max - min + 1)));
    const pool = [...arr];
    const out = [];
    for (let i = 0; i < n; i++) {
      out.push(pool.splice(Math.floor(rng() * pool.length), 1)[0]);
    }
    return out;
  };

  const usedPrefixes = new Set();
  const out = [];
  for (let i = 0; i < profile.target; i++) {
    let prefix = pick(PREFIXES);
    let guard = 0;
    while (usedPrefixes.has(prefix) && guard++ < 80) prefix = pick(PREFIXES);
    usedPrefixes.add(prefix);

    const suffix = pick(profile.suffixes);
    const name = `${prefix} ${suffix}`;
    let slug = slugify(name);
    let n = 2;
    while (globalUsedSlugs.has(slug)) slug = `${slugify(name)}-${n++}`;
    globalUsedSlugs.add(slug);

    const extraFrameworks = pickSome(
      profile.frameworkPool.filter((f) => !profile.frameworkCore.includes(f)),
      0,
      2,
    );
    const frameworks = [...new Set([...profile.frameworkCore, ...extraFrameworks])];
    const sectors = pickSome(profile.sectorPool, 1, Math.min(2, profile.sectorPool.length));
    const regions = pickSome(REGIONS, 1, 2);

    const sectorText = sectors.map((s) => SECTOR_LABELS[s]).join(" and ");
    const frameworkText = frameworks.map((f) => FRAMEWORK_LABELS[f]).join("/");
    const template = pick(DESCRIPTION_TEMPLATES);
    const description = template
      .replace(/{categoryNoun}/g, CATEGORY_NOUN[categorySlug])
      .replace("{sectorText}", sectorText)
      .replace(/{frameworkText}/g, frameworkText);

    out.push({
      id: `v-${slug}`,
      name,
      slug,
      sample: true,
      logoUrl: "/logos/placeholder.svg",
      description,
      websiteUrl: `https://${slug}.example.com`,
      contactEmail: `hello@${slug}.example.com`,
      frameworks,
      sectors,
      categories: [categorySlug],
      regions,
      verified: rng() < 0.38,
      featured: false,
      status: "approved",
      createdAt: daysAgoIso(rng, 220),
    });
  }
  return out;
}

const existing = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
const existingSlugs = new Set(existing.map((v) => v.slug));
const globalUsedSlugs = new Set(existingSlugs);

const batchEntries = [];
for (const [categorySlug, profile] of Object.entries(CATEGORY_PROFILES)) {
  const full = generateFullCategory(categorySlug, profile, globalUsedSlugs);
  const counts = profile.batchCounts;
  const start = counts.slice(0, BATCH - 1).reduce((a, b) => a + b, 0);
  const end = start + counts[BATCH - 1];
  batchEntries.push(...full.slice(start, end));
}

const newOnes = batchEntries.filter((v) => !existingSlugs.has(v.slug));
const merged = [...existing, ...newOnes];

fs.writeFileSync(DATA_FILE, JSON.stringify(merged, null, 2) + "\n", "utf8");

console.log(
  `Batch ${BATCH}: added ${newOnes.length} vendors (requested ${batchEntries.length}). ` +
  `Total vendors now: ${merged.length}.`,
);
const byCategory = {};
for (const v of newOnes) {
  for (const c of v.categories) byCategory[c] = (byCategory[c] ?? 0) + 1;
}
console.log("New in this batch by category:", byCategory);
