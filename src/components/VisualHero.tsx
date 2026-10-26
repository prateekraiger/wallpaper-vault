"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Monitor, 
  Smartphone, 
  FolderTree, 
  ArrowRight,
  Maximize2,
  Sparkles as SparklesIcon,
  Flame,
  Layers
} from "lucide-react";
import { Wallpaper, CategoryInfo } from "@/types/wallpaper";

interface VisualHeroProps {
  featuredWallpapers: Wallpaper[];
  categories: CategoryInfo[];
  deviceCounts: {
    Desktop: number;
    Mobile: number;
    "Square & Avatars": number;
  };
  onSelectWallpaper?: (wallpaper: Wallpaper) => void;
  onFilterDevice?: (device: string) => void;
}

export default function VisualHero({
  featuredWallpapers,
  categories,
  deviceCounts,
  onSelectWallpaper,
  onFilterDevice,
}: VisualHeroProps) {
  // Take top 6 high-impact featured items
  const heroWallpapers = featuredWallpapers.slice(0, 6);

  return (
    <section className="relative pt-2 pb-8 sm:pt-4 sm:pb-12">
      {/* Top Micro-Header: Sleek Visual Tag & Live Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#f2f0ed]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#ff3e00] animate-pulse" />
          <span className="text-xs font-bold tracking-wider text-[#121212] uppercase">
            Lumina Gallery
          </span>
          <span className="text-[#e5d5c3]">/</span>
          <span className="text-xs text-[#7e7e7d]">
            4,891 Ultra HD 4K Wallpapers
          </span>
        </div>

        {/* Quick Format Badges */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-0.5 rounded-full bg-[#f6f4ef] text-[#343433] border border-[#e5d5c3] font-medium flex items-center gap-1">
            <Monitor className="w-3 h-3 text-[#ff3e00]" />
            <span>2,683 Desktop</span>
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-[#f6f4ef] text-[#343433] border border-[#e5d5c3] font-medium flex items-center gap-1">
            <Smartphone className="w-3 h-3 text-[#ff58ae]" />
            <span>1,926 Mobile</span>
          </span>
          <span className="px-2 py-0.5 rounded-full bg-[#121212] text-[#fbfaf9] font-semibold text-[11px]">
            Zero Ads
          </span>
        </div>
      </div>

      {/* Hero Title & Minimal Narrative */}
      <div className="max-w-2xl mb-8 space-y-2">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#121212] tracking-tight leading-[1.08]">
          Curated Visual Sanctuary.
        </h1>
        <p className="text-[15px] sm:text-[16px] text-[#474645] leading-relaxed">
          Pure 4K and AMOLED wallpapers organized by physical form factor and thematic collections.
        </p>
      </div>

      {/* Featured Visual Mosaic Strip (Horizontal Scroll on Mobile, 6-Card Grid on Desktop) */}
      <div className="relative mb-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#121212]">
            <Flame className="w-3.5 h-3.5 text-[#ff3e00]" />
            <span>Curator&apos;s Highlights</span>
          </div>
          <a
            href="#explorer"
            className="text-xs font-semibold text-[#ff3e00] hover:text-[#121212] transition-colors flex items-center gap-1"
          >
            <span>Jump to all wallpapers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Scrollable Visual Cards Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {heroWallpapers.map((wp) => {
            const isLandscape = wp.device === "Desktop";
            return (
              <div
                key={wp.id}
                onClick={() => onSelectWallpaper && onSelectWallpaper(wp)}
                className="group relative rounded-[12px] overflow-hidden bg-[#f2f0ed] border border-[#f2f0ed] hover:border-[#e5d5c3] shadow-xs cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Image Container with Natural Aspect Preview */}
                <div className="relative aspect-[3/4] sm:aspect-[4/5] w-full overflow-hidden bg-[#e5d5c3]/30">
                  <Image
                    src={wp.thumbUrl || wp.url}
                    alt={wp.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient Scrim for Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Top Badges */}
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-white border border-white/20">
                      {isLandscape ? "4K PC" : "Phone"}
                    </span>
                    <span className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-3 h-3" />
                    </span>
                  </div>

                  {/* Bottom Info Overlay */}
                  <div className="absolute bottom-2 left-2 right-2 text-white">
                    <p className="text-[11px] font-bold line-clamp-1 leading-snug drop-shadow-sm">
                      {wp.title}
                    </p>
                    <p className="text-[10px] text-white/80 line-clamp-1 mt-0.5 font-medium">
                      {wp.category}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Form Factor & Categories Quick Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-4xl">
        <button
          onClick={() => onFilterDevice && onFilterDevice("Desktop")}
          className="p-3 rounded-[10px] bg-white border border-[#f2f0ed] shadow-xs hover:border-[#ff3e00] transition-all text-left group flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-[8px] bg-[#ff3e00]/10 text-[#ff3e00] flex items-center justify-center shrink-0">
            <Monitor className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-[#121212] text-sm leading-tight group-hover:text-[#ff3e00] transition-colors">
              Desktop 4K
            </div>
            <div className="text-[11px] text-[#7e7e7d]">
              {deviceCounts.Desktop.toLocaleString()} Ultra HD
            </div>
          </div>
        </button>

        <button
          onClick={() => onFilterDevice && onFilterDevice("Mobile")}
          className="p-3 rounded-[10px] bg-white border border-[#f2f0ed] shadow-xs hover:border-[#ff58ae] transition-all text-left group flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-[8px] bg-[#ff58ae]/10 text-[#ff58ae] flex items-center justify-center shrink-0">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-[#121212] text-sm leading-tight group-hover:text-[#ff58ae] transition-colors">
              Mobile AMOLED
            </div>
            <div className="text-[11px] text-[#7e7e7d]">
              {deviceCounts.Mobile.toLocaleString()} 9:16 Vertical
            </div>
          </div>
        </button>

        <button
          onClick={() => onFilterDevice && onFilterDevice("Square & Avatars")}
          className="p-3 rounded-[10px] bg-white border border-[#f2f0ed] shadow-xs hover:border-[#ffbb26] transition-all text-left group flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-[8px] bg-[#ffbb26]/10 text-[#ffbb26] flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-[#121212] text-sm leading-tight group-hover:text-[#ffbb26] transition-colors">
              Square & Avatars
            </div>
            <div className="text-[11px] text-[#7e7e7d]">
              {deviceCounts["Square & Avatars"].toLocaleString()} 1:1 Displays
            </div>
          </div>
        </button>

        <Link
          href="/folders"
          className="p-3 rounded-[10px] bg-white border border-[#f2f0ed] shadow-xs hover:border-[#00c978] transition-all text-left group flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-[8px] bg-[#00c978]/10 text-[#00c978] flex items-center justify-center shrink-0">
            <FolderTree className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-[#121212] text-sm leading-tight group-hover:text-[#00c978] transition-colors">
              10 Themes
            </div>
            <div className="text-[11px] text-[#7e7e7d]">
              Categories Explorer
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
