import React from "react";
import { Smartphone, Sparkles, Moon } from "lucide-react";
import { getAllWallpapers, getCategories } from "@/lib/wallpapers";
import WallpaperGrid from "@/components/WallpaperGrid";

export const metadata = {
  title: "Mobile Wallpapers (Phone & AMOLED) — Wallpaper Vault",
  description:
    "Browse over 3,900 vertical 9:16 portrait wallpapers optimized for iPhone, Android, AMOLED lockscreens, and smartphones.",
};

export default function MobilePage() {
  const allWallpapers = getAllWallpapers();
  const mobileWallpapers = allWallpapers.filter((w) => w.device === "Mobile");
  const categories = getCategories();

  return (
    <div className="space-y-8">
      {/* Header Banner - White Card with Inset Hairline Border */}
      <div className="rounded-[10px] bg-white p-6 sm:p-8 border border-[#f2f0ed] shadow-[inset_0_0_0_1px_#f2f0ed] relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-[10px] bg-[#ff58ae]/15 text-[#ff58ae] flex items-center justify-center">
            <Smartphone className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff58ae]">
            Form Factor
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#121212] tracking-tight">
          Mobile Phone Wallpapers
        </h1>
        <p className="text-[14px] text-[#474645] mt-1.5 max-w-2xl leading-relaxed">
          Explore over 3,900 high-resolution vertical wallpapers tailored for smartphones, iPhone Lock Screens, Android Home Screens, and deep-black AMOLED displays.
        </p>
      </div>

      {/* Grid filtered to Mobile */}
      <WallpaperGrid
        initialWallpapers={mobileWallpapers}
        categories={categories}
        defaultDevice="Mobile"
        defaultCategory="all"
      />
    </div>
  );
}
