import type { Metadata } from "next";
import { SuggestForm } from "@/components/forms/suggest-form";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/ui/primitives";
import { siteConfig } from "@/config/site";
import { isSupabaseConfigured } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Suggest a Tool",
  description: "Paying for something that should be free? Tell us what it is and we might build a free alternative.",
  alternates: { canonical: "/suggest" },
  openGraph: { url: "/suggest", title: "Suggest a Tool · BuildInstead" },
};

const examples = ["PDF tools", "Image compressors", "Invoice generators", "Habit trackers", "QR code makers", "Budget sheets"];

export default function SuggestPage() {
  return (
    <>
      <PageHeader
        eyebrow="Suggest a tool"
        title="What are you paying for that should be free?"
        intro="Some of our best ideas will come from you. Tell us about the subscription that annoys you most and we might make it tomorrow's build."
      />
      <Container className="grid gap-12 py-14 sm:py-20 lg:grid-cols-[1fr_320px] lg:gap-16">
        <SuggestForm dbEnabled={isSupabaseConfigured()} contactEmail={siteConfig.email} />
        <aside className="space-y-8 lg:pt-4">
          <div>
            <h2 className="eyebrow text-lime-deep">What makes a good suggestion</h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink/80">
              <li>Something you (or people you know) actually pay for.</li>
              <li>A clear job: &ldquo;I just need it to do X.&rdquo;</li>
              <li>Small enough to build well in a day.</li>
            </ul>
          </div>
          <div>
            <h2 className="eyebrow text-steel">The kind of thing we mean</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {examples.map((e) => (
                <li key={e} className="rounded-lg border border-ink/10 bg-white px-3 py-1.5 text-sm text-steel">{e}</li>
              ))}
            </ul>
          </div>
          <p className="text-sm leading-relaxed text-steel">
            We can&rsquo;t build everything, but every suggestion is read and helps us decide what comes next.
          </p>
        </aside>
      </Container>
    </>
  );
}
