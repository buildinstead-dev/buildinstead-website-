import { categories, getCategory, type CategorySlug } from "@/data/categories";
import { products as rawProducts } from "@/data/products";
import { productIcons } from "@/lib/icons";
import type { Product, ProductStatus } from "@/lib/types";

/* ---------------- Validation (runs at build time) ---------------- */

function validate(list: Product[]): Product[] {
  const errors: string[] = [];
  const seen = { id: new Set<string>(), slug: new Set<string>(), day: new Set<number>() };
  const statuses: ProductStatus[] = ["coming-soon", "in-development", "available", "archived"];

  for (const p of list) {
    const where = `products.ts → "${p.name || p.id}"`;
    if (seen.id.has(p.id)) errors.push(`${where}: duplicate id "${p.id}"`);
    if (seen.slug.has(p.slug)) errors.push(`${where}: duplicate slug "${p.slug}"`);
    if (seen.day.has(p.day)) errors.push(`${where}: duplicate day ${p.day}`);
    seen.id.add(p.id);
    seen.slug.add(p.slug);
    seen.day.add(p.day);

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug)) errors.push(`${where}: slug must be lowercase-with-dashes`);
    if (!Number.isInteger(p.day) || p.day < 1) errors.push(`${where}: day must be a whole number ≥ 1`);
    if (!getCategory(p.category)) errors.push(`${where}: unknown category "${p.category}"`);
    if (!(p.icon in productIcons)) errors.push(`${where}: unknown icon "${p.icon}"`);
    if (!statuses.includes(p.status)) errors.push(`${where}: unknown status "${p.status}"`);
    if (p.publishedAt && Number.isNaN(Date.parse(p.publishedAt)))
      errors.push(`${where}: publishedAt must be YYYY-MM-DD`);
  }

  if (errors.length) {
    throw new Error(`Invalid product data:\n  - ${errors.join("\n  - ")}`);
  }
  return list;
}

const products = validate(rawProducts);

/* ---------------- Selectors ---------------- */

/** Newest build first. */
export function getAllProducts(): Product[] {
  return [...products].sort((a, b) => b.day - a.day);
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(slug: CategorySlug): Product[] {
  return getAllProducts().filter((p) => p.category === slug);
}

/** Latest builds for the homepage: featured first, then newest. */
export function getLatestProducts(limit = 6): Product[] {
  return getAllProducts()
    .filter((p) => p.status !== "archived")
    .sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || b.day - a.day)
    .slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 3): Product[] {
  const others = getAllProducts().filter((p) => p.slug !== product.slug && p.status !== "archived");
  const same = others.filter((p) => p.category === product.category);
  const rest = others.filter((p) => p.category !== product.category);
  return [...same, ...rest].slice(0, limit);
}

export function getCategoryCounts(): Record<CategorySlug, number> {
  const counts = Object.fromEntries(categories.map((c) => [c.slug, 0])) as Record<CategorySlug, number>;
  for (const p of products) counts[p.category] += 1;
  return counts;
}

/** True only when at least one product carries real usage data. */
export function hasUsageData(): boolean {
  return products.some((p) => typeof p.usage?.count === "number");
}

/* ---------------- Statistics ----------------
 * Every number is derived from the build log. Nothing is hard-coded.
 *
 *   totalBuilds     products that have been started (in development,
 *                   available or archived) — announcements don't count
 *   availableTools  products you can use right now
 *   problemsSolved  products that shipped (available + archived)
 *   daysOfBuilding  highest day number reached in the challenge
 */
export function getStats() {
  const started = products.filter((p) => p.status !== "coming-soon");
  const shipped = products.filter((p) => p.status === "available" || p.status === "archived");
  return {
    totalBuilds: started.length,
    availableTools: products.filter((p) => p.status === "available").length,
    problemsSolved: shipped.length,
    daysOfBuilding: started.reduce((max, p) => Math.max(max, p.day), 0),
  };
}

/* ---------------- Presentation helpers ---------------- */

export const statusMeta: Record<ProductStatus, { label: string; tone: "live" | "progress" | "soon" | "muted" }> = {
  available: { label: "Available", tone: "live" },
  "in-development": { label: "In Development", tone: "progress" },
  "coming-soon": { label: "Coming Soon", tone: "soon" },
  archived: { label: "Archived", tone: "muted" },
};

export function formatDay(day: number) {
  return `Day ${String(day).padStart(3, "0")}`;
}

export function formatDate(iso?: string) {
  if (!iso) return undefined;
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
