import Link from "next/link";
import { Mail } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { GitHubIcon, InstagramIcon } from "@/components/brand/social-icons";
import { Container } from "@/components/ui/primitives";
import { siteConfig } from "@/config/site";
import { categories } from "@/data/categories";

const explore = [
  { label: "Explore Tools", href: "/tools" },
  { label: "Categories", href: "/categories" },
  { label: "Suggest a Tool", href: "/suggest" },
];
const company = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark bg-ink text-white">
      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo variant="onDark" className="h-[22px]" />
            <p className="mt-5 text-sm leading-relaxed text-fog">
              One useful digital tool, every day. Simple, free alternatives to the things you shouldn&rsquo;t have to pay for.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <a href={siteConfig.instagram.url} target="_blank" rel="noopener noreferrer" aria-label="BuildInstead on Instagram" className="grid size-10 place-items-center rounded-lg border border-white/10 text-fog transition-colors hover:border-lime/50 hover:text-lime">
                <InstagramIcon className="size-[18px]" />
              </a>
              <a href={siteConfig.github.url} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="grid size-10 place-items-center rounded-lg border border-white/10 text-fog transition-colors hover:border-lime/50 hover:text-lime">
                <GitHubIcon className="size-[18px]" />
              </a>
              <a href={`mailto:${siteConfig.email}`} aria-label="Email" className="grid size-10 place-items-center rounded-lg border border-white/10 text-fog transition-colors hover:border-lime/50 hover:text-lime">
                <Mail className="size-[18px]" />
              </a>
            </div>
          </div>

          <FooterColumn title="Explore" links={explore} />
          <FooterColumn title="Categories" links={categories.slice(0, 5).map((c) => ({ label: c.name, href: `/categories/${c.slug}` }))} />
          <div>
            <FooterColumn title="BuildInstead" links={company} />
            <a href={`mailto:${siteConfig.email}`} className="mt-3 inline-block break-all text-sm text-fog transition-colors hover:text-lime">
              {siteConfig.email}
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/[0.07] pt-8 text-xs text-steel sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} BuildInstead. Built in public, one day at a time.</p>
          <p className="font-mono uppercase tracking-wider">
            Why pay when you can build<span className="animate-blink text-lime">_</span>
          </p>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="eyebrow text-steel">{title}</h3>
      <ul className="mt-4 space-y-1">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="inline-block py-1.5 text-sm text-mist/80 transition-colors hover:text-lime">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
