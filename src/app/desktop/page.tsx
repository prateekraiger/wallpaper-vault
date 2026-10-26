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
      {/* Header Banner */}
      <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
            <Monitor className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Hardware Form Factor
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Desktop Wallpapers
        </h1>
        <p className="text-sm text-gray-300 mt-2 max-w-2xl leading-relaxed">
          High-definition landscape (16:9 and ultrawide) wallpapers designed for computer monitors, gaming setups, and workstations.
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
