import React from "react";
import { Monitor, Sparkles } from "lucide-react";
import { getAllWallpapers, getCategories } from "@/lib/wallpapers";
import WallpaperGrid from "@/components/WallpaperGrid";

export const metadata = {
  title: "Desktop Wallpapers (4K Landscape) — Wallpaper Vault",
  description:
    "Explore ultra-wide, 4K UHD, and Full HD landscape wallpapers curated specifically for PC monitors, laptops, and dual-screen desktop setups.",
};

export default function DesktopPage() {
  const allWallpapers = getAllWallpapers();
  const desktopWallpapers = allWallpapers.filter((w) => w.device === "Desktop");
  const categories = getCategories();

  return (
    <div className="space-y-8">
      {/* Header Banner - White Card with Inset Hairline Border */}
      <div className="rounded-[10px] bg-white p-6 sm:p-8 border border-[#f2f0ed] shadow-[inset_0_0_0_1px_#f2f0ed] relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-[10px] bg-[#0086fc]/10 text-[#0086fc] flex items-center justify-center">
            <Monitor className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#0086fc]">
            Form Factor
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#121212] tracking-tight">
          Desktop PC Wallpapers
        </h1>
        <p className="text-[14px] text-[#474645] mt-1.5 max-w-2xl leading-relaxed">
          High-definition landscape (16:9, 21:9, and ultrawide) wallpapers designed for computer monitors, gaming setups, and dual-display workstations.
        </p>
      </div>

      {/* Grid filtered to Desktop */}
      <WallpaperGrid
        initialWallpapers={desktopWallpapers}
        categories={categories}
        defaultDevice="Desktop"
        defaultCategory="all"
      />
    </div>
  );
}
