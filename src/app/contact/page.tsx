import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import Link from "next/link";
import { Bug, Handshake, Lightbulb, Mail, MessageCircle, MessageSquareHeart } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { InstagramIcon } from "@/components/brand/social-icons";
import { PageHeader } from "@/components/layout/page-header";
import { Container } from "@/components/ui/primitives";
import { siteConfig } from "@/config/site";
import { contactTopics, type ContactTopic } from "@/lib/validation";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description: "Get in touch with BuildInstead — general questions, collaborations, tool suggestions, bug reports and feedback.",
  path: "/contact",
});

const reasons = [
  { icon: MessageCircle, title: "General enquiries", body: "Questions about BuildInstead or anything we've built." },
  { icon: Handshake, title: "Collaboration", body: "Want to build something together or feature a tool? Let's talk." },
  { icon: Lightbulb, title: "Tool suggestions", body: "Prefer the dedicated form?", link: { href: "/suggest", label: "Suggest a tool" } },
  { icon: Bug, title: "Bug reports", body: "Something broken? Tell us which tool and what happened." },
  { icon: MessageSquareHeart, title: "Feedback", body: "What's working, what isn't, what you'd change." },
];

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const { topic } = await searchParams;
  const initialTopic = contactTopics.some((t) => t.value === topic) ? (topic as ContactTopic) : "general";

  return (
    <>
      <PageHeader eyebrow="Contact" title="Say hello." intro="Questions, ideas, bugs or just a thank-you — we read everything." />
      <Container className="grid gap-12 py-14 sm:py-20 lg:grid-cols-[320px_1fr] lg:gap-16">
        <aside className="order-2 lg:order-1">
          <ul className="space-y-1">
            {reasons.map(({ icon: Icon, title, body, link }) => (
              <li key={title} className="flex gap-4 rounded-2xl p-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-ink text-lime">
                  <Icon className="size-[18px]" />
                </span>
                <div>
                  <h2 className="font-display font-semibold">{title}</h2>
                  <p className="mt-0.5 text-sm leading-relaxed text-steel">
                    {body}{" "}
                    {link && <Link href={link.href} className="font-medium text-ink underline underline-offset-4">{link.label}</Link>}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 space-y-2 border-t border-ink/[0.08] pt-8 text-sm">
            <h2 className="eyebrow mb-4 text-steel">Other ways to reach us</h2>
            <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2.5 py-2 font-medium hover:text-lime-deep">
              <Mail className="size-4" /> {siteConfig.email}
            </a>
            <a href={siteConfig.instagram.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 py-2 font-medium hover:text-lime-deep">
              <InstagramIcon className="size-4" /> {siteConfig.instagram.handle}
              <span className="font-normal text-steel">· DM us on Instagram</span>
            </a>
          </div>
        </aside>
        <div className="order-1 lg:order-2">
          <ContactForm initialTopic={initialTopic} />
        </div>
      </Container>
    </>
  );
}
