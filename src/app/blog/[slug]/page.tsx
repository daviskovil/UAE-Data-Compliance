import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Disclaimer } from "@/components/ui/Disclaimer";
import { getBlogPost, getBlogPosts } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

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
  return pageMeta({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
  });
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

  return (
    <Container className="py-14">
      <article className="mx-auto max-w-2xl">
        <Link
          href="/blog"
          className="text-sm font-medium text-brand-700 hover:text-brand-800"
        >
          &larr; All updates
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink">
          {post.title}
        </h1>
        <p className="mt-2 text-sm text-muted">{formatDate(post.publishedAt)}</p>
        <div
          className="prose prose-slate mt-8 max-w-none prose-a:text-brand-700"
          dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
        />
        <Disclaimer className="mt-10" />
      </article>
    </Container>
  );
}
