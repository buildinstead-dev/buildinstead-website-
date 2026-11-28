import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge, cn } from "@/components/ui/primitives";
import { getCategory } from "@/data/categories";
import { getIcon } from "@/lib/icons";
import { formatDay, statusMeta } from "@/lib/products";
import type { Product } from "@/lib/types";

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const Icon = getIcon(product.icon);
  const category = getCategory(product.category);
  const status = statusMeta[product.status];
  const usable = product.status === "available";

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col rounded-2xl border border-ink/[0.08] bg-white p-5 transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[0_18px_40px_-24px_rgb(13_15_11/0.35)] sm:p-6",
        className,
      )}
    >
      {product.thumbnail && (
        <div className="-mx-5 -mt-5 mb-5 overflow-hidden rounded-t-2xl border-b border-ink/[0.06] bg-paper sm:-mx-6 sm:-mt-6">
          <Image
            src={product.thumbnail.src}
            alt={product.thumbnail.alt}
            width={product.thumbnail.width}
            height={product.thumbnail.height}
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="aspect-[16/10] h-auto w-full object-cover object-left-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        </div>
      )}
      <div className="flex items-start justify-between gap-3">
        <div className={cn("grid size-12 place-items-center rounded-xl transition-colors", usable ? "bg-ink text-lime" : "bg-mist text-steel")}>
          <Icon className="size-[22px]" strokeWidth={1.8} />
        </div>
        <span className="font-mono text-xs tracking-wide text-steel">{formatDay(product.day)}</span>
      </div>

      <h3 className="mt-5 text-lg font-semibold leading-snug">
        <Link href={`/tools/${product.slug}`} className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none">
          {product.name}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-steel">{product.description}</p>

      <div className="mt-5 flex flex-wrap items-center gap-1.5">
        {usable && <Badge tone="free">Free</Badge>}
        <Badge tone={status.tone} dot={status.tone === "live" || status.tone === "progress"}>
          {status.label}
        </Badge>
        {category && <Badge tone="neutral">{category.name}</Badge>}
      </div>

      <div className="mt-auto pt-6">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-sm font-medium transition-colors",
            usable ? "text-ink group-hover:text-lime-deep" : "text-steel",
          )}
        >
          {product.ctaLabel ?? (usable ? "View Tool" : "View Details")}
          <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
      {/* Focus ring for the stretched link */}
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl ring-lime-deep ring-offset-2 group-has-[a:focus-visible]:ring-2" />
    </article>
  );
}
