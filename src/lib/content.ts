/**
 * File-based content loader for framework explainers and blog posts.
 *
 * Content lives as markdown with YAML frontmatter under `src/content`. This is
 * deliberately not part of the `DataRepository` - per the SRS, framework and
 * blog content is founder-authored and committed to the repo, not stored in a
 * database.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import type { BlogHeading, BlogPost, Framework } from "@/data/types";
import { expandShortcodes } from "./blogShortcodes";

const CONTENT_DIR = path.join(process.cwd(), "src", "content");
const FRAMEWORK_DIR = path.join(CONTENT_DIR, "frameworks");
const BLOG_DIR = path.join(CONTENT_DIR, "blog");

marked.setOptions({ gfm: true, breaks: false });

function readMarkdownFiles(dir: string): { slug: string; raw: string }[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => ({
      slug: file.replace(/\.md$/, ""),
      raw: fs.readFileSync(path.join(dir, file), "utf8"),
    }));
}

function toFramework(slug: string, raw: string): Framework {
  const { data, content } = matter(raw);
  return {
    name: String(data.name ?? slug),
    slug: String(data.slug ?? slug),
    fullName: String(data.fullName ?? data.name ?? slug),
    order: Number(data.order ?? 99),
    priority: Boolean(data.priority ?? false),
    summary: String(data.summary ?? ""),
    appliesTo: (data.appliesTo as string[]) ?? [],
    penaltiesSummary: String(data.penaltiesSummary ?? ""),
    relatedSectors: (data.relatedSectors as string[]) ?? [],
    faq: (data.faq as Framework["faq"]) ?? [],
    bodyHtml: marked.parse(content, { async: false }) as string,
  };
}

export function getFrameworks(): Framework[] {
  return readMarkdownFiles(FRAMEWORK_DIR)
    .map(({ slug, raw }) => toFramework(slug, raw))
    .sort((a, b) => a.order - b.order);
}

export function getFramework(slug: string): Framework | null {
  const file = readMarkdownFiles(FRAMEWORK_DIR).find((f) => f.slug === slug);
  return file ? toFramework(file.slug, file.raw) : null;
}

function headingSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Add stable ids to h2/h3 in rendered HTML and collect them for a TOC. */
function withHeadingAnchors(html: string): {
  html: string;
  headings: BlogHeading[];
} {
  const headings: BlogHeading[] = [];
  const used = new Set<string>();
  const out = html.replace(
    /<(h[23])>([\s\S]*?)<\/\1>/g,
    (_whole, tag: "h2" | "h3", inner: string) => {
      const text = inner.replace(/<[^>]+>/g, "").trim();
      let id = headingSlug(text) || `section-${headings.length + 1}`;
      let n = 2;
      while (used.has(id)) id = `${headingSlug(text)}-${n++}`;
      used.add(id);
      headings.push({ id, text, level: tag === "h2" ? 2 : 3 });
      return `<${tag} id="${id}">${inner}</${tag}>`;
    },
  );
  return { html: out, headings };
}

function toBlogPost(slug: string, raw: string): BlogPost {
  const { data, content } = matter(raw);
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const relatedFramework = data.relatedFramework
    ? String(data.relatedFramework)
    : undefined;
  const category = data.category
    ? String(data.category)
    : relatedFramework
      ? (getFramework(relatedFramework)?.name ?? "Regulation updates")
      : "Regulation updates";

  const rendered = marked.parse(expandShortcodes(content), {
    async: false,
  }) as string;
  const { html, headings } = withHeadingAnchors(rendered);

  return {
    title: String(data.title ?? slug),
    slug: String(data.slug ?? slug),
    publishedAt: String(data.publishedAt ?? ""),
    updatedAt: data.updatedAt ? String(data.updatedAt) : undefined,
    excerpt: String(data.excerpt ?? ""),
    relatedFramework,
    category,
    topics: Array.isArray(data.topics) ? data.topics.map(String) : [],
    image: data.image ? String(data.image) : undefined,
    imageAlt: data.imageAlt ? String(data.imageAlt) : undefined,
    author: data.author ? String(data.author) : undefined,
    readingMinutes: Math.max(1, Math.round(words / 200)),
    headings,
    bodyHtml: html,
  };
}

export function getBlogPosts(): BlogPost[] {
  return readMarkdownFiles(BLOG_DIR)
    .map(({ slug, raw }) => toBlogPost(slug, raw))
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getBlogPost(slug: string): BlogPost | null {
  const file = readMarkdownFiles(BLOG_DIR).find((f) => f.slug === slug);
  return file ? toBlogPost(file.slug, file.raw) : null;
}
