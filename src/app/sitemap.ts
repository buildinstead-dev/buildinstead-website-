import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { categories } from "@/data/categories";
import { getAllProducts } from "@/lib/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const products = getAllProducts();
  const latest = products.find((p) => p.publishedAt)?.publishedAt;
  const lastModified = latest ? new Date(latest) : undefined;

  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "daily", priority: 1, lastModified },
    { url: absoluteUrl("/tools"), changeFrequency: "daily", priority: 0.9, lastModified },
    { url: absoluteUrl("/categories"), changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/suggest"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.3 },
  ];

  return [
    ...pages,
    ...categories.map((c) => ({ url: absoluteUrl(`/categories/${c.slug}`), changeFrequency: "weekly" as const, priority: 0.6 })),
    ...products.map((p) => ({
      url: absoluteUrl(`/tools/${p.slug}`),
      changeFrequency: "weekly" as const,
      priority: p.status === "available" ? 0.8 : 0.4,
      ...(p.publishedAt && { lastModified: new Date(p.publishedAt) }),
    })),
  ];
}
