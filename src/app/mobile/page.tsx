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
      {/* Header Banner */}
      <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <Smartphone className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
            Mobile Form Factor
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Mobile Wallpapers
        </h1>
        <p className="text-sm text-gray-300 mt-2 max-w-2xl leading-relaxed">
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
