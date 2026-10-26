import React from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Monitor, 
  Smartphone, 
  Layers, 
  FolderTree, 
  Download, 
  CheckCircle2,
  Compass,
  Zap,
  Moon,
  Coffee,
  Palette
} from "lucide-react";
import { getAllWallpapers, getCategories, getDeviceCounts } from "@/lib/wallpapers";
import WallpaperGrid from "@/components/WallpaperGrid";

export default function HomePage() {
  const allWallpapers = getAllWallpapers();
  const categories = getCategories();
  const deviceCounts = getDeviceCounts();

  // Curated human mood collections
  const moodPills = [
    { name: "Late Night Focus", icon: "🌙", count: "751+", desc: "Pure black OLED & minimalist dark vibes" },
    { name: "High Energy & Adrenaline", icon: "⚡", count: "450+", desc: "Supercars, drift legends & battle heroes" },
    { name: "Zen & Serenity", icon: "🌿", count: "315+", desc: "Alpine peaks, calm oceans & misty pines" },
    { name: "Cozy & Lo-Fi", icon: "☕", count: "230+", desc: "Rainy balconies & aesthetic warm rooms" },
    { name: "Futuristic & Cyber", icon: "🔮", count: "280+", desc: "Neo-Tokyo towers & synthwave grids" },
    { name: "Creative Spark", icon: "🎨", count: "2,000+", desc: "3D geometries & liquid fluid art" },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Header */}
      <section className="relative rounded-3xl overflow-hidden glass-panel border border-white/10 p-8 sm:p-12 text-center">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-3xl mx-auto space-y-6">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>4,891 High-Resolution Wallpapers Categorized</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Curated Wallpapers for{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Desktop & Mobile
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Discover thousands of stunning 4K and AMOLED wallpapers, systematically organized into dedicated folders for PC monitors, smartphones, and 10 visual themes with subcategory navigation.
          </p>

          {/* Device Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-2xl mx-auto">
            <Link
              href="/desktop"
              className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 transition-all text-center group"
            >
              <Monitor className="w-5 h-5 text-indigo-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <div className="font-extrabold text-white text-base">
                {deviceCounts.Desktop.toLocaleString()}
              </div>
              <div className="text-[11px] text-gray-400">Desktop (PC)</div>
            </Link>

            <Link
              href="/mobile"
              className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 transition-all text-center group"
            >
              <Smartphone className="w-5 h-5 text-purple-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <div className="font-extrabold text-white text-base">
                {deviceCounts.Mobile.toLocaleString()}
              </div>
              <div className="text-[11px] text-gray-400">Mobile (Phone)</div>
            </Link>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 text-center">
              <Layers className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <div className="font-extrabold text-white text-base">
                {deviceCounts["Square & Avatars"].toLocaleString()}
              </div>
              <div className="text-[11px] text-gray-400">Square & Avatars</div>
            </div>

            <Link
              href="/folders"
              className="p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 transition-all text-center group"
            >
              <FolderTree className="w-5 h-5 text-emerald-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
              <div className="font-extrabold text-white text-base">
                {categories.length}
              </div>
              <div className="text-[11px] text-gray-400">Theme Folders</div>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Wallpaper Explorer */}
      <section>
        <WallpaperGrid
          initialWallpapers={allWallpapers}
          categories={categories}
          defaultDevice="all"
          defaultCategory="all"
        />
      </section>
    </div>
  );
}
