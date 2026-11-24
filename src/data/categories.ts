import type { ProductIconName } from "@/lib/icons";

export const categories = [
  {
    slug: "productivity",
    name: "Productivity",
    icon: "Timer",
    description: "Small tools that save time on the things you do every day.",
  },
  {
    slug: "finance",
    name: "Finance",
    icon: "Wallet",
    description: "Calculators and trackers for money questions — no premium tier required.",
  },
  {
    slug: "developer-tools",
    name: "Developer Tools",
    icon: "Terminal",
    description: "Formatters, converters and generators developers reach for daily.",
  },
  {
    slug: "documents-pdfs",
    name: "Documents & PDFs",
    icon: "FileText",
    description: "Merge, split, convert and tidy up documents without uploading them anywhere.",
  },
  {
    slug: "image-design",
    name: "Image & Design",
    icon: "Image",
    description: "Resize, compress, crop and create visuals right in your browser.",
  },
  {
    slug: "education",
    name: "Education",
    icon: "GraduationCap",
    description: "Learning aids and study tools for students and curious minds.",
  },
  {
    slug: "everyday-utilities",
    name: "Everyday Utilities",
    icon: "Wrench",
    description: "The little helpers you keep searching for and keep finding behind paywalls.",
  },
  {
    slug: "automation",
    name: "Automation",
    icon: "Workflow",
    description: "Take repetitive work off your plate.",
  },
] as const satisfies readonly {
  slug: string;
  name: string;
  icon: ProductIconName;
  description: string;
}[];

export type Category = (typeof categories)[number];
export type CategorySlug = Category["slug"];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
