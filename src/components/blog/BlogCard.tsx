import Link from "next/link";
import { BlogCover } from "./BlogCover";
import type { BlogPost } from "@/data/types";

export function BlogCard({ post }: { post: BlogPost }) {
  const href = `/blog/${post.slug}`;
  return (
    <article className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] bg-surface shadow-[var(--shadow-card)] transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]">
      <Link href={href} aria-label={post.title}>
        <BlogCover
          post={post}
          aspectClass="aspect-[16/9]"
          imgClassName="object-cover object-[78%_center]"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-500">
          {post.category}
        </span>
        <h3 className="mt-2 text-base font-bold leading-snug text-ink">
          <Link href={href} className="hover:text-brand-700">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted">
          {post.excerpt}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted">
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="1.5">
              <circle cx="8" cy="8" r="6" />
              <path d="M8 4.5V8l2.5 1.5" strokeLinecap="round" />
            </svg>
            {post.readingMinutes} min read
          </span>
          <Link
            href={href}
            className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent-500 hover:text-accent-600"
          >
            Read article &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}
