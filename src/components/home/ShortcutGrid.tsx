import Link from "next/link";

export interface Shortcut {
  label: string;
  href: string;
  description?: string;
}

export function ShortcutGrid({ items }: { items: Shortcut[] }) {
  return (
    <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="group flex flex-col gap-2 rounded-[var(--radius-card)] bg-surface p-6 shadow-[var(--shadow-card)] transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
        >
          <span className="flex items-center justify-between gap-3">
            <span className="text-[15px] font-bold text-ink">{item.label}</span>
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
              <svg
                viewBox="0 0 20 20"
                className="h-3.5 w-3.5 fill-none stroke-current"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 4l6 6-6 6" />
              </svg>
            </span>
          </span>
          {item.description ? (
            <span className="text-sm leading-relaxed text-muted">
              {item.description}
            </span>
          ) : null}
        </Link>
      ))}
    </div>
  );
}
