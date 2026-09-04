import type { BlogPost } from "@/data/types";

/**
 * Deterministic generated cover for a post - we have no cover images yet.
 * Dark panel, faint grid, a brand-coloured glow keyed off the slug, and the
 * category set large and faded. Swap for real cover art later (add an
 * `image` field to the frontmatter and BlogPost type).
 */
export function BlogCover({
  post,
  className = "",
}: {
  post: Pick<BlogPost, "slug" | "category" | "title">;
  className?: string;
}) {
  const hash = [...post.slug].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const red = hash % 2 === 0;
  const glow = red ? "#C8102E" : "#00843D";

  return (
    <div
      className={`relative flex aspect-[16/10] items-end overflow-hidden bg-[#1c1e25] ${className}`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 90% at ${red ? "82% 12%" : "16% 18%"}, ${glow}44, transparent 60%)`,
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
      <div className="relative p-5">
        <span className="block max-w-[14ch] text-2xl font-extrabold leading-tight tracking-tight text-white/85">
          {post.category}
        </span>
        <span className="mt-1 block h-1 w-10 rounded-full" style={{ background: glow }} />
      </div>
    </div>
  );
}
