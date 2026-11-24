import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { ToolsDirectory } from "@/components/products/tools-directory";
import { Container } from "@/components/ui/primitives";
import { getAllProducts, getStats, hasUsageData } from "@/lib/products";

export const metadata: Metadata = pageMetadata({
  title: "Explore Tools",
  description: "Browse every free tool BuildInstead has built — search by problem, filter by category and find a free alternative to what you pay for.",
  path: "/tools",
});

export default function ToolsPage() {
  const products = getAllProducts();
  const { availableTools } = getStats();
  return (
    <>
      <PageHeader
        eyebrow="Explore tools"
        title="Free tools for things you shouldn't pay for."
        intro={
          availableTools > 0
            ? `${availableTools} free ${availableTools === 1 ? "tool" : "tools"} and counting. Search by name, by problem, or by the thing you're paying for today.`
            : "Every tool we build will appear here. Search by name, by problem, or by the thing you're paying for today."
        }
      />
      <Container>
        <Suspense fallback={<div className="h-40" />}>
          <ToolsDirectory products={products} showPopular={hasUsageData()} />
        </Suspense>
      </Container>
    </>
  );
}
