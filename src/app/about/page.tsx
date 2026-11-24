import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { ArrowRight, Code2, Eye, Gift, Lightbulb } from "lucide-react";
import { InstagramIcon } from "@/components/brand/social-icons";
import { PageHeader } from "@/components/layout/page-header";
import { ButtonLink, Container } from "@/components/ui/primitives";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: "BuildInstead builds one useful digital tool every day — free alternatives to everyday things people pay for. Here's why we started.",
  path: "/about",
});

const challenge = [
  { icon: Lightbulb, title: "Pick a problem", body: "Something real people pay for, usually monthly, that really shouldn't need a subscription." },
  { icon: Code2, title: "Build it in a day", body: "Small scope, honest result. Simple beats clever. If it can run in your browser, it does." },
  { icon: Eye, title: "Show the work", body: "A short video on Instagram, the code on GitHub where it makes sense, and the tool right here." },
  { icon: Gift, title: "Give it away", body: "Free to use. No trial countdown. No account walls for things that don't need one." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About BuildInstead"
        title="We got tired of paying for simple things. So we started building them."
      />

      {/* Story */}
      <Container className="grid gap-12 py-16 sm:py-24 lg:grid-cols-[220px_1fr] lg:gap-20">
        <p className="eyebrow text-lime-deep lg:pt-2">The short version</p>
        <div className="max-w-2xl space-y-6 text-lg leading-relaxed text-ink/80">
          <p className="font-display text-2xl font-medium leading-snug text-ink sm:text-3xl">
            BuildInstead is a simple idea: every day, we build one useful digital tool and give it away.
          </p>
          <p>
            You know the moment. You need to merge two PDFs, shrink a photo, or work out how to split a bill — and the first website you find wants your email, then your card, then a monthly fee. For something that takes a few lines of code.
          </p>
          <p>
            We kept running into that, and at some point the question became obvious: <em>why pay for it when we can just build it?</em> So that&rsquo;s what we do now. We find the small, annoying things people are paying for and we make free, straightforward versions anyone can use.
          </p>
        </div>
      </Container>

      {/* Problems */}
      <section className="border-y border-ink/[0.07] bg-white py-16 sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-[220px_1fr] lg:gap-20">
          <p className="eyebrow text-lime-deep lg:pt-2">What we go after</p>
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold sm:text-4xl">Everyday problems with a price tag they don&rsquo;t deserve.</h2>
            <p className="mt-5 text-lg leading-relaxed text-steel">
              Converters, calculators, generators, editors, trackers — the tools you use for five minutes and then get billed for every month. Not giant platforms. Not things that genuinely need a team and servers to run. Just the stuff that should be simple, made simple again.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-steel">
              And because a lot of these tasks involve your files and your data, we prefer tools that run entirely in your browser, so nothing gets uploaded anywhere.
            </p>
          </div>
        </Container>
      </section>

      {/* The challenge */}
      <section className="on-dark bg-ink py-16 text-white sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[220px_1fr] lg:gap-20">
            <p className="eyebrow text-lime lg:pt-2">The challenge</p>
            <div>
              <h2 className="max-w-2xl text-3xl font-semibold sm:text-4xl">One build a day. Every day. In public.</h2>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-fog">
                A daily deadline keeps us honest. It forces small, focused tools instead of bloated ones, and it means you can watch the whole thing happen — the wins, the rough edges and the occasional rebuild.
              </p>
              <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-white/[0.08] sm:grid-cols-2">
                {challenge.map(({ icon: Icon, title, body }, i) => (
                  <li key={title} className="bg-ink p-6 sm:p-8">
                    <div className="flex items-center justify-between">
                      <Icon className="size-6 text-lime" strokeWidth={1.7} />
                      <span className="font-mono text-xs text-steel">0{i + 1}</span>
                    </div>
                    <h3 className="mt-6 text-xl font-semibold">{title}</h3>
                    <p className="mt-2 leading-relaxed text-fog">{body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </section>

      {/* Philosophy */}
      <Container className="grid gap-12 py-16 sm:py-24 lg:grid-cols-[220px_1fr] lg:gap-20">
        <p className="eyebrow text-lime-deep lg:pt-2">What we believe</p>
        <div className="max-w-2xl space-y-6 text-lg leading-relaxed text-ink/80">
          <p>
            Good technology should make life a bit easier, not add another line to your bank statement. Plenty of software is worth paying for — but a lot of everyday tools have been wrapped in subscriptions simply because they can be.
          </p>
          <p>
            We think useful tools should be accessible to everyone: students, freelancers, small shop owners, anyone who just needs the thing to work. That&rsquo;s the whole mission. Make useful digital tools accessible to everyone.
          </p>
          <p>
            Where it makes sense, we open-source what we build too, so developers can learn from it, improve it and help us make the next one better.
          </p>
        </div>
      </Container>

      {/* Mantra */}
      <section className="bg-lime py-20 text-ink sm:py-28">
        <Container className="text-center">
          <p className="mx-auto max-w-4xl font-display text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-6xl">
            One problem. One solution. One build at a time.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/tools" variant="ink" size="lg">
              Explore the tools <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink href={siteConfig.instagram.url} external variant="outline" size="lg" className="border-ink/20 bg-transparent">
              <InstagramIcon className="size-4" /> Follow the journey
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
