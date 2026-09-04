/** Global site configuration and navigation. */

export const site = {
  name: "UAE Data Compliance",
  shortName: "UAE Data Compliance",
  domain: "uaedatacompliance.com",
  tagline:
    "Understand which UAE data laws apply to you, and find the vendors who can help.",
  description:
    "A directory and plain-English guide to UAE data protection and residency law - PDPL, TDRA/CCRF, NESA, DESC, CBUAE and health data rules - with a free compliance checker and a verified vendor directory.",
  get url(): string {
    return process.env.NEXT_PUBLIC_SITE_URL ?? `https://${this.domain}`;
  },
} as const;

export const primaryNav: { label: string; href: string }[] = [
  { label: "Frameworks", href: "/frameworks" },
  { label: "Directory", href: "/directory" },
  { label: "Compliance Checker", href: "/checker" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
];

export const footerLinks: {
  heading: string;
  links: { label: string; href: string }[];
}[] = [
  {
    heading: "Frameworks",
    links: [
      { label: "PDPL", href: "/frameworks/pdpl" },
      { label: "TDRA / CCRF", href: "/frameworks/tdra-ccrf" },
      { label: "NESA / IA Standards", href: "/frameworks/nesa" },
      { label: "DESC / ISR", href: "/frameworks/desc" },
      { label: "CBUAE", href: "/frameworks/cbuae" },
      { label: "Health data (MOHAP)", href: "/frameworks/mohap" },
    ],
  },
  {
    heading: "Directory",
    links: [
      { label: "All vendors", href: "/directory" },
      { label: "PDPL consultants", href: "/directory/pdpl-consultants" },
      { label: "GRC & DPO services", href: "/directory/grc-dpo-services" },
      { label: "UAE data centers", href: "/directory/uae-data-centers" },
      { label: "Submit your company", href: "/vendors/submit" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
    ],
  },
];
