"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Folder, 
  Monitor, 
  Smartphone, 
  Layers, 
  ChevronRight, 
  Search, 
  Tag, 
  SlidersHorizontal,
  ArrowRight,
  HardDrive,
  FolderTree as FolderTreeIcon,
  X
} from "lucide-react";
import { Wallpaper, CategoryInfo } from "@/types/wallpaper";
import FolderTree from "@/components/FolderTree";

interface CategoryExplorerProps {
  categories: CategoryInfo[];
  allWallpapers: Wallpaper[];
  deviceCounts: {
    Desktop: number;
    Mobile: number;
    "Square & Avatars": number;
  };
}

// Visual theme accents for each category
const CATEGORY_THEMES: Record<string, { color: string; bg: string; border: string }> = {
  "anime-manga": { color: "#ff3e00", bg: "bg-[#ff3e00]/10", border: "border-[#ff3e00]/20" },
  "cars-automotive": { color: "#0086fc", bg: "bg-[#0086fc]/10", border: "border-[#0086fc]/20" },
  "nature-landscapes": { color: "#00c978", bg: "bg-[#00c978]/10", border: "border-[#00c978]/20" },
  "cyberpunk-sci-fi": { color: "#9f4fff", bg: "bg-[#9f4fff]/10", border: "border-[#9f4fff]/20" },
  "dark-amoled": { color: "#121212", bg: "bg-[#121212]/10", border: "border-[#121212]/20" },
  "abstract-3d": { color: "#ff58ae", bg: "bg-[#ff58ae]/10", border: "border-[#ff58ae]/20" },
  "gaming-superheroes": { color: "#ffbb26", bg: "bg-[#ffbb26]/10", border: "border-[#ffbb26]/20" },
  "space-cosmos": { color: "#64c6ff", bg: "bg-[#64c6ff]/10", border: "border-[#64c6ff]/20" },
  "urban-architecture": { color: "#ff8c00", bg: "bg-[#ff8c00]/10", border: "border-[#ff8c00]/20" },
  "animals-wildlife": { color: "#22c55e", bg: "bg-[#22c55e]/10", border: "border-[#22c55e]/20" },
};

export default function CategoryExplorer({
  categories,
  allWallpapers,
  deviceCounts,
}: CategoryExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [deviceFilter, setDeviceFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"count" | "name" | "subcategories">("count");
  const [showRawTree, setShowRawTree] = useState(false);

  // Group wallpapers by category once
  const wallpapersByCategory = useMemo(() => {
    const map = new Map<string, Wallpaper[]>();
    categories.forEach((cat) => {
      map.set(cat.slug, []);
    });

    allWallpapers.forEach((wp) => {
      const list = map.get(wp.categorySlug);
      if (list) {
        list.push(wp);
      }
    });

    return map;
  }, [categories, allWallpapers]);

  // Pre-calculate 3 preview wallpapers for each category
  const categoryPreviews = useMemo(() => {
    const previewMap = new Map<string, Wallpaper[]>();

    categories.forEach((cat) => {
      const wps = wallpapersByCategory.get(cat.slug) || [];
      if (wps.length === 0) {
        previewMap.set(cat.slug, []);
        return;
      }

      // Try picking wallpapers from different subcategories
      const picked: Wallpaper[] = [];
      const seenSubs = new Set<string>();

      for (const wp of wps) {
        const sub = wp.subcategory || "default";
        if (!seenSubs.has(sub)) {
          seenSubs.add(sub);
          picked.push(wp);
          if (picked.length === 3) break;
        }
      }

      // Fill remaining if needed
      if (picked.length < 3) {
        for (const wp of wps) {
          if (!picked.some((p) => p.id === wp.id)) {
            picked.push(wp);
            if (picked.length === 3) break;
          }
        }
      }

      previewMap.set(cat.slug, picked);
    });

    return previewMap;
  }, [categories, wallpapersByCategory]);

  // Filter and sort categories
  const filteredCategories = useMemo(() => {
    let result = categories.map((cat) => {
      const catWps = wallpapersByCategory.get(cat.slug) || [];
      let count = cat.count;

      if (deviceFilter === "Desktop") {
        count = catWps.filter((w) => w.device === "Desktop").length;
      } else if (deviceFilter === "Mobile") {
        count = catWps.filter((w) => w.device === "Mobile").length;
      } else if (deviceFilter === "Square & Avatars") {
        count = catWps.filter((w) => w.device === "Square & Avatars").length;
      }

      return {
        ...cat,
        displayCount: count,
        totalWallpapers: catWps,
      };
    });

    // Search query filter (matches category name, description, or subcategory names)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (cat) =>
          cat.name.toLowerCase().includes(q) ||
          cat.description.toLowerCase().includes(q) ||
          cat.subcategories?.some((s) => s.name.toLowerCase().includes(q))
      );
    }

    // Sort categories
    result.sort((a, b) => {
      if (sortBy === "count") return b.displayCount - a.displayCount;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "subcategories") {
        return (b.subcategories?.length || 0) - (a.subcategories?.length || 0);
      }
      return 0;
    });

    return result;
  }, [categories, wallpapersByCategory, deviceFilter, searchQuery, sortBy]);

  // Representative samples for Device Cards
  const desktopPreviews = useMemo(() => {
    return allWallpapers.filter((w) => w.device === "Desktop").slice(0, 3);
  }, [allWallpapers]);

  const mobilePreviews = useMemo(() => {
    return allWallpapers.filter((w) => w.device === "Mobile").slice(0, 3);
  }, [allWallpapers]);

  const squarePreviews = useMemo(() => {
    return allWallpapers.filter((w) => w.device === "Square & Avatars").slice(0, 3);
  }, [allWallpapers]);

  return (
    <div className="space-y-12">
      {/* Hero Header */}
      <div className="rounded-[10px] bg-white p-6 sm:p-8 border border-[#f2f0ed] shadow-[inset_0_0_0_1px_#f2f0ed] space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[10px] bg-[#ff3e00]/10 text-[#ff3e00] flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff3e00]">
            Thematic Collections
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#121212] tracking-tight">
              Wallpaper Categories & Themes
            </h1>
            <p className="text-[14px] text-[#474645] mt-2 leading-relaxed">
              Every wallpaper in the 4,891-item collection is cataloged into 10 thematic folders, 40+ human-curated subcategories, and 3 dedicated device form factors. Browse your favorite visual genre below.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-[10px] bg-[#f6f4ef] border border-[#e5d5c3] text-center">
              <span className="block text-xl font-bold text-[#121212]">
                {categories.length}
              </span>
              <span className="text-[11px] text-[#7e7e7d]">Themes</span>
            </div>
            <div className="px-4 py-2.5 rounded-[10px] bg-[#f6f4ef] border border-[#e5d5c3] text-center">
              <span className="block text-xl font-bold text-[#121212]">
                40+
              </span>
              <span className="text-[11px] text-[#7e7e7d]">Subgenres</span>
            </div>
            <div className="px-4 py-2.5 rounded-[10px] bg-[#f6f4ef] border border-[#e5d5c3] text-center">
              <span className="block text-xl font-bold text-[#121212]">
                {allWallpapers.length.toLocaleString()}
              </span>
              <span className="text-[11px] text-[#7e7e7d]">Wallpapers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Device Master Showcase: 3 Visual Cards */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#0086fc]" />
          <h2 className="text-base font-bold text-[#121212] tracking-tight">
            Browse By Device Form Factor
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Desktop Master Card */}
          <Link
            href="/desktop"
            className="group rounded-[10px] bg-white p-5 border border-[#f2f0ed] shadow-[inset_0_0_0_1px_#f2f0ed] hover:border-[#e5d5c3] transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Desktop 3-Image Preview Collage */}
              <div className="grid grid-cols-3 gap-1.5 aspect-[16/8] rounded-[8px] overflow-hidden bg-[#f2f0ed] mb-3">
                {desktopPreviews.map((wp) => (
                  <div key={wp.id} className="relative h-full overflow-hidden">
                    <Image
                      src={wp.thumbUrl}
                      alt={wp.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-[8px] bg-[#0086fc]/10 text-[#0086fc] flex items-center justify-center">
                    <Monitor className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#121212] group-hover:text-[#ff3e00] transition-colors">
                      Desktop PC Wallpapers
                    </h3>
                    <p className="text-[11px] text-[#7e7e7d]">16:9 Landscape & Ultrawide</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#f2f0ed] border border-[#e5d5c3] text-[#121212]">
                  {deviceCounts.Desktop.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#f2f0ed] flex items-center justify-between text-xs font-semibold text-[#0086fc]">
              <span>Explore PC Monitors</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Mobile Master Card */}
          <Link
            href="/mobile"
            className="group rounded-[10px] bg-white p-5 border border-[#f2f0ed] shadow-[inset_0_0_0_1px_#f2f0ed] hover:border-[#e5d5c3] transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Mobile 3-Image Preview Collage */}
              <div className="grid grid-cols-3 gap-1.5 aspect-[16/8] rounded-[8px] overflow-hidden bg-[#f2f0ed] mb-3">
                {mobilePreviews.map((wp) => (
                  <div key={wp.id} className="relative h-full overflow-hidden">
                    <Image
                      src={wp.thumbUrl}
                      alt={wp.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-[8px] bg-[#ff58ae]/10 text-[#ff58ae] flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#121212] group-hover:text-[#ff3e00] transition-colors">
                      Mobile Phone Wallpapers
                    </h3>
                    <p className="text-[11px] text-[#7e7e7d]">9:16 Portrait & AMOLED</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#f2f0ed] border border-[#e5d5c3] text-[#121212]">
                  {deviceCounts.Mobile.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#f2f0ed] flex items-center justify-between text-xs font-semibold text-[#ff58ae]">
              <span>Explore Smartphones</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Square & Avatars Master Card */}
          <Link
            href="/?device=Square+%26+Avatars"
            className="group rounded-[10px] bg-white p-5 border border-[#f2f0ed] shadow-[inset_0_0_0_1px_#f2f0ed] hover:border-[#e5d5c3] transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Square 3-Image Preview Collage */}
              <div className="grid grid-cols-3 gap-1.5 aspect-[16/8] rounded-[8px] overflow-hidden bg-[#f2f0ed] mb-3">
                {squarePreviews.map((wp) => (
                  <div key={wp.id} className="relative h-full overflow-hidden">
                    <Image
                      src={wp.thumbUrl}
                      alt={wp.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-[8px] bg-[#ffbb26]/10 text-[#ffbb26] flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#121212] group-hover:text-[#ff3e00] transition-colors">
                      Square & Avatars
                    </h3>
                    <p className="text-[11px] text-[#7e7e7d]">1:1 Ratio for Profile Photos</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#f2f0ed] border border-[#e5d5c3] text-[#121212]">
                  {deviceCounts["Square & Avatars"].toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#f2f0ed] flex items-center justify-between text-xs font-semibold text-[#ffbb26]">
              <span>Explore Square Avatars</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* Main Categories Section with Real-time Filters */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#121212]" />
            <h2 className="text-xl font-bold text-[#121212] tracking-tight">
              All 10 Thematic Categories
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#f2f0ed] text-[#474645]">
              {filteredCategories.length} available
            </span>
          </div>

          {/* Quick Search & Sort Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7e7e7d]" />
              <input
                type="text"
                placeholder="Search categories & subgenres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-2 text-xs rounded-[10px] bg-white border border-[#f2f0ed] shadow-[inset_0_0_0_1px_#f2f0ed] text-[#343433] placeholder-[#7e7e7d] focus:outline-none focus:border-[#e5d5c3]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#7e7e7d] hover:text-[#121212]"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Device Filter Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-[10px] bg-[#f6f4ef] border border-[#e5d5c3]">
              {[
                { label: "All", id: "all" },
                { label: "Desktop", id: "Desktop" },
                { label: "Mobile", id: "Mobile" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDeviceFilter(tab.id)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-[6px] transition-all ${
                    deviceFilter === tab.id
                      ? "bg-[#121212] text-white shadow-xs font-semibold"
                      : "text-[#474645] hover:text-[#121212]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sort Select */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 text-xs font-medium rounded-[10px] bg-white border border-[#f2f0ed] shadow-[inset_0_0_0_1px_#f2f0ed] text-[#343433] focus:outline-none focus:border-[#e5d5c3] cursor-pointer"
            >
              <option value="count">Most Wallpapers</option>
              <option value="name">Name A-Z</option>
              <option value="subcategories">Most Subgenres</option>
            </select>
          </div>
        </div>

        {/* 10 Visual Category Cards Grid */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16 rounded-[10px] bg-white border border-[#f2f0ed] p-8 space-y-3">
            <span className="text-3xl block">🔍</span>
            <h3 className="text-sm font-bold text-[#121212]">
              No categories match "{searchQuery}"
            </h3>
            <p className="text-xs text-[#7e7e7d]">
              Try searching for "anime", "cars", "nature", "space", or "dark".
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setDeviceFilter("all");
              }}
              className="mt-2 px-4 py-1.5 rounded-[32px] bg-[#121212] text-white text-xs font-semibold"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCategories.map((cat) => {
              const previews = categoryPreviews.get(cat.slug) || [];
              const theme = CATEGORY_THEMES[cat.slug] || {
                color: "#121212",
                bg: "bg-[#121212]/10",
                border: "border-[#121212]/20",
              };

              const catWps = cat.totalWallpapers;
              const desktopCount = catWps.filter((w) => w.device === "Desktop").length;
              const mobileCount = catWps.filter((w) => w.device === "Mobile").length;

              return (
                <div
                  key={cat.slug}
                  className="rounded-[10px] bg-white border border-[#f2f0ed] shadow-[inset_0_0_0_1px_#f2f0ed] overflow-hidden flex flex-col justify-between group hover:border-[#e5d5c3] transition-all"
                >
                  <div>
                    {/* Visual 3-Image Collage Banner */}
                    <Link
                      href={`/category/${cat.slug}`}
                      className="block relative aspect-[16/7] overflow-hidden bg-[#f2f0ed] border-b border-[#f2f0ed]"
                    >
                      {previews.length > 0 ? (
                        <div className="grid grid-cols-3 gap-1.5 h-full p-1.5">
                          {/* Large Main Feature Image */}
                          <div className="col-span-2 relative h-full rounded-[6px] overflow-hidden">
                            <Image
                              src={previews[0].thumbUrl}
                              alt={previews[0].title}
                              fill
                              className="object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
                              sizes="(max-width: 1024px) 66vw, 33vw"
                              unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                            <span className="absolute bottom-2 left-2 text-[10px] font-mono text-white/90 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full">
                              {previews[0].width}×{previews[0].height}
                            </span>
                          </div>

                          {/* 2 Stacked Smaller Previews */}
                          <div className="col-span-1 grid grid-rows-2 gap-1.5 h-full">
                            <div className="relative h-full rounded-[6px] overflow-hidden">
                              {previews[1] && (
                                <Image
                                  src={previews[1].thumbUrl}
                                  alt={previews[1].title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                  sizes="(max-width: 1024px) 33vw, 16vw"
                                  unoptimized
                                />
                              )}
                            </div>
                            <div className="relative h-full rounded-[6px] overflow-hidden">
                              {previews[2] && (
                                <Image
                                  src={previews[2].thumbUrl}
                                  alt={previews[2].title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                  sizes="(max-width: 1024px) 33vw, 16vw"
                                  unoptimized
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-[#7e7e7d]">
                          No preview available
                        </div>
                      )}
                    </Link>

                    {/* Card Content */}
                    <div className="p-5 space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link
                            href={`/category/${cat.slug}`}
                            className="text-lg font-bold text-[#121212] group-hover:text-[#ff3e00] transition-colors flex items-center gap-2"
                          >
                            <span>{cat.name}</span>
                          </Link>
                          <p className="text-xs text-[#474645] mt-1 leading-relaxed">
                            {cat.description}
                          </p>
                        </div>

                        <span className="shrink-0 text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-[#f2f0ed] border border-[#e5d5c3] text-[#121212]">
                          {cat.displayCount.toLocaleString()} {deviceFilter === "all" ? "total" : deviceFilter}
                        </span>
                      </div>

                      {/* Device Breakdown Tags */}
                      <div className="flex items-center gap-2 text-[11px] text-[#7e7e7d]">
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-[#f6f4ef] border border-[#f2f0ed]">
                          <Monitor className="w-3 h-3 text-[#0086fc]" />
                          <span>{desktopCount} Desktop</span>
                        </span>
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-[#f6f4ef] border border-[#f2f0ed]">
                          <Smartphone className="w-3 h-3 text-[#ff58ae]" />
                          <span>{mobileCount} Mobile</span>
                        </span>
                      </div>

                      {/* Curated Subcategories Strip */}
                      {cat.subcategories && cat.subcategories.length > 0 && (
                        <div className="pt-3 border-t border-[#f2f0ed] space-y-2">
                          <span className="text-[10px] font-bold text-[#7e7e7d] uppercase tracking-wider block flex items-center gap-1">
                            <Tag className="w-3 h-3 text-[#ff3e00]" />
                            <span>Curated Subgenres:</span>
                          </span>

                          <div className="flex flex-wrap gap-1.5">
                            {cat.subcategories.map((sub) => (
                              <Link
                                key={sub.slug}
                                href={`/category/${cat.slug}`}
                                className="text-[11px] px-2.5 py-1 rounded-[6px] bg-[#f6f4ef] hover:bg-[#121212] text-[#474645] hover:text-white border border-[#e5d5c3] transition-all flex items-center gap-1"
                              >
                                <span>{sub.name}</span>
                                <span className="text-[10px] font-mono opacity-60">
                                  ({sub.count})
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom Action */}
                  <div className="px-5 py-3.5 bg-[#fbfaf9] border-t border-[#f2f0ed] flex items-center justify-between">
                    <span className="text-xs text-[#7e7e7d] font-mono">
                      /categorized/{cat.name}
                    </span>
                    <Link
                      href={`/category/${cat.slug}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[32px] text-xs font-semibold bg-[#121212] hover:bg-[#2c2c2c] text-white shadow-xs transition-all active:scale-95"
                    >
                      <span>Explore Collection</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Complete Subcategories A-Z Cloud */}
      <section className="rounded-[10px] bg-white p-6 sm:p-8 border border-[#f2f0ed] shadow-[inset_0_0_0_1px_#f2f0ed] space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#ff3e00]" />
            <h2 className="text-base font-bold text-[#121212] tracking-tight">
              All 40+ Subgenres & Specific Topics
            </h2>
          </div>
          <span className="text-xs text-[#7e7e7d]">
            Click any topic to explore wallpapers in that theme
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {categories.flatMap((c) =>
            (c.subcategories || []).map((sub) => ({
              ...sub,
              categoryName: c.name,
              categorySlug: c.slug,
            }))
          ).map((item) => (
            <Link
              key={item.slug}
              href={`/category/${item.categorySlug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[32px] bg-[#f6f4ef] hover:bg-[#121212] text-[#343433] hover:text-white border border-[#e5d5c3] text-xs transition-all"
            >
              <span className="font-medium">{item.name}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white/60 text-[#121212] font-semibold group-hover:bg-white/20">
                {item.count}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Advanced Disk Architecture Inspector (Accordion) */}
      <section className="rounded-[10px] bg-white border border-[#f2f0ed] shadow-[inset_0_0_0_1px_#f2f0ed] overflow-hidden">
        <button
          onClick={() => setShowRawTree(!showRawTree)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#f6f4ef] transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <HardDrive className="w-4 h-4 text-[#7e7e7d]" />
            <div>
              <span className="text-xs font-bold text-[#121212] block">
                Physical Directory Tree Structure (On Disk)
              </span>
              <span className="text-[11px] text-[#7e7e7d] font-mono">
                D:\My\wallpaper\categorized\...
              </span>
            </div>
          </div>
          <span className="text-xs font-semibold text-[#0086fc] flex items-center gap-1">
            <span>{showRawTree ? "Hide Directory Tree" : "Show Directory Tree"}</span>
            <ChevronRight
              className={`w-3.5 h-3.5 transition-transform ${
                showRawTree ? "rotate-90" : ""
              }`}
            />
          </span>
        </button>

        {showRawTree && (
          <div className="p-6 border-t border-[#f2f0ed] bg-[#fbfaf9] animate-in fade-in duration-200">
            <FolderTree />
          </div>
        )}
      </section>
    </div>
  );
}
