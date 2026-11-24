import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { ButtonLink, Container } from "@/components/ui/primitives";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="on-dark blueprint bg-ink text-white">
      <Container className="flex min-h-[70vh] flex-col items-start justify-center py-24">
        <p className="font-mono text-sm text-lime">404 · not built yet</p>
        <h1 className="mt-4 max-w-2xl text-5xl font-semibold leading-[1.02] tracking-[-0.03em] sm:text-6xl">
          This page doesn&rsquo;t exist<span className="animate-blink text-lime">_</span>
        </h1>
        <p className="mt-5 max-w-lg text-lg text-fog">Maybe it&rsquo;s a tool we haven&rsquo;t built yet. Have a look at what we have, or tell us what you were after.</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/tools" variant="lime" size="lg">Explore Tools <ArrowRight className="size-4" /></ButtonLink>
          <ButtonLink href="/suggest" variant="outline-dark" size="lg">Suggest a tool</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
