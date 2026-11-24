import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyBuilds } from "@/components/products/empty-state";
import { ProductCard } from "@/components/products/product-card";
import { cn, Container } from "@/components/ui/primitives";
import { categories, getCategory } from "@/data/categories";
import { pageMetadata } from "@/lib/metadata";
import { getProductsByCategory } from "@/lib/products";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/categories/[category]">): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  // "Developer Tools" already ends in "Tools" — avoid "Free Developer Tools Tools".
  const label = category.name.endsWith("Tools") ? category.name : `${category.name} Tools`;
  return pageMetadata({
    title: `Free ${label}`,
    description: `${category.description} Free ${label.toLowerCase()} built by BuildInstead.`,
    path: `/categories/${category.slug}`,
  });
}

export default async function CategoryPage({ params }: PageProps<"/categories/[category]">) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const products = getProductsByCategory(category.slug);

  return (
    <>
      <PageHeader eyebrow="Category" title={category.name} intro={category.description}>
        <div className="-mx-4 mt-10 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/categories/${c.slug}`}
              aria-current={c.slug === category.slug ? "page" : undefined}
              className={cn(
                "inline-flex h-9 shrink-0 items-center rounded-lg border px-3 text-sm transition-colors",
                c.slug === category.slug ? "border-lime bg-lime text-ink" : "border-white/10 text-fog hover:border-white/30 hover:text-white",
              )}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </PageHeader>
      <Container className="py-12 sm:py-16">
        <Link href="/tools" className="inline-flex items-center gap-1.5 py-2 text-sm text-steel hover:text-ink">
          <ArrowLeft className="size-4" /> All tools
        </Link>
        <div className="mt-6">
          {products.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <EmptyBuilds
              compact
              title={`No ${category.name.toLowerCase()} tools yet.`}
              message="Paying for something in this category? Tell us — it could be one of our next builds."
            />
          )}
        </div>
      </Container>
    </>
  );
}
