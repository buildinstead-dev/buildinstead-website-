"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useMemo, useState } from "react";
import { Search, SearchX, X } from "lucide-react";
import { EmptyBuilds } from "@/components/products/empty-state";
import { ProductCard } from "@/components/products/product-card";
import { cn } from "@/components/ui/primitives";
import { categories, type CategorySlug } from "@/data/categories";
import type { Product } from "@/lib/types";

type Sort = "latest" | "oldest" | "popular";

export function ToolsDirectory({ products, showPopular }: { products: Product[]; showPopular: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const initialCategory = params.get("category");
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState<CategorySlug | "all">(
    categories.some((c) => c.slug === initialCategory) ? (initialCategory as CategorySlug) : "all",
  );
  const [sort, setSort] = useState<Sort>(params.get("sort") === "oldest" ? "oldest" : params.get("sort") === "popular" && showPopular ? "popular" : "latest");
  const deferredQuery = useDeferredValue(query);

  // Keep the URL shareable (e.g. /tools?category=finance) without adding history entries.
  function sync(next: { q?: string; category?: string; sort?: Sort }) {
    const sp = new URLSearchParams(params.toString());
    const set = (k: string, v: string | undefined, def: string) => (v && v !== def ? sp.set(k, v) : sp.delete(k));
    if ("q" in next) set("q", next.q?.trim(), "");
    if ("category" in next) set("category", next.category, "all");
    if ("sort" in next) set("sort", next.sort, "latest");
    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of products) m.set(p.category, (m.get(p.category) ?? 0) + 1);
    return m;
  }, [products]);

  const results = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    const list = products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (!q) return true;
      const cat = categories.find((c) => c.slug === p.category)?.name ?? "";
      return [p.name, p.description, p.problem, p.replaces ?? "", cat, ...p.features].join(" ").toLowerCase().includes(q);
    });
    return list.sort((a, b) =>
      sort === "oldest" ? a.day - b.day : sort === "popular" ? (b.usage?.count ?? 0) - (a.usage?.count ?? 0) : b.day - a.day,
    );
  }, [products, deferredQuery, category, sort]);

  const filtersActive = query.trim() !== "" || category !== "all";
  const clear = () => {
    setQuery("");
    setCategory("all");
    sync({ q: "", category: "all" });
  };

  return (
    <div>
      {/* Controls */}
      <div className="sticky top-16 z-30 -mx-4 border-b border-ink/[0.07] bg-paper/90 px-4 py-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Search tools</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-steel" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                sync({ q: e.target.value });
              }}
              placeholder="Search tools, problems or things you pay for…"
              className="h-12 w-full rounded-xl border border-ink/10 bg-white pl-11 pr-11 text-[15px] outline-none transition-[border-color,box-shadow] placeholder:text-fog focus:border-ink/30 focus:ring-4 focus:ring-lime/40 [&::-webkit-search-cancel-button]:appearance-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  sync({ q: "" });
                }}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-steel hover:bg-ink/5 hover:text-ink"
              >
                <X className="size-4" />
              </button>
            )}
          </label>
          <label className="relative sm:w-48">
            <span className="sr-only">Sort tools</span>
            <select
              value={sort}
              onChange={(e) => {
                const v = e.target.value as Sort;
                setSort(v);
                sync({ sort: v });
              }}
              className="h-12 w-full appearance-none rounded-xl border border-ink/10 bg-white px-4 pr-10 text-[15px] outline-none focus:border-ink/30 focus:ring-4 focus:ring-lime/40"
            >
              <option value="latest">Latest builds</option>
              <option value="oldest">Oldest first</option>
              {showPopular && <option value="popular">Most popular</option>}
            </select>
            <span aria-hidden className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-steel">▾</span>
          </label>
        </div>

        <div role="group" aria-label="Filter by category" className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
          <Chip active={category === "all"} onClick={() => { setCategory("all"); sync({ category: "all" }); }}>
            All <Count n={products.length} active={category === "all"} />
          </Chip>
          {categories.map((c) => (
            <Chip key={c.slug} active={category === c.slug} onClick={() => { setCategory(c.slug); sync({ category: c.slug }); }}>
              {c.name} <Count n={counts.get(c.slug) ?? 0} active={category === c.slug} />
            </Chip>
          ))}
        </div>
      </div>

      {/* Results */}
      <p className="mt-6 text-sm text-steel" aria-live="polite">
        {products.length === 0
          ? "No tools published yet."
          : `${results.length} ${results.length === 1 ? "tool" : "tools"}${filtersActive ? " match your filters" : ""}`}
      </p>

      <div className="mt-4 pb-24">
        {products.length === 0 ? (
          <EmptyBuilds />
        ) : results.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-ink/15 bg-white/60 px-6 py-16 text-center">
            <SearchX className="mx-auto size-8 text-steel" />
            <h2 className="mt-4 text-xl font-semibold">Nothing here yet.</h2>
            <p className="mx-auto mt-2 max-w-sm text-steel">
              We haven&rsquo;t built that one. If you pay for it today, tell us — it might be tomorrow&rsquo;s build.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              {filtersActive && (
                <button type="button" onClick={clear} className="h-11 rounded-xl border border-ink/15 bg-white px-4 text-sm font-medium hover:border-ink/40">
                  Clear filters
                </button>
              )}
              <Link href="/suggest" className="inline-flex h-11 items-center justify-center rounded-xl bg-ink px-4 text-sm font-medium text-white hover:bg-graphite">
                Suggest this tool
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border px-3 text-sm transition-colors",
        active ? "border-ink bg-ink text-white" : "border-ink/10 bg-white text-ink/80 hover:border-ink/30 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

function Count({ n, active }: { n: number; active: boolean }) {
  return <span className={cn("font-mono text-[11px]", active ? "text-lime" : "text-steel")}>{n}</span>;
}
