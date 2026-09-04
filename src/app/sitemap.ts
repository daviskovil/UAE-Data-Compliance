import type { MetadataRoute } from "next";
import { db } from "@/data";
import { getBlogPosts, getFrameworks } from "@/lib/content";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url.replace(/\/$/, "");
  const now = new Date();

  const staticRoutes = [
    "",
    "/frameworks",
    "/directory",
    "/checker",
    "/blog",
    "/vendors/submit",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
  }));

  const frameworkRoutes = getFrameworks().map((framework) => ({
    url: `${base}/frameworks/${framework.slug}`,
    lastModified: now,
  }));

  const categoryRoutes = (await db.listCategories()).map((category) => ({
    url: `${base}/directory/${category.slug}`,
    lastModified: now,
  }));

  const vendorRoutes = (await db.listVendors()).map((vendor) => ({
    url: `${base}/vendors/${vendor.slug}`,
    lastModified: now,
  }));

  const blogRoutes = getBlogPosts().map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: post.publishedAt ? new Date(post.publishedAt) : now,
  }));

  return [
    ...staticRoutes,
    ...frameworkRoutes,
    ...categoryRoutes,
    ...vendorRoutes,
    ...blogRoutes,
  ];
}
