"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { InstagramIcon } from "@/components/brand/social-icons";
import { ButtonLink, cn, Container } from "@/components/ui/primitives";
import { fullNav, mainNav, siteConfig } from "@/config/site";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the sheet on navigation; lock scroll while it is open.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
    <header className="on-dark sticky top-0 z-50 border-b border-white/[0.07] bg-ink/90 backdrop-blur-md supports-[backdrop-filter]:bg-ink/80">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-md focus:bg-lime focus:px-3 focus:py-2 focus:text-sm focus:text-ink">
        Skip to content
      </a>
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href="/" aria-label="BuildInstead home" className="shrink-0 py-3">
          <Logo variant="onDark" priority className="h-[19px] sm:h-[21px]" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {mainNav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-lg px-3 py-2 text-sm transition-colors",
                  active ? "text-white" : "text-fog hover:text-white",
                )}
              >
                {item.label}
                {active && <span aria-hidden className="absolute inset-x-3 -bottom-[13px] h-0.5 bg-lime" />}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <a
            href={siteConfig.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="BuildInstead on Instagram"
            className="grid size-10 place-items-center rounded-lg text-fog transition-colors hover:bg-white/5 hover:text-lime"
          >
            <InstagramIcon />
          </a>
          <ButtonLink href="/tools" variant="lime" className="h-10">
            Explore Tools
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="-mr-2 grid size-11 place-items-center rounded-lg text-white md:hidden"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </Container>
    </header>

      {/* Mobile sheet — outside <header>, whose backdrop-filter would trap position:fixed */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="on-dark fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-ink md:hidden"
      >
        <Container className="flex min-h-full flex-col py-6">
          <nav aria-label="Mobile" className="flex flex-col">
            {fullNav.map((item, i) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  style={{ animationDelay: `${i * 35}ms` }}
                  className={cn(
                    "flex animate-rise items-center justify-between border-b border-white/[0.07] py-4 font-display text-2xl tracking-tight",
                    active ? "text-lime" : "text-white",
                  )}
                >
                  {item.label}
                  <ArrowRight className={cn("size-5", active ? "text-lime" : "text-steel")} />
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto flex flex-col gap-3 pt-10">
            <ButtonLink href="/tools" variant="lime" size="lg">
              Explore Tools <ArrowRight className="size-4" />
            </ButtonLink>
            <ButtonLink href={siteConfig.instagram.url} external variant="outline-dark" size="lg">
              <InstagramIcon className="size-4" /> Follow {siteConfig.instagram.handle}
            </ButtonLink>
          </div>
        </Container>
      </div>
    </>
  );
}
