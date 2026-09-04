import type { ElementType, ReactNode } from "react";

export function Card({
  as: Tag = "div",
  interactive = false,
  className = "",
  children,
  ...rest
}: {
  as?: ElementType;
  interactive?: boolean;
  className?: string;
  children: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}) {
  return (
    <Tag
      className={`rounded-[var(--radius-card)] bg-surface shadow-[var(--shadow-card)] ${
        interactive
          ? "transition-shadow transition-transform duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
          : ""
      } ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
