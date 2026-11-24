import { renderOg, ogSize } from "@/lib/og";

export const alt = "BuildInstead — Why Pay When You Can Build?";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: "One useful tool, every day",
    title: "Why Pay When You Can Build?",
    subtitle: "Simple, free alternatives to things you shouldn't have to pay for.",
  });
}
