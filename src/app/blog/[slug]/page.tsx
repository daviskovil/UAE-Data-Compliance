import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { ButtonLink } from "@/components/ui/Button";
import { BlogCover } from "@/components/blog/BlogCover";
import { getBlogPost, getBlogPosts, getFrameworks } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return pageMeta({ title: "Post not found" });

  const base = pageMeta({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
  });

  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: post.publishedAt || undefined,
      modifiedTime: post.updatedAt || post.publishedAt || undefined,
      authors: post.author ? [post.author] : undefined,
    },
  };
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const framework = post.relatedFramework
    ? getFrameworks().find((f) => f.slug === post.relatedFramework)
    : undefined;

  const tocHeadings = post.headings.filter((h) => h.level === 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt || undefined,
    dateModified: post.updatedAt || post.publishedAt || undefined,
    author: {
      "@type": "Organization",
      name: post.author || site.name,
    },
    publisher: { "@type": "Organization", name: site.name },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
    image: post.image ? `${site.url}${post.image}` : undefined,
  };

  return (
    <Container className="py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-3xl">
        <nav className="text-sm text-muted">
          <Link href="/" className="hover:text-brand-700">
            Home
          </Link>
          <span className="mx-1.5">/</span>
          <Link href="/blog" className="hover:text-brand-700">
            Blog
          </Link>
          <span className="mx-1.5">/</span>
          <span className="text-ink">{post.category}</span>
        </nav>

        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-500">
          {post.category}
        </p>
        <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 text-sm text-muted">
          {post.author ? `${post.author} · ` : ""}
          {formatDate(post.publishedAt)}
          {post.updatedAt && post.updatedAt !== post.publishedAt
            ? ` · updated ${formatDate(post.updatedAt)}`
            : ""}
          {" · "}
          {post.readingMinutes} min read
        </p>
      </div>

      {post.image ? (
        <div className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-[var(--radius-card)] shadow-[var(--shadow-card)]">
          <BlogCover post={post} priority aspectClass="aspect-[1200/630]" />
        </div>
      ) : null}

      <div className="mx-auto mt-10 grid max-w-3xl gap-12 lg:max-w-5xl lg:grid-cols-[1fr_15rem]">
        <article className="min-w-0">
          <div
            className="prose prose-slate max-w-none prose-headings:scroll-mt-24 prose-headings:tracking-tight prose-h2:mt-10 prose-h2:text-xl prose-h3:text-base prose-a:font-medium prose-a:text-brand-700 hover:prose-a:text-brand-800 prose-strong:text-ink prose-blockquote:border-l-brand-300 prose-blockquote:bg-brand-50/60 prose-blockquote:py-1 prose-blockquote:not-italic prose-blockquote:text-muted [&_hr]:mx-auto [&_hr]:my-12 [&_hr]:w-16 [&_hr]:border-t-2 [&_hr]:border-brand-100 [&_li]:my-1"
            dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
          />

          <div className="mt-12 rounded-[var(--radius-card)] bg-ink p-6 text-white sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-200">
              Put this into practice
            </p>
            <h2 className="mt-2 text-xl font-bold text-white">
              See which frameworks apply to your business
            </h2>
            <p className="mt-2 max-w-xl text-sm text-white/70">
              The free checker takes about a minute and maps you to the UAE data
              laws that likely apply - then shortlists vendors who can help.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <ButtonLink href="/checker" variant="primary" size="md">
                Run the compliance checker
              </ButtonLink>
              <ButtonLink
                href="/directory"
                variant="outline"
                size="md"
                className="!bg-transparent !text-white ring-1 ring-inset ring-white/25 hover:!text-white hover:ring-white/50"
              >
                Browse the directory
              </ButtonLink>
            </div>
          </div>

          {framework ? (
            <p className="mt-8 text-sm text-muted">
              Related framework:{" "}
              <Link
                href={`/frameworks/${framework.slug}`}
                className="font-medium text-brand-700 hover:text-brand-800"
              >
                {framework.name} - {framework.fullName}
              </Link>
            </p>
          ) : null}

          <Disclaimer className="mt-6" />

          <div className="mt-10">
            <Link
              href="/blog"
              className="text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              &larr; All articles
            </Link>
          </div>
        </article>

        {tocHeadings.length > 2 ? (
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                On this page
              </p>
              <ul className="mt-3 space-y-2 border-l border-line">
                {tocHeadings.map((h) => (
                  <li key={h.id}>
                    <a
                      href={`#${h.id}`}
                      className="-ml-px block border-l-2 border-transparent pl-3 text-sm leading-snug text-muted hover:border-brand-400 hover:text-ink"
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        ) : null}
      </div>
    </Container>
  );
}
