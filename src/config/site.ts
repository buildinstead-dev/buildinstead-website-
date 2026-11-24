/**
 * Site-wide settings. Update the placeholder links here — every component
 * reads from this file, so you only ever change them in one place.
 */
export const siteConfig = {
  name: "BuildInstead",
  tagline: "Why Pay When You Can Build?",
  description:
    "We build one useful digital tool every day — simple, free alternatives to things you shouldn't have to pay for.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://buildinstead.com").replace(/\/$/, ""),

  // Official Instagram profile. GitHub and email below are still placeholders.
  instagram: {
    handle: "@buildinstead.dev",
    url: "https://www.instagram.com/buildinstead.dev/",
  },
  github: {
    url: "https://github.com/buildinstead",
  },
  email: "hello@buildinstead.com",
} as const;

/** Desktop navigation. "Explore Tools" is the highlighted call-to-action button. */
export const mainNav = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/categories" },
  { label: "About", href: "/about" },
  { label: "Suggest a Tool", href: "/suggest" },
] as const;

/** Mobile menu and footer get the full list. */
export const fullNav = [
  { label: "Home", href: "/" },
  { label: "Explore Tools", href: "/tools" },
  { label: "Categories", href: "/categories" },
  { label: "About", href: "/about" },
  { label: "Suggest a Tool", href: "/suggest" },
  { label: "Contact", href: "/contact" },
] as const;

export function absoluteUrl(path = "/") {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
