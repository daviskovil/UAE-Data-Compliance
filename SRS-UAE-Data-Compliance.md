# Software Requirements Specification
## UAE Data Compliance Directory

**Domain:** uaedatacompliance.com
**Repository name:** uae-data-compliance
**Version:** 1.0 (MVP)
**Prepared for:** Claude Code project scaffolding

---

## 1. Project Overview

### 1.1 What this is
A directory and information website that helps businesses operating in or entering the UAE understand which data protection and residency laws apply to them, and connects them with verified vendors (compliance consultants, GRC firms, cloud/data-center providers, DPO-as-a-service providers) who can help them comply.

### 1.2 Positioning
"The place UAE businesses go to understand which data laws apply to them, and find the vendors who can help — verified, compared, no guesswork."

### 1.3 Business model
The site is a **media / lead-generation business**, not a services or consulting business. It never implements, deploys, or advises on compliance directly. It:
- Publishes plain-English explainers of UAE data compliance frameworks
- Offers a free interactive tool that tells a visitor which frameworks likely apply to their business
- Lists vendors who provide compliance services, free and paid (featured) tiers
- Generates revenue via featured vendor listings and/or per-lead fees

### 1.4 Target market
- Primary: UAE-based SMEs, startups, and enterprises needing to understand PDPL, sector-specific, and data-residency obligations
- Secondary: vendors (compliance consultants, GRC firms, cloud providers, law firms, DPO consultants) seeking visibility to this audience

### 1.5 Reference UI/UX
Visual and UX direction should draw from **Capterra (capterra.com)**:
- Card-based vendor listings with logo, name, short description, tags, CTA button
- Left-hand filter sidebar (category, service type, region)
- Clean category landing pages with a hero + filter + grid of listings
- Comparison-friendly layout for vendor profiles
- Friendly, approachable, not overly enterprise/cold — lean lighter/cleaner than Capterra's density, since this is a smaller, more focused directory, not a mega-marketplace

---

## 2. Goals & Success Metrics

| Goal | MVP target |
|---|---|
| Vendor listings live at launch | 15–20 (free tier) |
| Organic traffic within 3 months | Ranking for primary framework terms (PDPL, TDRA CCRF, NESA, etc.) |
| Monetization | First paid "featured" listing conversion |
| Revenue target | $1,000/month recurring (steady-state goal, not immediate) |

---

## 3. Scope

### 3.1 In scope (MVP)
- Homepage
- Compliance Checker tool (interactive questionnaire)
- Framework explainer pages (5–6 pages: PDPL, TDRA/CCRF, NESA, DESC, CBUAE, MOHAP)
- Vendor directory with category pages
- Individual vendor profile pages
- Vendor submission form (free listing signup)
- Basic admin approval workflow for new vendor submissions
- Static pages: About, Contact, Privacy Policy, Terms of Use
- Blog / regulation-update feed (structure only; content ongoing)
- Basic SEO infrastructure (sitemap, meta tags, structured data)

### 3.2 Out of scope (MVP — future phases)
- Paid listings / Stripe billing integration (Phase 2)
- User reviews/ratings of vendors (Phase 2, once real usage exists)
- Multi-language support (Arabic) (Phase 2)
- Comparison pages ("PDPL vs GDPR", "Best PDPL Consultants") (Phase 2)
- Downloadable templates/paid content products (Phase 2)
- Newsletter/email capture automation (Phase 2)
- Tender/RFP alert service (Phase 3)
- Expansion to additional GCC countries (Phase 3+)

---

## 4. Functional Requirements

### 4.1 Homepage
- Hero section: headline + subheadline stating the site's purpose
- Prominent CTA into the Compliance Checker tool (primary conversion path)
- Browse-by-sector shortcuts (Healthcare, Finance, Government, General SME)
- Browse-by-framework shortcuts (PDPL, NESA, TDRA/CCRF, DESC, CBUAE, MOHAP)
- Featured/trust-building section (e.g., "X verified vendors", "Y frameworks covered")
- Footer with vendor count, links to submission form, About, Contact, Privacy, Terms

### 4.2 Compliance Checker tool
A short multi-step questionnaire:
1. What sector are you in? (Healthcare / Finance / Government-adjacent / General SME / Other)
2. Where is your data currently hosted? (UAE / GCC / International)
3. Do you handle personal data of UAE residents? (Yes/No)
4. Company size / do you work with government contracts? (Y/N + size band)

**Output (result page):**
- Plain-English summary of which framework(s) likely apply
- Brief explanation of each applicable framework with link to full explainer page
- List of 3–5 matched/relevant vendors (pulled from directory, filtered by category tags matching the result)
- Disclaimer: "This is general information, not legal advice. Consult a licensed professional for your specific situation."
- Lead capture: optional field to request a direct introduction/quote from a matched vendor (captures visitor email + selected vendor(s), routes as a lead)

Store each completed questionnaire session (anonymized aggregate is fine for MVP; do not require login).

### 4.3 Framework explainer pages
One page per framework: PDPL, TDRA/CCRF, NESA, DESC, CBUAE, MOHAP.

Each page includes:
- What the framework is (plain English)
- Who it applies to (sector/business type)
- Key obligations
- Penalties/consequences of non-compliance
- FAQ block (3–5 Q&As, matches common search queries)
- "Vendors who help with this" section — pulls vendor listings tagged with this framework
- CTA back to the Compliance Checker tool

### 4.4 Vendor directory
- Category landing pages (e.g., "PDPL Consultants", "UAE Data Centers", "Healthcare Data Compliance", "Finance/CBUAE Compliance", "GRC/DPO Services")
- Each category page: filter sidebar (framework, sector served, region/emirate) + grid of vendor cards
- Vendor card: logo, name, one-line description, framework tags, "Verified" badge if applicable, CTA (Visit Website / View Details)

### 4.5 Vendor profile page
- Vendor name, logo, description
- Frameworks/certifications covered
- Sectors served
- Contact/inquiry CTA button
- "Verified" badge display logic (manual admin flag for MVP)

### 4.6 Vendor submission form
- Public form: company name, website, description, frameworks covered, sectors served, contact email, logo upload
- Submissions go to a pending/admin-review queue (not published automatically)
- Confirmation email on submission

### 4.7 Admin panel (basic, MVP)
- List of pending vendor submissions with Approve/Reject actions
- Ability to edit/remove existing vendor listings
- Ability to mark a vendor as "Verified"
- Simple auth (single admin user is sufficient for MVP; no multi-role needed yet)

### 4.8 Blog / regulation updates
- Simple list + detail page structure (title, date, body, optional related-framework tag)
- No CMS integration required for MVP — markdown-based posts committed to the repo are acceptable

### 4.9 Static pages
- About
- Contact (simple form or mailto)
- Privacy Policy (must clearly describe what data the Compliance Checker tool collects and how it's used/stored — important given the site's own subject matter)
- Terms of Use

---

## 5. Non-Functional Requirements

- **Mobile-first responsive design** — assume a large share of traffic will be mobile
- **Page load performance**: target sub-2s load on key pages (homepage, framework pages, category pages)
- **SEO**: clean URL structure (e.g., `/frameworks/pdpl`, `/directory/pdpl-consultants`, `/vendors/[vendor-slug]`), proper meta titles/descriptions per page, sitemap.xml, structured data (Organization + potentially FAQ schema on framework pages)
- **Country targeting**: configure for Google Search Console International Targeting → United Arab Emirates post-launch
- **Accessibility**: reasonable baseline (semantic HTML, alt text on images/logos, sufficient color contrast)
- **Security**: standard form validation/sanitization on vendor submission and lead capture forms; no storage of sensitive personal data beyond what's needed for lead routing
- **Hosting**: static/JAMstack-friendly architecture preferred for low cost and fast global delivery (India-based operator, UAE-based audience)

---

## 6. Data Model (suggested entities)

```
Vendor
- id
- name
- slug
- logo_url
- description
- website_url
- contact_email
- frameworks[] (relation to Framework)
- sectors[] (relation to Sector)
- categories[] (relation to Category)
- regions[] (emirate/region tags)
- verified (boolean)
- featured (boolean) — Phase 2
- status (pending / approved / rejected)
- created_at

Framework
- id
- name (e.g., "PDPL")
- slug
- full_name
- summary
- body_content (long-form explainer)
- penalties_summary
- faq[] (question, answer)

Category
- id
- name (e.g., "PDPL Consultants")
- slug
- description

Sector
- id
- name (e.g., "Healthcare")
- slug

Lead
- id
- source (compliance_checker / vendor_profile / contact_form)
- questionnaire_answers (json, if from Compliance Checker)
- matched_frameworks[]
- matched_vendor_ids[]
- visitor_email (optional)
- created_at

BlogPost
- id
- title
- slug
- body (markdown)
- related_framework (optional)
- published_at
```

---

## 7. Suggested Technical Stack

- **Framework**: Next.js (React) — good SEO support via SSR/SSG, widely supported by AI coding tools
- **Styling**: Tailwind CSS — fast to scaffold Capterra-like card/grid layouts
- **Database**: Supabase (Postgres) — handles vendor data, leads, admin auth with minimal setup
- **Forms**: native form handling + Supabase insert, or a lightweight form service
- **Hosting**: Vercel (pairs well with Next.js) or similar
- **CDN**: Cloudflare (free tier) for performance in UAE region regardless of hosting origin
- **Payments (Phase 2)**: Stripe, for featured-listing subscriptions
- **Analytics**: Plausible or Google Analytics (Plausible preferred for lighter weight and privacy-friendliness, which fits the site's own subject matter)

*(This stack is a recommendation; adjust to whatever Claude Code and the developer are most comfortable scaffolding quickly.)*

---

## 8. Content Requirements (initial framework pages to write)

1. PDPL (UAE Personal Data Protection Law) — priority 1, broadest applicability
2. TDRA / Cloud Computing Regulatory Framework (CCRF)
3. NESA (National Electronic Security Authority) standards
4. DESC (Dubai Electronic Security Center) — Dubai ISR
5. CBUAE (Central Bank of UAE) — financial sector data rules
6. MOHAP — healthcare data law

Each requires: plain-English summary, applicability, obligations, penalties, FAQ (see Section 4.3 structure).

---

## 9. Vendor Outreach List (initial target categories for launch)

- Compliance-focused cybersecurity/GRC consultancies with UAE presence
- DIFC/ADGM law firms with data protection advisory practices
- UAE-based data centers and TDRA-registered cloud providers
- Independent DPO-as-a-service consultants

Target: 15–20 vendors listed (free tier) before public launch, to avoid launching with an empty-looking directory.

---

## 10. Roadmap

**Phase 1 (MVP — this document)**: Core directory, Compliance Checker tool, 5–6 framework pages, free vendor listings, basic admin.

**Phase 2**: Stripe-based featured listings, comparison pages ("PDPL vs GDPR" etc.), downloadable templates/checklists as a paid product, email newsletter capture, basic vendor reviews/testimonials.

**Phase 3**: Arabic-language support, tender/RFP alert product, expansion to additional GCC frameworks (Saudi PDPL/SDAIA equivalent) as a second site or section.

---

## 11. Open Questions / Assumptions

- Assume single admin (the founder) manages vendor approvals manually at MVP scale — no need for a multi-user admin system yet.
- Assume no user accounts/login required for site visitors at MVP — the Compliance Checker and vendor directory are fully public and anonymous.
- Assume content (framework explainers, blog posts) is written by the founder/operator, not auto-generated, to preserve credibility and accuracy on a legally-adjacent topic.
- Legal disclaimer language should be reviewed before launch to ensure the site is clearly positioned as informational, not legal advice.
