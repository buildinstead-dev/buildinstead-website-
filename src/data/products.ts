import type { Product } from "@/lib/types";

/**
 * ============================================================
 *  THE BUILD LOG — the single source of truth for every product.
 * ============================================================
 *
 * Launching a new build = adding ONE object to this array.
 * The homepage, /tools, /categories, product pages, statistics,
 * the Build in Public log and the sitemap all update automatically.
 *
 * Mistakes (duplicate ids/slugs/days, bad slugs, unknown categories)
 * fail the build with a clear message — see src/lib/products.ts.
 *
 * Example entry (copy, uncomment, fill in):
 *
 *   {
 *     id: "bi-001",
 *     day: 1,
 *     name: "PDF Merger",
 *     slug: "pdf-merger",
 *     description: "Combine PDFs into one file, right in your browser.",
 *     longDescription: "Drop in your files, drag them into order and download a single PDF. Everything happens on your device.",
 *     problem: "Most PDF merge sites want a subscription or upload your files to their servers.",
 *     replaces: "Paid PDF editors",
 *     category: "documents-pdfs",
 *     icon: "FileStack",
 *     features: ["Unlimited files", "Drag to reorder", "No uploads"],
 *     howToUse: ["Add your PDFs", "Drag them into order", "Click Merge and download"],
 *     privacy: "Your files never leave your browser.",
 *     techStack: ["Next.js", "pdf-lib"],
 *     status: "available",
 *     publishedAt: "2026-12-01",
 *     githubUrl: "https://github.com/buildinstead-dev/pdf-merger",
 *     instagramReelUrl: "https://www.instagram.com/reel/XXXXXXXX/",
 *     featured: true,
 *   },
 *
 * Built the tool into this site? Also register its component in
 * src/tools/registry.tsx under the same slug.
 */
export const products: Product[] = [];
