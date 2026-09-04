import { Suspense } from "react";
import Link from "next/link";
import { BlogSearch } from "./BlogSearch";

export interface CategoryCount {
  name: string;
  count: number;
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[var(--radius-card)] bg-surface p-5 shadow-[var(--shadow-card)]">
      <h2 className="text-sm font-bold text-ink">{title}</h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export function BlogSidebar({
  categories,
  topics,
  total,
  activeCategory,
  activeTopic,
}: {
  categories: CategoryCount[];
  topics: string[];
  total: number;
  activeCategory?: string;
  activeTopic?: string;
}) {
  const rows = [{ name: "All articles", count: total }, ...categories];

  return (
    <div className="space-y-5 lg:sticky lg:top-24">
      <Suspense
        fallback={
          <div className="h-10 rounded-lg border border-line bg-surface" />
        }
      >
        <BlogSearch />
      </Suspense>

      <Panel title="Categories">
        <ul className="-mx-2">
          {rows.map((row) => {
            const isAll = row.name === "All articles";
            const active = isAll ? !activeCategory : activeCategory === row.name;
            const href = isAll
              ? "/blog"
              : `/blog?category=${encodeURIComponent(row.name)}`;
            return (
              <li key={row.name}>
                <Link
                  href={href}
                  className={`flex items-center justify-between rounded-lg px-2 py-1.5 text-sm transition-colors ${
                    active
                      ? "bg-brand-50 font-semibold text-brand-700"
                      : "text-muted hover:bg-canvas hover:text-ink"
                  }`}
                >
                  <span>{row.name}</span>
                  <span
                    className={`text-xs ${active ? "text-brand-600" : "text-muted"}`}
                  >
                    {row.count}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Panel>

      {topics.length > 0 ? (
        <Panel title="Topics">
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => {
              const active = activeTopic === topic;
              return (
                <Link
                  key={topic}
                  href={
                    active ? "/blog" : `/blog?topic=${encodeURIComponent(topic)}`
                  }
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    active
                      ? "bg-brand-600 text-white"
                      : "bg-canvas text-muted ring-1 ring-inset ring-line hover:text-ink"
                  }`}
                >
                  {topic}
                </Link>
              );
            })}
          </div>
        </Panel>
      ) : null}
    </div>
  );
}
