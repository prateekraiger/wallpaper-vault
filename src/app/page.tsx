import React from "react";
import { getAllWallpapers, getCategories, getDeviceCounts } from "@/lib/wallpapers";
import WallpaperGrid from "@/components/WallpaperGrid";
import VisualHero from "@/components/VisualHero";

export const metadata = {
  title: "LUMINA — 4K Wallpapers for Desktop & Mobile",
  description:
    "Curated collection of 4,891 ultra-high definition 4K and AMOLED wallpapers organized into Desktop PC, Mobile phones, and 10 signature themes.",
};

export default function HomePage() {
  const allWallpapers = getAllWallpapers();
  const categories = getCategories();
  const deviceCounts = getDeviceCounts();

  // Curate 6 high-impact showcase wallpapers for the visual hero mosaic
  const featuredIds = [
    "wp_04205", // Lara Croft 8K
    "wp_01854", // Obsidian Thunder Blade 4K (Anime)
    "wp_04375", // Pexels Supercar 5K (Cars)
    "wp_02779", // Grand Tetons 4K (Nature)
    "wp_01166", // Midnight Sunset Surf (Mobile AMOLED)
    "wp_01150", // Cobalt Celestial Strike (Mobile Anime)
  ];

  const featuredWallpapers = featuredIds
    .map((id) => allWallpapers.find((w) => w.id === id))
    .filter(Boolean) as typeof allWallpapers;

  // Fallback if any ID wasn't found
  const finalFeatured =
    featuredWallpapers.length >= 6
      ? featuredWallpapers
      : allWallpapers.slice(0, 6);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Image-First Visual Hero */}
      <VisualHero
        featuredWallpapers={finalFeatured}
        categories={categories}
        deviceCounts={deviceCounts}
      />

      {/* Main Wallpaper Explorer with Pinterest-Style Masonry Grid */}
      <section id="explorer" className="pt-2">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff3e00]" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#121212] tracking-tight">
            All Wallpapers
          </h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#f2f0ed] text-[#474645] border border-[#e5d5c3]">
            {allWallpapers.length.toLocaleString()} items
          </span>
        </div>

        <WallpaperGrid
          initialWallpapers={allWallpapers}
          categories={categories}
          defaultDevice="all"
          defaultCategory="all"
          isHomePage={true}
        />
      </section>
    </div>
  );
}
