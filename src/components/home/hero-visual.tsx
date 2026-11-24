"use client";

import { useId, useState } from "react";

/*
 * The official "Build Cursor" mark (buildinstead-icon-dark-bg.svg, 120u grid),
 * split into its own rectangles so it can be assembled piece by piece.
 * Once assembled, the untouched official path is laid over the top.
 */
const OFFICIAL_PATH = "M14 12H32V44H78V108H14ZM32 62V90H60V62Z";
const pieces = [
  { x: 14, y: 12, w: 18, h: 96, dx: "0px", dy: "-60px", delay: 0.15 },
  { x: 32, y: 90, w: 46, h: 18, dx: "-50px", dy: "0px", delay: 0.35 },
  { x: 60, y: 62, w: 18, h: 28, dx: "40px", dy: "0px", delay: 0.5 },
  { x: 32, y: 44, w: 46, h: 18, dx: "0px", dy: "-50px", delay: 0.65 },
];

const fmt = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function HeroVisual() {
  const [monthly, setMonthly] = useState(9);
  const id = useId();
  const fill = `${((monthly - 1) / (49 - 1)) * 100}%`;

  return (
    <div className="relative mx-auto w-full max-w-[520px]">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-graphite shadow-[0_40px_80px_-40px_rgb(0_0_0/0.8)]">
        {/* Header strip */}
        <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-3 font-mono text-[11px] uppercase tracking-wider text-fog">
          <span>
            <span className="text-lime">●</span> workbench
          </span>
          <span>120 × 120u</span>
        </div>

        {/* Blueprint stage */}
        <div className="blueprint relative aspect-[4/3] sm:aspect-[16/11]">
          {/* crop marks */}
          {["left-4 top-4 border-l border-t", "right-4 top-4 border-r border-t", "left-4 bottom-4 border-l border-b", "right-4 bottom-4 border-r border-b"].map((c) => (
            <span key={c} aria-hidden className={`absolute size-4 border-white/25 ${c}`} />
          ))}

          <div className="absolute inset-0 grid place-items-center">
            <div className="relative">
              <svg viewBox="0 0 120 120" className="size-40 overflow-visible sm:size-52" role="img" aria-label="The BuildInstead mark assembling">
                {pieces.map((p, i) => (
                  <rect
                    key={i}
                    x={p.x}
                    y={p.y}
                    width={p.w}
                    height={p.h}
                    fill="#FFFFFF"
                    className="mark-piece"
                    style={{ ["--dx" as string]: p.dx, ["--dy" as string]: p.dy, animationDelay: `${p.delay}s` }}
                  />
                ))}
                <path d={OFFICIAL_PATH} fill="#FFFFFF" fillRule="evenodd" className="mark-piece" style={{ ["--dy" as string]: "0px", animationDelay: "1.3s", animationDuration: "0.01s" }} />
                <g className="mark-piece" style={{ ["--dx" as string]: "0px", ["--dy" as string]: "40px", animationDelay: "0.95s" }}>
                  <rect x="86" y="44" width="18" height="64" fill="#C5F82A" className="animate-blink [animation-delay:1.8s]" />
                </g>
              </svg>

              {/* annotations */}
              <span aria-hidden className="absolute -right-3 top-[30%] hidden translate-x-full items-center gap-2 font-mono text-[10px] text-lime sm:flex">
                <span className="h-px w-6 bg-lime/60" /> cursor
              </span>
              <span aria-hidden className="absolute -left-3 top-[12%] hidden -translate-x-full items-center gap-2 font-mono text-[10px] text-fog sm:flex">
                block <span className="h-px w-6 bg-white/30" />
              </span>
            </div>
          </div>

          <p aria-hidden className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[11px] text-fog">
            build/useful-thing <span className="text-lime">✓ assembled</span>
          </p>
        </div>

        {/* Calculator */}
        <div className="border-t border-white/[0.07] p-5 sm:p-6">
          <div className="flex items-baseline justify-between gap-4">
            <label htmlFor={id} className="text-sm text-mist">
              A &ldquo;simple&rdquo; tool subscription
            </label>
            <output htmlFor={id} className="font-mono text-sm text-white">
              {fmt(monthly)}
              <span className="text-fog">/mo</span>
            </output>
          </div>
          <input
            id={id}
            type="range"
            min={1}
            max={49}
            step={1}
            value={monthly}
            onChange={(e) => setMonthly(Number(e.target.value))}
            className="range mt-2"
            style={{ ["--fill" as string]: fill }}
          />
          <dl className="mt-4 grid grid-cols-3 gap-px overflow-hidden rounded-xl bg-white/[0.07] text-center">
            <Cell label="Per year" value={fmt(monthly * 12)} />
            <Cell label="In 5 years" value={fmt(monthly * 60)} />
            <Cell label="Built instead" value="$0" highlight />
          </dl>
          <p className="mt-3 text-[11px] leading-relaxed text-steel">Simple math on the price you pick. Drag to try your own.</p>
        </div>
      </div>
    </div>
  );
}

function Cell({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-graphite px-2 py-3">
      <dt className="font-mono text-[10px] uppercase tracking-wider text-fog">{label}</dt>
      <dd className={`mt-1 font-display text-lg font-semibold tabular-nums sm:text-xl ${highlight ? "text-lime" : "text-white"}`}>{value}</dd>
    </div>
  );
}
