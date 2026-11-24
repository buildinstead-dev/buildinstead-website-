import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

// The official lockup file, embedded unchanged.
const logo = `data:image/svg+xml;base64,${readFileSync(join(process.cwd(), "public/brand/buildinstead-primary-dark-bg.svg")).toString("base64")}`;

export function renderOg({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0D0F0B",
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          padding: "72px 80px",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} width={436} height={56} alt="BuildInstead" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 24, color: "#C5F82A", textTransform: "uppercase", letterSpacing: 3 }}>{eyebrow}</div>
          <div style={{ display: "flex", fontSize: title.length > 32 ? 68 : 84, fontWeight: 700, letterSpacing: -3, lineHeight: 1.02, marginTop: 18, maxWidth: 1000 }}>
            {title}
          </div>
          {subtitle && <div style={{ display: "flex", fontSize: 30, color: "#8B9086", marginTop: 24, maxWidth: 960, lineHeight: 1.35 }}>{subtitle}</div>}
        </div>
      </div>
    ),
    ogSize,
  );
}
