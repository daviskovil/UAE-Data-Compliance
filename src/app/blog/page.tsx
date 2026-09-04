import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getBlogPosts, getFrameworks } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Regulation updates",
  description:
    "Short, practical notes on changes to UAE data protection and residency law.",
  path: "/blog",
});

function formatDate(value: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
}

export default function BlogIndexPage() {
  const posts = getBlogPosts();
  const frameworks = getFrameworks();

  return (
    <Container className="py-14">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-ink">
          Regulation updates
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted">
          Practical notes on how UAE data law is changing and what it means for
          businesses. Posts are written by the site operator.
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {posts.length === 0 ? (
          <p className="text-sm text-muted">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <Card key={post.slug} interactive className="p-6">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                <time>{formatDate(post.publishedAt)}</time>
                {post.relatedFramework ? (
                  <Badge tone="brand">
                    {frameworks.find((f) => f.slug === post.relatedFramework)
                      ?.name ?? post.relatedFramework.toUpperCase()}
                  </Badge>
                ) : null}
              </div>
              <h2 className="mt-2 text-lg font-semibold text-ink">
                <Link
                  href={`/blog/${post.slug}`}
                  className="hover:text-brand-700"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {post.excerpt}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-3 inline-block text-sm font-semibold text-brand-700 hover:text-brand-800"
              >
                Read &rarr;
              </Link>
            </Card>
          ))
        )}
      </div>
    </Container>
  );
}
