import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/** The site-wide social image (src/app/opengraph-image.tsx). */
const socialImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${siteConfig.name} — ${siteConfig.tagline}`,
};

/**
 * Metadata for a regular page. A page's own `openGraph`/`twitter` objects
 * replace the layout's, so the social image is set again here explicitly.
 */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const fullTitle = `${title} · ${siteConfig.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", url: path, title: fullTitle, description, images: [socialImage] },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [socialImage.url] },
  };
}

/** Serialise JSON-LD safely for an inline <script> tag. */
export function jsonLdScript(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
