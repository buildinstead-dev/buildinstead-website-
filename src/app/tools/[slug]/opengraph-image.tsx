import { renderOg, ogSize } from "@/lib/og";
import { formatDay, getAllProducts, getProduct } from "@/lib/products";

export const alt = "A free tool by BuildInstead";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  return renderOg({
    eyebrow: product ? `${formatDay(product.day)} · Free tool` : "BuildInstead",
    title: product?.name ?? "Why Pay When You Can Build?",
    subtitle: product?.description,
  });
}
