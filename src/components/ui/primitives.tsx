import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

/* ---------- Buttons ---------- */

type Variant = "lime" | "ink" | "outline" | "outline-dark" | "ghost";
type Size = "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-[background-color,color,border-color,transform,box-shadow] duration-200 ease-out active:translate-y-px disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap";

const variants: Record<Variant, string> = {
  lime: "bg-lime text-ink hover:bg-[#d4ff4d] shadow-[0_0_0_1px_rgb(197_248_42/0.4),0_8px_24px_-8px_rgb(197_248_42/0.5)]",
  ink: "bg-ink text-white hover:bg-graphite",
  outline: "border border-ink/15 bg-white text-ink hover:border-ink/40",
  "outline-dark": "border border-white/15 text-white hover:border-white/40 hover:bg-white/5",
  ghost: "text-ink hover:bg-ink/5",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-[15px] sm:h-13 sm:px-6",
};

export function buttonClasses(variant: Variant = "ink", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

export function ButtonLink({
  variant,
  size,
  className,
  external,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size; external?: boolean }) {
  const extra = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return <Link className={buttonClasses(variant, size, className)} {...extra} {...props} />;
}

/* ---------- Badges ---------- */

type Tone = "live" | "progress" | "soon" | "muted" | "free" | "neutral" | "day";

const tones: Record<Tone, string> = {
  live: "bg-lime-deep/10 text-lime-deep ring-lime-deep/20",
  progress: "bg-amber-500/10 text-amber-700 ring-amber-600/20",
  soon: "bg-ink/5 text-steel ring-ink/10",
  muted: "bg-ink/5 text-fog ring-ink/10",
  free: "bg-lime text-ink ring-lime",
  neutral: "bg-white text-steel ring-ink/10",
  day: "bg-ink text-lime ring-ink",
};

export function Badge({ tone = "neutral", className, children, dot }: { tone?: Tone; className?: string; children: ReactNode; dot?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide ring-1 ring-inset",
        tones[tone],
        className,
      )}
    >
      {dot && <span className={cn("size-1.5 rounded-full", tone === "live" ? "bg-lime-deep" : tone === "progress" ? "bg-amber-600 animate-pulse" : "bg-current")} />}
      {children}
    </span>
  );
}

/* ---------- Section heading ---------- */

export function SectionHeading({
  eyebrow,
  title,
  intro,
  dark,
  className,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  dark?: boolean;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className={cn("eyebrow mb-4 flex items-center gap-2", align === "center" && "justify-center", dark ? "text-lime" : "text-lime-deep")}>
          <span aria-hidden className={cn("inline-block h-3 w-1", dark ? "bg-lime" : "bg-lime-deep")} />
          {eyebrow}
        </p>
      )}
      <h2 className={cn("text-3xl font-semibold leading-[1.08] sm:text-4xl lg:text-[2.75rem]", dark ? "text-white" : "text-ink")}>{title}</h2>
      {intro && <p className={cn("mt-4 text-base leading-relaxed sm:text-lg", dark ? "text-fog" : "text-steel")}>{intro}</p>}
    </div>
  );
}
