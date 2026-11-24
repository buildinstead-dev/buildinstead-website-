import dynamic from "next/dynamic";
import type { ComponentType } from "react";

/**
 * Tools that run directly on BuildInstead are registered here by slug.
 * Each tool lives in its own folder (src/tools/<slug>/index.tsx) and is
 * lazy-loaded, so one tool's code never slows down another page.
 *
 * To add a tool:
 *   1. Build it in src/tools/<slug>/index.tsx (a "use client" component).
 *   2. Add a line below:
 *        "pdf-merger": dynamic(() => import("./pdf-merger")),
 *   3. Add its entry to src/data/products.ts with status "available".
 *
 * Products hosted elsewhere don't need this — set productUrl instead.
 */
export const toolRegistry: Record<string, ComponentType> = {
  // "pdf-merger": dynamic(() => import("./pdf-merger")),
};


export function getToolComponent(slug: string): ComponentType | undefined {
  return toolRegistry[slug];
}
