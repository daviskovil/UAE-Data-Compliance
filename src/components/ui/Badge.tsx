import type { ReactNode } from "react";

type Tone = "brand" | "mint" | "neutral" | "accent";

const tones: Record<Tone, string> = {
  brand: "bg-brand-50 text-brand-700 ring-brand-100",
  mint: "bg-mint-50 text-mint-700 ring-mint-100",
  neutral: "bg-canvas text-muted ring-line",
  accent: "bg-accent-500/10 text-accent-600 ring-accent-500/20",
};

export function Badge({
  tone = "neutral",
  className = "",
  children,
}: {
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function VerifiedBadge() {
  return (
    <Badge tone="mint">
      <svg
        viewBox="0 0 20 20"
        aria-hidden="true"
        className="h-3.5 w-3.5 fill-current"
      >
        <path d="M10 1.5l2.2 1.6 2.7-.2.9 2.6 2.2 1.6-.9 2.6.9 2.6-2.2 1.6-.9 2.6-2.7-.2L10 18.5l-2.2-1.6-2.7.2-.9-2.6L2 11.1l.9-2.6L2 5.9l2.2-1.6.9-2.6 2.7.2L10 1.5zm-1 10.9l4.3-4.3-1.1-1.1L9 10.1 7.8 8.9 6.7 10 9 12.4z" />
      </svg>
      Verified
    </Badge>
  );
}
