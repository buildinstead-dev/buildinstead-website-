import type { ReactNode } from "react";
import { Container } from "@/components/ui/primitives";

export function PageHeader({ eyebrow, title, intro, children }: { eyebrow: string; title: ReactNode; intro?: ReactNode; children?: ReactNode }) {
  return (
    <section className="on-dark relative overflow-hidden bg-ink text-white">
      <div aria-hidden className="blueprint pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <Container className="relative pb-14 pt-14 sm:pb-20 sm:pt-20">
        <p className="eyebrow flex items-center gap-2 text-lime">
          <span aria-hidden className="inline-block h-3 w-1 bg-lime" />
          {eyebrow}
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.03em] sm:text-5xl lg:text-6xl">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fog">{intro}</p>}
        {children}
      </Container>
    </section>
  );
}
