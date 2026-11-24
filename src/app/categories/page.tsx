import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/ui/primitives";
import { categories } from "@/data/categories";
import { getIcon } from "@/lib/icons";
import { getCategoryCounts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse BuildInstead's free tools by category — productivity, finance, developer tools, PDFs, images, education, everyday utilities and automation.",
  alternates: { canonical: "/categories" },
  openGraph: { url: "/categories", title: "Categories · BuildInstead" },
};

export default function CategoriesPage() {
  const counts = getCategoryCounts();
  return (
    <>
      <PageHeader
        eyebrow="Categories"
        title="Find tools by the job you need done."
        intro="Eight areas where people pay for things they shouldn't have to. Each new build lands in one of them."
      />
      <Container className="py-14 sm:py-20">
        <ul className="grid gap-px overflow-hidden rounded-3xl border border-ink/[0.08] bg-ink/[0.08] sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c, i) => {
            const Icon = getIcon(c.icon);
            const n = counts[c.slug];
            return (
              <li key={c.slug} className="reveal bg-white">
                <Link href={`/categories/${c.slug}`} className="group relative flex h-full min-h-56 flex-col p-6 transition-colors hover:bg-paper">
                  <div className="flex items-start justify-between">
                    <span className="grid size-11 place-items-center rounded-xl bg-mist/70 text-ink transition-colors group-hover:bg-ink group-hover:text-lime">
                      <Icon className="size-5" strokeWidth={1.8} />
                    </span>
                    <span className="font-mono text-xs text-steel">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h2 className="mt-6 text-lg font-semibold">{c.name}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-steel">{c.description}</p>
                  <div className="mt-auto flex items-center justify-between pt-6 text-sm">
                    <span className="font-mono text-xs uppercase tracking-wide text-steel">
                      {n === 0 ? "No tools yet" : `${n} ${n === 1 ? "tool" : "tools"}`}
                    </span>
                    <ArrowUpRight className="size-4 text-steel transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </>
  );
}
