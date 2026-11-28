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
export const products: Product[] = [
  {
    id: "bi-001",
    day: 1,
    name: "LifeOS",
    slug: "lifeos",
    description: "Your timetable, tasks, habits, goals and daily reflections in one private workspace.",
    longDescription:
      "LifeOS brings the pieces of a productive week into one place: a weekly timetable, daily tasks, habits with streaks, goals with milestones, a progress journal and an end-of-day review.\n\nAnalytics are built only from what you actually record, and a schedule assistant can rearrange your week for you, previewing every change before anything is saved.",
    problem:
      "Planning a week usually means juggling a calendar, a to-do app, a habit tracker and a notes app, and the good versions of each charge a monthly subscription.",
    replaces: "Paid planners, habit trackers and productivity suites",
    category: "productivity",
    icon: "CheckSquare",
    features: [
      "Weekly timetable with day, week and month views",
      "Daily tasks with priorities, deadlines and carry-forward",
      "Habits with streaks and an 18-week history",
      "Goals with milestones or numeric targets",
      "Progress journal for each goal",
      "End-of-day review with a 1–10 self-rating",
      "Analytics built only from recorded data",
      "Schedule assistant that previews every change",
    ],
    howToUse: [
      "Open LifeOS and create a free account. You're signed in straight away.",
      "Add your weekly routine to the timetable, then today's tasks.",
      "Set up the habits and goals you want to work on.",
      "Check things off through the day and close it with the daily review.",
    ],
    privacy:
      "Your workspace is private to your account. Passwords are hashed with Argon2id, sessions use secure HTTP-only cookies, there are no third-party analytics, and you can export everything as JSON or delete your account and all its data at any time.",
    techStack: ["React", "TypeScript", "Vite", "FastAPI", "PostgreSQL"],
    productUrl: "https://lifeos-ten-gamma.vercel.app",
    status: "available",
    publishedAt: "2026-11-28",
    featured: true,
    ctaLabel: "Explore LifeOS",
    launchLinks: {
      primary: { label: "Launch LifeOS", url: "https://lifeos-ten-gamma.vercel.app/register" },
      secondary: { label: "Sign in", url: "https://lifeos-ten-gamma.vercel.app/login" },
    },
    thumbnail: {
      src: "/products/lifeos/dashboard.png",
      alt: "The LifeOS dashboard showing today's timetable, pending tasks and habit streaks",
      width: 2880,
      height: 1800,
    },
    screenshots: [
      { src: "/products/lifeos/dashboard.png", alt: "LifeOS dashboard with today's focus, timetable, tasks and habits", width: 2880, height: 1800, caption: "Your day at a glance: what's on now, today's plan, pending tasks and habits." },
      { src: "/products/lifeos/habits.png", alt: "LifeOS habits page with streaks, weekly and monthly rates and an 18-week history", width: 2880, height: 1180, caption: "Habits with current and best streaks, weekly and monthly rates, and an 18-week history." },
      { src: "/products/lifeos/goals.png", alt: "LifeOS goals page with milestone and numeric progress bars", width: 2880, height: 960, caption: "Goals tracked by milestones or by a number, with time invested and journal entries." },
    ],
    benefits: [
      { title: "One place for your whole week", body: "Stop switching between a calendar, a to-do list and a habit app. Plan, act and reflect in the same workspace." },
      { title: "Progress you can actually see", body: "Streaks, completion rates and goal progress come from what you really did, never from estimates." },
      { title: "Plans that bend, not break", body: "Move a session or skip a day and LifeOS keeps your history intact. The assistant shows every change before it's applied." },
      { title: "Free, with no strings", body: "No trial, no premium tier and no ads. Your data stays yours, with a full export any time." },
    ],
  },
];
