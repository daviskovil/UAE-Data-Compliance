import type { BlogPost } from "@/data/types";

/**
 * Card / hero cover for a post.
 *
 * If the post has an `image` in its frontmatter it is used (object-cover);
 * otherwise a deterministic branded panel is generated from the slug.
 */
export function BlogCover({
  post,
  className = "",
  aspectClass = "aspect-[16/10]",
  imgClassName = "object-cover object-center",
  priority = false,
}: {
  post: Pick<BlogPost, "slug" | "category" | "title" | "image" | "imageAlt">;
  className?: string;
  aspectClass?: string;
  imgClassName?: string;
  priority?: boolean;
}) {
  if (post.image) {
    return (
      <div
        className={`relative overflow-hidden bg-canvas ${aspectClass} ${className}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.image}
          alt={post.imageAlt ?? post.title}
          className={`h-full w-full ${imgClassName}`}
          loading={priority ? "eager" : "lazy"}
        />
      </div>
    );
  }

  const hash = [...post.slug].reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const red = hash % 2 === 0;
  const glow = red ? "#C8102E" : "#00843D";

  return (
    <div
      className={`relative flex items-end overflow-hidden bg-[#1c1e25] ${aspectClass} ${className}`}
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
        <span
          className="mt-1 block h-1 w-10 rounded-full"
          style={{ background: glow }}
        />
      </div>
    </div>
  );
}
