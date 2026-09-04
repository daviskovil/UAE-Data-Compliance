# UAE Data Compliance Directory

Directory and information site that helps businesses in the UAE work out which
data protection and residency laws apply to them (PDPL, TDRA/CCRF, NESA, DESC,
CBUAE, health data law) and find vendors who can help them comply.

Full requirements: [`SRS-UAE-Data-Compliance.md`](./SRS-UAE-Data-Compliance.md).

## Status

MVP scaffold - skeleton + design system + every route from the SRS in place with
seed content. Compiles and runs. See **What's stubbed** below.

## Stack

- **Next.js 15** (App Router, RSC, server actions) + **React 19** + TypeScript
- **Tailwind CSS v4** - design tokens in [`src/app/globals.css`](./src/app/globals.css)
  (`@theme`), Capterra-inspired but lighter
- **Content**: markdown + frontmatter in [`src/content`](./src/content), loaded
  via [`src/lib/content.ts`](./src/lib/content.ts)
- **Data**: swappable `DataRepository` ([`src/data/repository.ts`](./src/data/repository.ts)).
  Current impl is `LocalRepository` - JSON seed data + local JSON files for
  writes (`.data/`, gitignored). Swap the singleton in
  [`src/data/index.ts`](./src/data/index.ts) for a Supabase implementation later.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck  # tsc --noEmit
npm run lint
```

No environment variables are required for the scaffold. Copy `.env.example` to
`.env.local` when wiring real services.

## Routes

| Route | Notes |
| --- | --- |
| `/` | Homepage - hero, trust bar, sector/framework shortcuts, how-it-works |
| `/frameworks` + `/frameworks/[slug]` | Explainers from markdown, FAQ + FAQ schema, related vendors |
| `/checker` + `/checker/result` | Multi-step questionnaire -> matched frameworks + vendors (`src/lib/checker.ts`) |
| `/directory` + `/directory/[category]` | Category cards + filter sidebar (framework / sector / region) + vendor grid |
| `/vendors/[slug]` | Vendor profile + inquiry form |
| `/vendors/submit` | Public submission form -> pending queue |
| `/admin` | Minimal password gate; approve/reject pending submissions |
| `/blog` + `/blog/[slug]` | Markdown posts |
| `/about` `/contact` `/privacy` `/terms` | Static pages (privacy/terms are drafts) |
| `/sitemap.xml` `/robots.txt` | Generated |

## What's stubbed / next

- **Content is placeholder.** Framework explainers, blog posts and the
  privacy/terms pages are marked draft and need founder-authored copy before
  launch (SRS section 11).
- **Vendor seed data is fictional** (`sample: true`). Replace with the 15-20
  real launch vendors.
- **No real persistence.** Submissions and leads append to `.data/*.local.json`.
  Move to Supabase via a new `DataRepository` implementation.
- **No email.** Submission confirmations and lead routing are `TODO(email)` in
  `src/data/repository.ts` / `src/app/actions.ts`.
- **Admin auth is a single shared password** in a cookie - fine for MVP, not
  beyond.
- **Logo upload** is not implemented (needs file storage).
- Phase 2+ items (Stripe featured listings, reviews, Arabic, comparison pages)
  are out of scope per the SRS.
