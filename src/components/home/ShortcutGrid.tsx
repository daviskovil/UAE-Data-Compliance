import Link from "next/link";

export interface Shortcut {
  label: string;
  href: string;
  description?: string;
}

export function ShortcutGrid({ items }: { items: Shortcut[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="group flex flex-col gap-1 rounded-[var(--radius-card)] border border-line bg-surface p-5 shadow-[var(--shadow-card)] transition-transform transition-shadow hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"
        >
          <span className="flex items-center justify-between text-sm font-semibold text-ink">
            {item.label}
            <span className="text-muted transition-transform group-hover:translate-x-0.5">
              &rarr;
            </span>
          </span>
          {item.description ? (
            <span className="text-sm text-muted">{item.description}</span>
          ) : null}
        </Link>
      ))}
    </div>
  );
}
