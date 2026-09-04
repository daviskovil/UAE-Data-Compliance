/**
 * Lightweight shortcodes for blog markdown.
 *
 * Authors drop a token on its own line, e.g.
 *
 *   [[cta:checker]]
 *
 * and it is expanded to a static, styled HTML banner before the markdown is
 * parsed. The markup is plain HTML + Tailwind classes (this file is scanned
 * by Tailwind), so no client hydration is needed.
 */

const button = (href: string, label: string) =>
  `<a href="${href}" class="mt-4 inline-flex items-center gap-2 rounded-[var(--radius-btn)] bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white no-underline shadow-[0_6px_16px_-6px_rgba(0,132,61,0.5)] transition-colors hover:bg-brand-700">${label}<span aria-hidden="true">&rarr;</span></a>`;

const banner = (opts: {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  label: string;
  tone?: "green" | "dark";
}) => {
  const dark = opts.tone === "dark";
  const wrap = dark
    ? "bg-ink text-white"
    : "bg-brand-50 ring-1 ring-inset ring-brand-100";
  const eyebrow = dark ? "text-brand-200" : "text-brand-700";
  const title = dark ? "text-white" : "text-ink";
  const body = dark ? "text-white/70" : "text-muted";
  return `<div class="not-prose my-10 rounded-[var(--radius-card)] ${wrap} p-6 sm:p-7">
<p class="text-[11px] font-semibold uppercase tracking-[0.14em] ${eyebrow}">${opts.eyebrow}</p>
<p class="mt-2 text-lg font-bold ${title}">${opts.title}</p>
<p class="mt-1 text-sm leading-relaxed ${body}">${opts.body}</p>
${button(opts.href, opts.label)}
</div>`;
};

const SHORTCODES: Record<string, string> = {
  "cta:checker": banner({
    eyebrow: "Free tool",
    title: "Not sure which UAE data laws apply to you?",
    body: "Answer four questions and get a plain-English read on which frameworks likely apply to your business - no sign-up.",
    href: "/checker",
    label: "Run the compliance checker",
  }),
  "cta:pdpl-consultants": banner({
    eyebrow: "Get help",
    title: "Need a hand getting PDPL-ready?",
    body: "Compare verified UAE consultants, GRC firms and outsourced DPOs who do this work day to day.",
    href: "/directory/pdpl-consultants",
    label: "Browse PDPL consultants",
  }),
  "cta:directory": banner({
    eyebrow: "Directory",
    title: "Find a vendor who can help",
    body: "Filter UAE data compliance vendors by framework, sector and emirate.",
    href: "/directory",
    label: "Open the directory",
  }),
  "cta:framework-pdpl": banner({
    eyebrow: "Reference",
    title: "The PDPL at a glance",
    body: "A shorter summary of who the PDPL applies to, the core obligations and the penalties.",
    href: "/frameworks/pdpl",
    label: "Read the PDPL explainer",
    tone: "dark",
  }),
};

export function expandShortcodes(markdown: string): string {
  return markdown.replace(
    /^[ \t]*\[\[([a-z0-9:-]+)\]\][ \t]*$/gim,
    (whole, name: string) => SHORTCODES[name] ?? whole,
  );
}
