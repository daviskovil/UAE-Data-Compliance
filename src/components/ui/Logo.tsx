import Link from "next/link";

const RED = "#C8102E";
const GREEN = "#00843D";

/**
 * The UAE Data Compliance mark: a red node "X" with green connector dots -
 * a simplified vector of the supplied logo. Swap this SVG for the official
 * artwork if a clean vector file is available.
 */
export function LogoMark({
  className = "h-9 w-9",
  title = "UAE Data Compliance",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        stroke={RED}
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
      >
        <path d="M48 48 24 24" />
        <path d="M48 48 72 24" />
        <path d="M48 48 24 72" />
        <path d="M48 48 72 72" />
      </g>
      <g fill={RED}>
        <circle cx="24" cy="24" r="12" />
        <circle cx="72" cy="24" r="12" />
        <circle cx="24" cy="72" r="12" />
        <circle cx="72" cy="72" r="12" />
        <circle cx="48" cy="48" r="9" />
      </g>
      <g fill={GREEN}>
        <circle cx="48" cy="13" r="8.5" />
        <circle cx="48" cy="83" r="8.5" />
        <circle cx="13" cy="48" r="8.5" />
        <circle cx="83" cy="48" r="8.5" />
      </g>
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`flex flex-col leading-none ${className}`}>
      <span className="text-[15px] font-extrabold tracking-tight text-ink">
        UAE Data
      </span>
      <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-muted">
        Compliance
      </span>
    </span>
  );
}

export function Logo({
  href = "/",
  markClassName = "h-9 w-9",
  className = "",
}: {
  href?: string | null;
  markClassName?: string;
  className?: string;
}) {
  const inner = (
    <>
      <LogoMark className={markClassName} />
      <Wordmark />
    </>
  );

  if (href === null) {
    return (
      <span className={`flex items-center gap-2.5 ${className}`}>{inner}</span>
    );
  }

  return (
    <Link href={href} className={`flex items-center gap-2.5 ${className}`}>
      {inner}
    </Link>
  );
}
