import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, ChevronRight, Cpu, LogIn, ShieldCheck, Tag } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { Badge, ButtonLink, Container, SectionHeading } from "@/components/ui/primitives";
import { getCategory } from "@/data/categories";
import { getIcon } from "@/lib/icons";
import { formatDay } from "@/lib/products";
import type { Product } from "@/lib/types";

/**
 * Full landing page for a featured, hosted product. Used automatically for
 * any product that has `screenshots` in src/data/products.ts.
 */
export function ProductShowcase({ product, related }: { product: Product; related: Product[] }) {
  const Icon = getIcon(product.icon);
  const category = getCategory(product.category);
  const primary = product.launchLinks?.primary ?? (product.productUrl ? { label: `Open ${product.name}`, url: product.productUrl } : undefined);
  const secondary = product.launchLinks?.secondary;
  const [hero, ...gallery] = product.screenshots ?? [];
  const paragraphs = product.longDescription.split(/\n\s*\n/);

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="on-dark relative overflow-hidden bg-ink text-white">
        <div aria-hidden className="blueprint pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
        <div aria-hidden className="pointer-events-none absolute -right-40 top-20 size-[520px] rounded-full bg-lime/[0.07] blur-3xl" />
        <Container className="relative pt-8 sm:pt-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-fog">
            <Link href="/tools" className="hover:text-white">Tools</Link>
            <ChevronRight className="size-3.5" />
            {category && <Link href={`/categories/${category.slug}`} className="hover:text-white">{category.name}</Link>}
          </nav>

          <div className="mx-auto mt-12 max-w-3xl text-center sm:mt-16">
            <div className="flex animate-rise flex-wrap items-center justify-center gap-2">
              <Badge tone="day" className="bg-white/10 text-lime ring-white/10">{formatDay(product.day)}</Badge>
              <Badge tone="free">Free</Badge>
              {category && <Badge tone="neutral" className="bg-white/5 text-mist ring-white/15">{category.name}</Badge>}
            </div>
            <div className="mt-7 flex animate-rise items-center justify-center gap-4 [animation-delay:60ms]">
              <span className="grid size-14 place-items-center rounded-2xl bg-lime text-ink sm:size-16">
                <Icon className="size-7 sm:size-8" strokeWidth={1.8} />
              </span>
              <h1 className="text-5xl font-semibold tracking-[-0.035em] sm:text-7xl">{product.name}</h1>
            </div>
            <p className="mx-auto mt-6 max-w-2xl animate-rise text-lg leading-relaxed text-fog [animation-delay:120ms] sm:text-xl">{product.description}</p>
            {primary && (
              <div className="mt-9 flex animate-rise flex-col justify-center gap-3 [animation-delay:180ms] sm:flex-row">
                <ButtonLink href={primary.url} external variant="lime" size="lg">
                  {primary.label} <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </ButtonLink>
                {secondary && (
                  <ButtonLink href={secondary.url} external variant="outline-dark" size="lg">
                    <LogIn className="size-4" /> {secondary.label}
                  </ButtonLink>
                )}
              </div>
            )}
            <p className="mt-5 font-mono text-xs text-steel">Free account · No credit card · Export your data any time</p>
          </div>

          {hero && (
            <div className="relative mx-auto mt-14 max-w-5xl animate-rise [animation-delay:240ms] sm:mt-16">
              <Frame label={product.name}>
                <Image src={hero.src} alt={hero.alt} width={hero.width} height={hero.height} priority sizes="(min-width: 1024px) 1024px, 100vw" className="h-auto w-full" />
              </Frame>
            </div>
          )}
        </Container>
        <div aria-hidden className="h-16 sm:h-24" />
      </section>

      {/* ---------- Intro + problem ---------- */}
      <section className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow={`What is ${product.name}`} title="What it does, in plain words." />
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-steel">
              {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
          <div className="reveal self-start rounded-3xl border border-ink/[0.08] bg-white p-7 sm:p-9">
            <p className="eyebrow text-lime-deep">The problem</p>
            <p className="mt-4 font-display text-2xl font-medium leading-snug">{product.problem}</p>
            {product.replaces && (
              <p className="mt-6 inline-flex items-start gap-2 rounded-lg bg-mist/70 px-3 py-2 text-sm text-steel">
                <Tag className="mt-0.5 size-3.5 shrink-0" /> <span>A free alternative to: <span className="font-medium text-ink">{product.replaces}</span></span>
              </p>
            )}
          </div>
        </Container>
      </section>

      {/* ---------- Features ---------- */}
      <section className="border-y border-ink/[0.07] bg-white py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Key features" title={`Everything ${product.name} does.`} />
          <ul className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-ink/[0.08] bg-ink/[0.08] sm:grid-cols-2 lg:grid-cols-4">
            {product.features.map((f, i) => (
              <li key={f} className="reveal flex flex-col gap-4 bg-white p-6">
                <span className="flex items-center justify-between">
                  <span className="grid size-9 place-items-center rounded-lg bg-ink text-lime"><Check className="size-4" strokeWidth={2.5} /></span>
                  <span className="font-mono text-xs text-steel">{String(i + 1).padStart(2, "0")}</span>
                </span>
                <span className="font-medium leading-snug">{f}</span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ---------- Previews ---------- */}
      {gallery.length > 0 && (
        <section className="py-20 sm:py-28">
          <Container>
            <SectionHeading eyebrow="A look inside" title="The real app, not a mock-up." intro={`Screenshots of ${product.name} running with sample data.`} />
            <div className="mt-14 space-y-16 sm:space-y-24">
              {gallery.map((s, i) => (
                <figure key={s.src} className={`reveal grid items-center gap-8 lg:grid-cols-[1.6fr_1fr] lg:gap-12 ${i % 2 ? "lg:[&>*:first-child]:order-2 lg:grid-cols-[1fr_1.6fr]" : ""}`}>
                  <Frame label={product.name} light>
                    <Image src={s.src} alt={s.alt} width={s.width} height={s.height} sizes="(min-width: 1024px) 700px, 100vw" className="h-auto w-full" />
                  </Frame>
                  <figcaption className="text-lg leading-relaxed text-steel">
                    <span className="eyebrow mb-3 block text-lime-deep">{String(i + 2).padStart(2, "0")}</span>
                    {s.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ---------- Benefits ---------- */}
      {product.benefits && product.benefits.length > 0 && (
        <section className="bg-lime py-20 text-ink sm:py-28">
          <Container>
            <p className="eyebrow flex items-center gap-2 text-ink/70"><span aria-hidden className="inline-block h-3 w-1 bg-ink" />Why {product.name}</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.03] sm:text-5xl">Built to make your days easier, not your bills bigger.</h2>
            <div className="mt-12 grid gap-px overflow-hidden rounded-3xl bg-ink/15 sm:grid-cols-2">
              {product.benefits.map((b) => (
                <div key={b.title} className="bg-lime p-7 sm:p-9">
                  <h3 className="text-xl font-semibold">{b.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink/75">{b.body}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ---------- Get started / privacy / tech ---------- */}
      <section className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          {product.howToUse && product.howToUse.length > 0 && (
            <div>
              <SectionHeading eyebrow="Get started" title="Up and running in minutes." />
              <ol className="mt-8 space-y-4">
                {product.howToUse.map((step, i) => (
                  <li key={step} className="flex gap-4">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-ink font-mono text-xs text-lime">{String(i + 1).padStart(2, "0")}</span>
                    <span className="pt-1.5 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
          <div className="space-y-4 lg:pt-14">
            {product.privacy && (
              <div className="rounded-2xl border border-lime-deep/20 bg-lime-deep/[0.05] p-6">
                <h2 className="flex items-center gap-2 font-display font-semibold"><ShieldCheck className="size-5 text-lime-deep" /> Privacy</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink/80">{product.privacy}</p>
              </div>
            )}
            {product.techStack && product.techStack.length > 0 && (
              <div className="rounded-2xl border border-ink/[0.08] bg-white p-6">
                <h2 className="flex items-center gap-2 font-display font-semibold"><Cpu className="size-5 text-steel" /> Built with</h2>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {product.techStack.map((t) => <li key={t} className="rounded-md bg-mist/70 px-2 py-1 font-mono text-xs">{t}</li>)}
                </ul>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* ---------- Final CTA ---------- */}
      {primary && (
        <section className="pb-20 sm:pb-28">
          <Container>
            <div className="on-dark relative overflow-hidden rounded-[28px] bg-ink px-6 py-14 text-center text-white sm:px-12 sm:py-20">
              <div aria-hidden className="blueprint pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(circle_at_50%_0%,black,transparent_70%)]" />
              <div className="relative">
                <h2 className="mx-auto max-w-2xl text-4xl font-semibold leading-[1.03] sm:text-5xl">Why pay when you can use {product.name} for free?</h2>
                <p className="mx-auto mt-4 max-w-lg text-lg text-fog">{product.name} is free. Create an account and start planning today.</p>
                <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                  <ButtonLink href={primary.url} external variant="lime" size="lg">
                    {primary.label} <ArrowUpRight className="size-4" />
                  </ButtonLink>
                  <ButtonLink href="/tools" variant="outline-dark" size="lg">
                    Explore more tools <ArrowRight className="size-4" />
                  </ButtonLink>
                </div>
              </div>
            </div>
          </Container>
        </section>
      )}

      {related.length > 0 && (
        <section className="border-t border-ink/[0.07] bg-white py-16 sm:py-20">
          <Container>
            <h2 className="text-2xl font-semibold sm:text-3xl">Related tools</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}

/** Minimal app window frame for screenshots. */
function Frame({ label, light, children }: { label: string; light?: boolean; children: React.ReactNode }) {
  return (
    <div className={`overflow-hidden rounded-2xl border shadow-[0_40px_80px_-40px_rgb(0_0_0/0.55)] sm:rounded-3xl ${light ? "border-ink/10 bg-white" : "border-white/10 bg-graphite"}`}>
      <div className={`flex items-center gap-2 border-b px-4 py-2.5 ${light ? "border-ink/[0.07]" : "border-white/[0.07]"}`}>
        <span className="flex gap-1.5" aria-hidden>
          {[0, 1, 2].map((i) => <span key={i} className={`size-2.5 rounded-full ${light ? "bg-ink/10" : "bg-white/15"}`} />)}
        </span>
        <span className={`ml-2 font-mono text-[11px] ${light ? "text-steel" : "text-fog"}`}>{label}</span>
      </div>
      {children}
    </div>
  );
}
