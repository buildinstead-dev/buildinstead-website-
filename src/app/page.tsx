import { Hero } from "@/components/home/hero";
import { BuildInPublic, HowItWorks, InstagramSection, LatestBuilds, Philosophy, StatsStrip } from "@/components/home/sections";
import { getAllProducts, getLatestProducts, getStats } from "@/lib/products";

export default function HomePage() {
  const stats = getStats();
  return (
    <>
      <Hero day={stats.daysOfBuilding} />
      <StatsStrip stats={stats} />
      <LatestBuilds products={getLatestProducts(6)} />
      <HowItWorks />
      <Philosophy />
      <BuildInPublic entries={getAllProducts().slice(0, 7)} />
      <InstagramSection />
    </>
  );
}
