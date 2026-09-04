"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export interface FilterGroup {
  key: string;
  label: string;
  options: { value: string; label: string; count?: number }[];
}

export function FilterSidebar({ groups }: { groups: FilterGroup[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const activeCount = groups.reduce(
    (total, group) => total + (searchParams.get(group.key) ? 1 : 0),
    0,
  );

  return (
    <aside className="lg:sticky lg:top-24">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink">Filters</h2>
        {activeCount > 0 ? (
          <button
            type="button"
            onClick={() => router.push(pathname, { scroll: false })}
            className="text-xs font-medium text-brand-700 hover:text-brand-800"
          >
            Clear all
          </button>
        ) : null}
      </div>

      <div className="mt-4 space-y-6">
        {groups.map((group) => {
          const current = searchParams.get(group.key);
          return (
            <div key={group.key}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
                {group.label}
              </h3>
              <ul className="mt-2 space-y-1">
                {group.options.map((option) => {
                  const checked = current === option.value;
                  return (
                    <li key={option.value}>
                      <button
                        type="button"
                        onClick={() => setParam(group.key, option.value)}
                        className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors ${
                          checked
                            ? "bg-brand-50 text-brand-700"
                            : "text-muted hover:bg-canvas hover:text-ink"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`grid h-4 w-4 place-items-center rounded border ${
                            checked
                              ? "border-brand-600 bg-brand-600 text-white"
                              : "border-line bg-surface"
                          }`}
                        >
                          {checked ? (
                            <svg
                              viewBox="0 0 16 16"
                              className="h-3 w-3 fill-current"
                            >
                              <path d="M6.2 11.3L3 8.1l1.1-1.1 2.1 2.1 5-5L12.3 5z" />
                            </svg>
                          ) : null}
                        </span>
                        <span className="flex-1">{option.label}</span>
                        {typeof option.count === "number" ? (
                          <span className="text-xs text-muted">
                            {option.count}
                          </span>
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
