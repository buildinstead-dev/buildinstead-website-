import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Calendar, Check, ChevronRight, Clapperboard, Construction, Cpu, ExternalLink, Hourglass, ShieldCheck, Tag } from "lucide-react";
import { GitHubIcon } from "@/components/brand/social-icons";
import { ProductCard } from "@/components/products/product-card";
import { Badge, ButtonLink, Container } from "@/components/ui/primitives";
import { absoluteUrl } from "@/config/site";
import { getCategory } from "@/data/categories";
import { getIcon } from "@/lib/icons";
import { formatDate, formatDay, getAllProducts, getProduct, getRelatedProducts, statusMeta } from "@/lib/products";
import { getToolComponent } from "@/tools/registry";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/tools/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  const title = `${product.name} — free ${getCategory(product.category)?.name.toLowerCase() ?? "tool"}`;
  return {
    title,
    description: product.description,
    alternates: { canonical: `/tools/${product.slug}` },
    openGraph: { type: "website", url: `/tools/${product.slug}`, title: `${product.name} · BuildInstead`, description: product.description },
    twitter: { card: "summary_large_image", title: `${product.name} · BuildInstead`, description: product.description },
  };
}

export default async function ProductPage({ params }: PageProps<"/tools/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const Icon = getIcon(product.icon);
  const category = getCategory(product.category);
  const status = statusMeta[product.status];
  const available = product.status === "available";
  const Tool = available ? getToolComponent(product.slug) : undefined;
  const externalUrl = available ? product.productUrl : undefined;
  const related = getRelatedProducts(product);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    description: product.description,
    applicationCategory: category?.name,
    operatingSystem: "Web browser",
    url: absoluteUrl(`/tools/${product.slug}`),
    ...(product.publishedAt && { datePublished: product.publishedAt }),
    ...(available && { offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }),
  };

  return (
    <>
      {/* Header */}
      <section className="on-dark relative overflow-hidden bg-ink text-white">
        <div aria-hidden className="blueprint pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <Container className="relative pb-14 pt-8 sm:pb-16 sm:pt-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-fog">
            <Link href="/tools" className="hover:text-white">Tools</Link>
            <ChevronRight className="size-3.5" />
            {category && (
              <Link href={`/categories/${category.slug}`} className="hover:text-white">{category.name}</Link>
            )}
          </nav>

          <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className={`grid size-16 shrink-0 place-items-center rounded-2xl ${available ? "bg-lime text-ink" : "bg-white/10 text-white"}`}>
              <Icon className="size-8" strokeWidth={1.7} />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="day" className="bg-white/10 text-lime ring-white/10">{formatDay(product.day)}</Badge>
                {available && <Badge tone="free">Free</Badge>}
                <Badge tone={status.tone} className="bg-white/5 text-mist ring-white/15">{status.label}</Badge>
              </div>
              <h1 className="mt-4 text-4xl font-semibold leading-[1.02] tracking-[-0.03em] sm:text-5xl">{product.name}</h1>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-fog">{product.description}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {Tool && (
                  <ButtonLink href="#tool" variant="lime" size="lg">Use the tool</ButtonLink>
                )}
                {externalUrl && (
                  <ButtonLink href={externalUrl} external variant="lime" size="lg">
                    Open tool <ExternalLink className="size-4" />
                  </ButtonLink>
                )}
                {product.githubUrl && (
                  <ButtonLink href={product.githubUrl} external variant="outline-dark" size="lg">
                    <GitHubIcon className="size-4" /> View source
                  </ButtonLink>
                )}
                {product.instagramReelUrl && (
                  <ButtonLink href={product.instagramReelUrl} external variant="outline-dark" size="lg">
                    <Clapperboard className="size-4" /> Watch the build
                  </ButtonLink>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Live tool / status */}
      <Container className="py-12 sm:py-16">
        <section id="tool" aria-label="Tool" className="scroll-mt-24">
          {Tool ? (
            <div className="rounded-3xl border border-ink/10 bg-white p-4 shadow-[0_24px_60px_-40px_rgb(13_15_11/0.4)] sm:p-8">
              <Tool />
            </div>
          ) : externalUrl ? (
            <StatusPanel icon={<ExternalLink className="size-6" />} title="This tool runs on its own site.">
              Open it in a new tab — it&rsquo;s free to use.
              <div className="mt-6">
                <ButtonLink href={externalUrl} external variant="ink">Open {product.name} <ArrowUpRight className="size-4" /></ButtonLink>
              </div>
            </StatusPanel>
          ) : product.status === "in-development" ? (
            <StatusPanel icon={<Construction className="size-6" />} title="We're building this right now.">
              It isn&rsquo;t usable yet. Follow along on Instagram and it&rsquo;ll appear here the moment it ships.
            </StatusPanel>
          ) : product.status === "archived" ? (
            <StatusPanel icon={<Hourglass className="size-6" />} title="This build has been archived.">
              It&rsquo;s no longer maintained. {product.githubUrl ? "The source code is still available on GitHub." : ""}
            </StatusPanel>
          ) : (
            <StatusPanel icon={<Hourglass className="size-6" />} title="Coming soon.">
              {product.status === "available"
                ? "The live version is being connected to this page. Check back shortly."
                : "This one is on our build list. It isn't available yet."}
            </StatusPanel>
          )}
        </section>

        {/* Details */}
        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_340px] lg:gap-16">
          <div className="space-y-12">
            <Block title="The problem it solves">
              <p className="text-lg leading-relaxed text-ink/85">{product.problem}</p>
              {product.replaces && (
                <p className="mt-4 inline-flex items-center gap-2 rounded-lg bg-mist/70 px-3 py-1.5 text-sm text-steel">
                  <Tag className="size-3.5" /> A free alternative to: <span className="font-medium text-ink">{product.replaces}</span>
                </p>
              )}
            </Block>

            <Block title="About">
              <div className="space-y-4 leading-relaxed text-steel">
                {product.longDescription.split(/\n\s*\n/).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </Block>

            {product.features.length > 0 && (
              <Block title="Features">
                <ul className="grid gap-3 sm:grid-cols-2">
                  {product.features.map((f) => (
                    <li key={f} className="flex gap-3 rounded-xl border border-ink/[0.08] bg-white p-4 text-sm">
                      <span className="grid size-5 shrink-0 place-items-center rounded-md bg-lime"><Check className="size-3.5" strokeWidth={3} /></span>
                      {f}
                    </li>
                  ))}
                </ul>
              </Block>
            )}

            {product.howToUse && product.howToUse.length > 0 && (
              <Block title="How to use it">
                <ol className="space-y-3">
                  {product.howToUse.map((step, i) => (
                    <li key={step} className="flex gap-4">
                      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-ink font-mono text-xs text-lime">{String(i + 1).padStart(2, "0")}</span>
                      <span className="pt-1 leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </Block>
            )}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-ink/[0.08] bg-white p-5">
              <h2 className="eyebrow text-steel">Details</h2>
              <dl className="mt-4 divide-y divide-ink/[0.06] text-sm">
                <Row label="Build" value={formatDay(product.day)} icon={<Calendar className="size-4" />} />
                {product.publishedAt && <Row label="Published" value={formatDate(product.publishedAt)!} />}
                {category && <Row label="Category" value={<Link href={`/categories/${category.slug}`} className="underline-offset-4 hover:underline">{category.name}</Link>} />}
                <Row label="Status" value={status.label} />
                <Row label="Price" value={available ? "Free" : "—"} />
              </dl>
            </div>

            {product.privacy && (
              <div className="rounded-2xl border border-lime-deep/20 bg-lime-deep/[0.05] p-5">
                <h2 className="flex items-center gap-2 font-display font-semibold"><ShieldCheck className="size-5 text-lime-deep" /> Privacy</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink/80">{product.privacy}</p>
              </div>
            )}

            {product.techStack && product.techStack.length > 0 && (
              <div className="rounded-2xl border border-ink/[0.08] bg-white p-5">
                <h2 className="flex items-center gap-2 font-display font-semibold"><Cpu className="size-5 text-steel" /> Built with</h2>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {product.techStack.map((t) => (
                    <li key={t} className="rounded-md bg-mist/70 px-2 py-1 font-mono text-xs">{t}</li>
                  ))}
                </ul>
              </div>
            )}

            {(product.githubUrl || product.instagramReelUrl) && (
              <div className="rounded-2xl border border-ink/[0.08] bg-white p-2">
                {product.githubUrl && <SideLink href={product.githubUrl} icon={<GitHubIcon className="size-4" />} label="Source on GitHub" />}
                {product.instagramReelUrl && <SideLink href={product.instagramReelUrl} icon={<Clapperboard className="size-4" />} label="Watch the build reel" />}
              </div>
            )}
          </aside>
        </div>
      </Container>

      {related.length > 0 && (
        <section className="border-t border-ink/[0.07] bg-white py-16 sm:py-20">
          <Container>
            <h2 className="text-2xl font-semibold sm:text-3xl">Related tools</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </Container>
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-5 text-2xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Row({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <dt className="flex items-center gap-2 text-steel">{icon}{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

function SideLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition-colors hover:bg-paper">
      <span className="flex items-center gap-2.5">{icon}{label}</span>
      <ArrowUpRight className="size-4 text-steel" />
    </a>
  );
}

function StatusPanel({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="blueprint-light flex flex-col items-start gap-5 rounded-3xl border border-dashed border-ink/15 bg-white/60 p-8 sm:flex-row sm:p-10">
      <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-ink text-lime">{icon}</div>
      <div>
        <h2 className="text-2xl font-semibold">{title}</h2>
        <div className="mt-2 max-w-xl leading-relaxed text-steel">{children}</div>
      </div>
    </div>
  );
}
