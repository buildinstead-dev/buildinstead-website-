import { ArrowRight, Lightbulb } from "lucide-react";
import { LogoIcon } from "@/components/brand/logo";
import { InstagramIcon } from "@/components/brand/social-icons";
import { ButtonLink, cn } from "@/components/ui/primitives";
import { siteConfig } from "@/config/site";

export function EmptyBuilds({
  title = "Our journey starts here.",
  message = "We're building something useful. Come back soon!",
  className,
  compact,
}: {
  title?: string;
  message?: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "blueprint-light relative overflow-hidden rounded-3xl border border-dashed border-ink/15 bg-white/60 px-6 text-center",
        compact ? "py-12" : "py-16 sm:py-24",
        className,
      )}
    >
      <div className="mx-auto flex max-w-md flex-col items-center">
        <div className="relative">
          <div className="grid size-16 place-items-center rounded-2xl bg-ink shadow-[0_12px_30px_-12px_rgb(13_15_11/0.6)]">
            <LogoIcon variant="onDark" className="size-9" />
          </div>
          <span aria-hidden className="absolute -right-2 -top-2 rounded-md bg-lime px-1.5 py-0.5 font-mono text-[10px] font-semibold text-ink">
            DAY 000
          </span>
        </div>
        <h3 className="mt-7 text-2xl font-semibold sm:text-3xl">{title}</h3>
        <p className="mt-3 text-steel">{message}</p>
        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <ButtonLink href="/suggest" variant="ink">
            <Lightbulb className="size-4" /> Suggest what we build
          </ButtonLink>
          <ButtonLink href={siteConfig.instagram.url} external variant="outline">
            <InstagramIcon className="size-4" /> Follow the journey <ArrowRight className="size-4" />
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
