import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Clapperboard, Hammer, Search, Share2 } from "lucide-react";
import { LogoIcon } from "@/components/brand/logo";
import { InstagramIcon } from "@/components/brand/social-icons";
import { EmptyBuilds } from "@/components/products/empty-state";
import { ProductCard } from "@/components/products/product-card";
import { ButtonLink, cn, Container, SectionHeading } from "@/components/ui/primitives";
import { siteConfig } from "@/config/site";
import { formatDay, getStats, statusMeta } from "@/lib/products";
import type { Product } from "@/lib/types";

/* ------------------------------------------------------------------ */
/* Stats — computed from the build log, never invented                */
/* ------------------------------------------------------------------ */

export function StatsStrip({ stats }: { stats: ReturnType<typeof getStats> }) {
  const items = [
    { label: "Total Builds", value: stats.totalBuilds },
    { label: "Free Tools Available", value: stats.availableTools },
    { label: "Problems Solved", value: stats.problemsSolved },
    { label: "Days of Building", value: stats.daysOfBuilding },
  ];
  return (
    <section aria-label="BuildInstead in numbers" className="border-b border-ink/[0.07] bg-white">
      <Container>
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {items.map((s, i) => (
            <div
              key={s.label}
              className={cn(
                "flex flex-col gap-1 py-8 sm:py-10",
                i % 2 === 1 && "border-l border-ink/[0.07] pl-5 sm:pl-8",
                i >= 2 && "border-t border-ink/[0.07] lg:border-t-0",
                i === 2 && "lg:border-l lg:pl-8",
                i === 3 && "lg:pl-8",
              )}
            >
              <dt className="order-2 text-sm text-steel">{s.label}</dt>
              <dd className="order-1 font-display text-4xl font-semibold tabular-nums tracking-tight sm:text-5xl">
                {s.value}
                {i === 0 && <span aria-hidden className="ml-1 inline-block h-[0.7em] w-[0.14em] bg-lime-deep align-baseline" />}
              </dd>
            </div>
          ))}
        </dl>
        <p className="-mt-1 pb-5 font-mono text-[11px] uppercase tracking-wider text-steel">
          Live from our build log{stats.totalBuilds === 0 && " — the counter starts with our first build"}
        </p>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Latest builds                                                      */
/* ------------------------------------------------------------------ */

export function LatestBuilds({ products }: { products: Product[] }) {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow="Latest builds" title="Fresh off the workbench." intro="Every tool we ship lands here first. Free to use, no account needed." />
          {products.length > 0 && (
            <ButtonLink href="/tools" variant="outline" className="shrink-0 self-start sm:self-auto">
              View All Builds <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </ButtonLink>
          )}
        </div>
        <div className="mt-12">
          {products.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} className="reveal" />
              ))}
            </div>
          ) : (
            <EmptyBuilds />
          )}
        </div>
        {products.length === 0 && (
          <div className="mt-6 flex justify-center">
            <Link href="/tools" className="inline-flex items-center gap-1.5 py-2 text-sm font-medium text-steel transition-colors hover:text-ink">
              View All Builds <ArrowRight className="size-4" />
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* How it works                                                       */
/* ------------------------------------------------------------------ */

const steps = [
  { n: "01", title: "Find a Problem", body: "We identify everyday problems people currently pay to solve.", icon: Search },
  { n: "02", title: "Build a Solution", body: "We create simple, practical alternatives.", icon: Hammer },
  { n: "03", title: "Share It With Everyone", body: "We publish the tool so everyone can discover and use it.", icon: Share2 },
];

export function HowItWorks() {
  return (
    <section className="border-y border-ink/[0.07] bg-white py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="How it works" title="One loop, every single day." />
        <ol className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-0">
          {/* connector line */}
          <span aria-hidden className="absolute left-0 right-0 top-[38px] hidden h-px bg-[repeating-linear-gradient(to_right,rgb(13_15_11/0.18)_0_6px,transparent_6px_12px)] md:block" />
          {steps.map(({ n, title, body, icon: Icon }, i) => (
            <li key={n} className={cn("reveal relative md:pr-10", i > 0 && "md:pl-10 md:border-l md:border-transparent")}>
              <div className="flex items-center gap-4">
                <span className="relative z-10 grid size-[76px] shrink-0 place-items-center rounded-2xl border border-ink/10 bg-paper font-mono text-2xl font-medium text-ink transition-colors">
                  {n}
                  <span className="absolute -bottom-2 -right-2 grid size-8 place-items-center rounded-lg bg-ink text-lime">
                    <Icon className="size-4" />
                  </span>
                </span>
              </div>
              <h3 className="mt-7 text-xl font-semibold">{title}</h3>
              <p className="mt-2 max-w-xs leading-relaxed text-steel">{body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Philosophy — the one lime section on the page                      */
/* ------------------------------------------------------------------ */

const principles = [
  "Free to use. No trials that quietly turn into bills.",
  "No account walls for things that don't need one.",
  "Your data stays on your device wherever possible.",
  "Small, focused tools that do one job well.",
  "Built in public — you see every step.",
];

export function Philosophy() {
  return (
    <section className="relative overflow-hidden bg-lime py-20 text-ink sm:py-28">
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -right-16 select-none font-display text-[18rem] font-bold leading-none tracking-tighter text-ink/[0.05] sm:text-[24rem]">
        $0
      </div>
      <Container className="relative grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        <div>
          <p className="eyebrow flex items-center gap-2 text-ink/70">
            <span aria-hidden className="inline-block h-3 w-1 bg-ink" />
            Our philosophy
          </p>
          <h2 className="mt-4 text-4xl font-semibold leading-[1.02] sm:text-5xl lg:text-6xl">
            Technology should solve problems, not create subscriptions.
          </h2>
          <div className="mt-8 max-w-xl space-y-4 text-lg leading-relaxed text-ink/80">
            <p>
              Somewhere along the way, simple things got expensive. Merging two PDFs, resizing an image, splitting a bill — tasks that take a few lines of code now come with a monthly fee.
            </p>
            <p>
              We think that&rsquo;s backwards. So instead of paying, we build. One small, honest tool at a time, free for anyone who needs it.
            </p>
          </div>
        </div>
        <div className="self-end">
          <ul className="divide-y divide-ink/15 border-y border-ink/15">
            {principles.map((p) => (
              <li key={p} className="flex gap-3 py-4 font-medium">
                <Check className="mt-0.5 size-5 shrink-0" strokeWidth={2.5} />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Build in public — the log                                          */
/* ------------------------------------------------------------------ */

export function BuildInPublic({ entries }: { entries: Product[] }) {
  return (
    <section className="py-20 sm:py-28">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrow="Build in public"
            title="The daily build log."
            intro="Every day gets an entry: what we're building, where it stands and the reel that shows it being made."
          />
          <ButtonLink href={siteConfig.instagram.url} external variant="ink" className="mt-8">
            <InstagramIcon className="size-4" /> Watch the builds
          </ButtonLink>
        </div>

        <div className="on-dark overflow-hidden rounded-3xl bg-ink text-white">
          <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-3.5 font-mono text-[11px] uppercase tracking-wider text-fog sm:px-6">
            <span>build.log</span>
            <span>{entries.length} {entries.length === 1 ? "entry" : "entries"}</span>
          </div>
          {entries.length > 0 ? (
            <ol className="divide-y divide-white/[0.07]">
              {entries.map((p) => {
                const s = statusMeta[p.status];
                return (
                  <li key={p.id} className="group grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 px-5 py-5 transition-colors hover:bg-white/[0.02] sm:grid-cols-[88px_1fr_auto] sm:items-center sm:px-6">
                    <span className="font-mono text-xs text-lime">{formatDay(p.day)}</span>
                    <div className="min-w-0">
                      <Link href={`/tools/${p.slug}`} className="font-display font-semibold text-white hover:text-lime">
                        {p.name}
                      </Link>
                      <p className="mt-0.5 truncate text-sm text-fog">{p.description}</p>
                    </div>
                    <div className="col-start-2 flex items-center gap-3 sm:col-start-3">
                      <span className={cn("font-mono text-[11px] uppercase tracking-wide", s.tone === "live" ? "text-lime" : s.tone === "progress" ? "text-amber-300" : "text-fog")}>
                        {s.label}
                      </span>
                      {p.instagramReelUrl ? (
                        <a href={p.instagramReelUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-xs text-mist transition-colors hover:border-lime/50 hover:text-lime">
                          <Clapperboard className="size-3.5" /> Reel <ArrowUpRight className="size-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-steel">Reel soon</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          ) : (
            <div className="px-5 py-14 font-mono text-sm sm:px-6">
              <p className="text-fog">
                <span className="text-lime">$</span> buildinstead log --today
              </p>
              <p className="mt-3 text-white">Day 000 — the log starts with our very first build.</p>
              <p className="mt-1 text-fog">
                Check back tomorrow, or follow along on Instagram<span className="animate-blink text-lime">▍</span>
              </p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Instagram                                                          */
/* ------------------------------------------------------------------ */

const reelFormat = [
  { k: "The problem", v: "Something people pay for that shouldn't cost a thing." },
  { k: "The build", v: "How we make it — fast, real and unpolished." },
  { k: "The result", v: "A free tool you can use the same day." },
];

export function InstagramSection() {
  return (
    <section className="pb-20 sm:pb-28">
      <Container>
        <div className="on-dark relative overflow-hidden rounded-[28px] bg-ink px-6 py-12 text-white sm:px-12 sm:py-16 lg:px-16">
          <div aria-hidden className="blueprint pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(circle_at_85%_30%,black,transparent_65%)]" />
          <div className="relative grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-gradient-to-tr from-lime via-lime to-lime-deep p-[2px]">
                  <div className="grid size-16 place-items-center rounded-full bg-ink">
                    <LogoIcon variant="onDark" className="size-9" />
                  </div>
                </div>
                <div>
                  <p className="font-display text-lg font-semibold">{siteConfig.instagram.handle}</p>
                  <p className="text-sm text-fog">Daily build videos</p>
                </div>
              </div>
              <h2 className="mt-8 text-4xl font-semibold leading-[1.02] sm:text-5xl">Follow What We&rsquo;re Building.</h2>
              <p className="mt-4 max-w-md text-lg leading-relaxed text-fog">
                Short videos, every day. See the problem, watch the build and grab the tool the moment it ships.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={siteConfig.instagram.url} external variant="lime" size="lg">
                  <InstagramIcon className="size-4" /> Follow Us on Instagram
                </ButtonLink>
                <ButtonLink href="/suggest" variant="outline-dark" size="lg">
                  Suggest a build
                </ButtonLink>
              </div>
            </div>

            <ol className="space-y-3">
              {reelFormat.map((r, i) => (
                <li key={r.k} className="flex gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
                  <span className="font-mono text-sm text-lime">0{i + 1}</span>
                  <div>
                    <p className="font-display font-semibold">{r.k}</p>
                    <p className="mt-1 text-sm text-fog">{r.v}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}
