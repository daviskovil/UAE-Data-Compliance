import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { BlogCard } from "@/components/blog/BlogCard";
import { BlogSidebar, type CategoryCount } from "@/components/blog/BlogSidebar";
import { getBlogPosts } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Blog",
  description:
    "Practical notes on changes to UAE data protection and residency law and what they mean for businesses.",
  path: "/blog",
});

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const category = first(sp.category);
  const topic = first(sp.topic);
  const query = (first(sp.q) ?? "").toLowerCase().trim();

  const allPosts = getBlogPosts();

  const categories: CategoryCount[] = Object.entries(
    allPosts.reduce<Record<string, number>>((acc, post) => {
      acc[post.category] = (acc[post.category] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  const topics = [...new Set(allPosts.flatMap((p) => p.topics))].sort();

  const posts = allPosts.filter((post) => {
    if (category && post.category !== category) return false;
    if (topic && !post.topics.includes(topic)) return false;
    if (query) {
      const haystack = [
        post.title,
        post.excerpt,
        post.category,
        ...post.topics,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });

  return (
    <Container className="py-10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-ink">Blog</h1>
          <p className="mt-2 text-base leading-relaxed text-muted">
            Practical notes on how UAE data law is changing and what it means
            for businesses. Written by the site operator.
          </p>
        </div>
        <nav className="text-sm text-muted">
          <Link href="/" className="hover:text-brand-700">
            Home
          </Link>
          <span className="mx-1.5">/</span>
          <span className="font-medium text-ink">Blog</span>
        </nav>
      </div>

      <p className="mt-6 text-xs font-medium uppercase tracking-wide text-muted">
        Showing {posts.length} of {allPosts.length} article
        {allPosts.length === 1 ? "" : "s"}
        {category ? ` in ${category}` : ""}
        {topic ? ` tagged ${topic}` : ""}
      </p>

      <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_19rem]">
        <div>
          {posts.length === 0 ? (
            <div className="rounded-[var(--radius-card)] border border-dashed border-line bg-surface p-10 text-center">
              <p className="text-sm text-muted">
                No articles match this filter.{" "}
                <Link href="/blog" className="font-medium text-brand-700">
                  Clear filters
                </Link>
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </div>

        <aside>
          <BlogSidebar
            categories={categories}
            topics={topics}
            total={allPosts.length}
            activeCategory={category}
            activeTopic={topic}
          />
        </aside>
      </div>
    </Container>
  );
}
