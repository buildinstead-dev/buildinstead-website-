import Image from "next/image";
import { cn } from "@/components/ui/primitives";

/**
 * Official BuildInstead logo files, used unmodified from /public/brand.
 *   onDark  → primary-dark-bg (white + Volt Lime)
 *   onLight → primary-light-bg (ink + Deep Lime)
 * Aspect ratio of the primary lockup: 731.29 × 94.5.
 */
export function Logo({ variant = "onDark", className, priority }: { variant?: "onDark" | "onLight"; className?: string; priority?: boolean }) {
  const src = variant === "onDark" ? "/brand/buildinstead-primary-dark-bg.svg" : "/brand/buildinstead-primary-light-bg.svg";
  return (
    <Image
      src={src}
      alt="BuildInstead"
      width={731}
      height={94}
      priority={priority}
      unoptimized
      className={cn("h-6 w-auto", className)}
    />
  );
}

export function LogoIcon({ variant = "onDark", className }: { variant?: "onDark" | "onLight"; className?: string }) {
  const src = variant === "onDark" ? "/brand/buildinstead-icon-dark-bg.svg" : "/brand/buildinstead-icon-light-bg.svg";
  return <Image src={src} alt="" aria-hidden width={120} height={120} unoptimized className={cn("size-10", className)} />;
}
