<p align="center">
  <img src="public/brand/buildinstead-primary-light-bg.svg" alt="BuildInstead" width="360" />
</p>

<h3 align="center">Why Pay When You Can Build?</h3>

<p align="center">
  One useful digital tool, every day — free for everyone.<br />
  <a href="https://www.instagram.com/buildinstead.dev/">Instagram @buildinstead.dev</a>
</p>

---

## About BuildInstead

BuildInstead is a build-in-public project. Every day we pick an everyday problem that people currently pay to solve — a PDF tool, an image resizer, a calculator, a tracker — and build a simple, free alternative.

- **Instagram** — short videos of each daily build: [@buildinstead.dev](https://www.instagram.com/buildinstead.dev/)
- **Website** (this repository) — where people discover and use everything we build
- **Open source** — projects are shared so developers can learn from them and contribute

### Mission

Make useful digital tools accessible to everyone.

### Philosophy

Technology should solve problems, not create subscriptions. Our tools aim to be free to use, avoid account walls for things that don't need them, keep your data on your device wherever possible, and do one job well.

> One problem. One solution. One build at a time.

![BuildInstead homepage](screenshots/01-home-desktop.png)

---

## Features

What's implemented in this website today:

- **Homepage** — hero with an interactive subscription-cost calculator, live statistics, latest builds, how it works, philosophy, the daily build log and an Instagram section
- **Tools directory** (`/tools`) — search, category filters, sorting by latest or oldest, status badges and shareable filter URLs (e.g. `/tools?category=finance`)
- **Product pages** (`/tools/<slug>`) — problem, features, usage steps, privacy notes, tech used, GitHub and Instagram Reel links, related tools, and a slot for the live tool
- **Categories** (`/categories`, `/categories/<category>`) — eight categories with tool counts
- **About**, **Contact** and **Suggest a Tool** pages, with client- and server-side form validation
- **One-file content management** — every product is a single entry in `src/data/products.ts`; the homepage, directory, categories, statistics, build log and sitemap update automatically
- **Honest by design** — statistics are calculated from the product list (they start at zero), unfinished tools are labelled *Coming Soon* / *In Development*, the "Most popular" sort only appears once real usage data exists, and forms never fake a successful submission
- **SEO** — per-page titles and descriptions, canonical URLs, Open Graph and Twitter cards, generated social images, `sitemap.xml`, `robots.txt`, web manifest and structured data
- **Responsive and accessible** — mobile-first layouts, keyboard-friendly navigation, skip link, reduced-motion support

> **Note:** the build log currently has no published products — the site launches with accurate empty states and fills in as daily builds are added.

---

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router, static generation)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Lucide](https://lucide.dev/) icons
- Fonts via `next/font`: Space Grotesk, Inter, JetBrains Mono
- [Supabase](https://supabase.com/) — **optional**, only for storing form submissions (accessed over its REST API; no SDK dependency)

---

## Getting started

Requires **Node.js 20.9 or newer**.

```bash
git clone https://github.com/buildinstead-dev/buildinstead-website-.git
cd buildinstead-website-
npm install
cp .env.example .env.local   # optional — the site runs without it
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |
| `npm run typecheck` | Run the TypeScript compiler without emitting |

---

## Environment variables

Copy `.env.example` to `.env.local`. All variables are optional for local development.

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | In production | Public URL used for canonical links, the sitemap and Open Graph tags |
| `SUPABASE_URL` | No | Supabase project URL — enables saving form submissions |
| `SUPABASE_ANON_KEY` | No | Supabase anon (public) key — server-side only, never exposed to the browser |

**Without Supabase**, the *Suggest a Tool* and *Contact* forms validate input and then open the visitor's email app with the message pre-filled, clearly stating that nothing has been sent yet.

**With Supabase:** run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL editor. It creates the `tool_suggestions` and `contact_messages` tables with insert-only row-level security, so the public key cannot read submissions. Then set the two variables and redeploy.

Never commit `.env.local` or real keys — `.gitignore` already excludes them.

---

## Adding a new build

1. Add one object to the `products` array in [`src/data/products.ts`](src/data/products.ts) (a commented example is at the top of the file).
2. To make the tool usable, either set `productUrl` (tool hosted elsewhere) or build it in `src/tools/<slug>/index.tsx` and register it in [`src/tools/registry.tsx`](src/tools/registry.tsx).
3. Commit and push — the deployment picks it up automatically.

Statuses: `coming-soon` → `in-development` → `available` → `archived`. Invalid entries (duplicate ids, slugs or days, unknown categories or icons) fail the build with a clear message.

Site-wide links — Instagram, GitHub and contact email — live in [`src/config/site.ts`](src/config/site.ts).

---

## Project structure

```
src/
  app/                     Routes (App Router)
    page.tsx               Homepage
    tools/                 Tools directory and product pages
    categories/            Category index and category pages
    about/ contact/ suggest/
    api/                   Form endpoints (used only when Supabase is configured)
    sitemap.ts robots.ts manifest.ts opengraph-image.tsx not-found.tsx
    globals.css            Design tokens and base styles
  components/
    brand/                 Logo and social icons
    home/                  Homepage sections and interactive hero
    layout/                Header, footer, page header
    products/              Product card, tools directory, empty state
    forms/                 Suggest and contact forms
    ui/                    Shared primitives (buttons, badges, containers)
  config/site.ts           Site URL, social links, contact email
  data/products.ts         The build log — one entry per product
  data/categories.ts       Categories
  lib/                     Product selectors and stats, validation, Supabase client, icons
  tools/registry.tsx       Registry for tools built into the site
public/brand/              Official BuildInstead logo files
supabase/schema.sql        Optional database schema
screenshots/               Screenshots of the website
```

---

## Deployment (Vercel)

1. Import this repository at [vercel.com/new](https://vercel.com/new) — Next.js is detected automatically.
2. Add `NEXT_PUBLIC_SITE_URL` (your domain), plus the Supabase variables if you use them.
3. Deploy, then connect your domain under **Settings → Domains**.

Every push to `main` triggers a new deployment.

---

## Brand

| | |
|---|---|
| Ink | `#0D0F0B` |
| Volt Lime | `#C5F82A` |
| Deep Lime | `#3A8F00` |
| Paper | `#F7F8F4` |

The BuildInstead name and logo are brand assets of BuildInstead.

---

<p align="center">
  Follow the journey on Instagram — <a href="https://www.instagram.com/buildinstead.dev/">@buildinstead.dev</a>
</p>
