import type { CategorySlug } from "@/data/categories";
import type { ProductIconName } from "@/lib/icons";

/**
 * coming-soon     announced, not started
 * in-development  being built right now
 * available       live and usable
 * archived        shipped earlier, no longer maintained
 */
export type ProductStatus = "coming-soon" | "in-development" | "available" | "archived";

export interface ProductImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface Product {
  /** Stable unique id, e.g. "bi-001". Never reuse or change it. */
  id: string;
  /** Day of the build challenge this product was built on (1, 2, 3 …). */
  day: number;
  name: string;
  /** URL segment: /tools/<slug>. Lowercase letters, numbers and dashes. */
  slug: string;
  /** One sentence shown on cards. */
  description: string;
  /** A paragraph or two for the product page. */
  longDescription: string;
  /** The everyday problem this solves. */
  problem: string;
  /** What people usually pay for instead, e.g. "Paid PDF editors". Optional. */
  replaces?: string;
  category: CategorySlug;
  icon: ProductIconName;
  features: string[];
  /** Step-by-step usage instructions for the product page. */
  howToUse?: string[];
  /** Plain-language privacy note, e.g. "Files never leave your browser." */
  privacy?: string;
  techStack?: string[];
  /**
   * Where the tool lives if it is hosted elsewhere. Leave empty for tools
   * built into this site — register those in src/tools/registry.tsx.
   */
  productUrl?: string;
  status: ProductStatus;
  /** ISO date (YYYY-MM-DD) the product was published. */
  publishedAt?: string;
  githubUrl?: string;
  instagramReelUrl?: string;
  featured?: boolean;
  /** Label for the card / spotlight button, e.g. "Explore LifeOS". Defaults to "View Tool". */
  ctaLabel?: string;
  /** Product image for cards and the homepage spotlight (file in /public). */
  thumbnail?: ProductImage;
  /** Genuine screenshots of the product, shown on its page. */
  screenshots?: (ProductImage & { caption: string })[];
  /** Direct entry points into a hosted product (e.g. sign-up and sign-in pages). */
  launchLinks?: { primary: { label: string; url: string }; secondary?: { label: string; url: string } };
  /** Short benefit statements for richer product pages. */
  benefits?: { title: string; body: string }[];
  /**
   * Real usage numbers ONLY (e.g. from your analytics). The "Popular" sort
   * on /tools appears only once at least one product has this set.
   */
  usage?: { count: number; source: string; updatedAt: string };
}
