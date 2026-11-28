import { ArrowRight } from "lucide-react";
import { InstagramIcon } from "@/components/brand/social-icons";
import { ButtonLink, Container } from "@/components/ui/primitives";
import { siteConfig } from "@/config/site";
import { HeroVisual } from "./hero-visual";

export function Hero({ day }: { day: number }) {
  return (
    <section className="on-dark relative overflow-hidden bg-ink text-white">
      {/* soft lime glow, single and subtle */}
      <div aria-hidden className="pointer-events-none absolute -right-40 top-10 size-[520px] rounded-full bg-lime/[0.07] blur-3xl" />
      <Container className="relative grid items-center gap-14 pb-20 pt-14 sm:pt-20 lg:grid-cols-[1.1fr_1fr] lg:gap-10 lg:pb-28 lg:pt-24">
        <div>
          <p className="eyebrow inline-flex animate-rise items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-fog">
            <span className="size-1.5 rounded-full bg-lime" />
            {day > 0 ? `Building in public · Day ${day}` : "Building in public · Day 0"}
          </p>
          <h1 className="mt-6 animate-rise text-[2.75rem] font-semibold leading-[0.98] tracking-[-0.035em] [animation-delay:80ms] sm:text-6xl lg:text-[3.6rem] xl:text-[4.5rem]">
            Why pay when
            <br />
            you can{" "}
            <span className="relative whitespace-nowrap">
              build
              <span aria-hidden className="ml-1 inline-block h-[0.78em] w-[0.16em] translate-y-[0.06em] animate-blink bg-lime align-baseline" />
            </span>
            ?
          </h1>
          <p className="mt-6 max-w-xl animate-rise text-lg leading-relaxed text-fog [animation-delay:160ms] sm:text-xl">
            We build simple, useful tools to solve everyday problems. Discover practical alternatives to things you shouldn&rsquo;t have to pay for.
          </p>
          <div className="mt-9 flex animate-rise flex-col gap-3 [animation-delay:240ms] sm:flex-row">
            <ButtonLink href="/tools" variant="lime" size="lg">
              Explore Our Tools
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </ButtonLink>
            <ButtonLink href={siteConfig.instagram.url} external variant="outline-dark" size="lg">
              <InstagramIcon className="size-4" />
              Follow Our Journey
            </ButtonLink>
          </div>
          <p className="mt-8 font-mono text-xs text-steel">Free tools · No paywalls · Built one day at a time</p>
        </div>

        <div className="animate-rise [animation-delay:200ms]">
          <HeroVisual />
        </div>
      </Container>
    </section>
  );
}
