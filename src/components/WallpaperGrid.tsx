"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, 
  Filter, 
  Monitor, 
  Smartphone, 
  Layers, 
  Sparkles, 
  Moon, 
  ArrowUpDown, 
  X,
  FolderTree as FolderTreeIcon,
  Grid,
  Check
} from "lucide-react";
import { Wallpaper, CategoryInfo } from "@/types/wallpaper";
import WallpaperCard from "@/components/WallpaperCard";
import WallpaperModal from "@/components/WallpaperModal";
import FolderTree from "@/components/FolderTree";

interface WallpaperGridProps {
  initialWallpapers: Wallpaper[];
  categories: CategoryInfo[];
  defaultDevice?: "all" | "Desktop" | "Mobile" | "Square & Avatars";
  defaultCategory?: string;
  title?: string;
  subtitle?: string;
}

export default function WallpaperGrid({
  initialWallpapers,
  categories,
  defaultDevice = "all",
  defaultCategory = "all",
  title,
  subtitle,
}: WallpaperGridProps) {
  // Filter States
  const [selectedDevice, setSelectedDevice] = useState<string>(defaultDevice);
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [only4K, setOnly4K] = useState<boolean>(false);
  const [onlyAmoled, setOnlyAmoled] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("popular");
  const [displayCount, setDisplayCount] = useState<number>(36);
  const [showFolderSidebar, setShowFolderSidebar] = useState<boolean>(false);

  // Modal State
  const [activeWallpaper, setActiveWallpaper] = useState<Wallpaper | null>(null);

  // Filter & Sort Logic
  const filteredWallpapers = useMemo(() => {
    let result = [...initialWallpapers];

    // Device filter
    if (selectedDevice !== "all") {
      result = result.filter((w) => w.device === selectedDevice);
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter(
        (w) => w.categorySlug === selectedCategory || w.category === selectedCategory
      );
    }

    // 4K filter
    if (only4K) {
      result = result.filter((w) => w.is4K);
    }

    // AMOLED filter
    if (onlyAmoled) {
      result = result.filter((w) => w.isAmoled);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((w) => {
        return (
          w.title.toLowerCase().includes(q) ||
          w.category.toLowerCase().includes(q) ||
          w.device.toLowerCase().includes(q) ||
          w.tags.some((t) => t.toLowerCase().includes(q))
        );
      });
    }

    // Sorting
    if (sortBy === "resolution") {
      result.sort((a, b) => b.width * b.height - a.width * a.height);
    } else if (sortBy === "size") {
      result.sort((a, b) => b.sizeBytes - a.sizeBytes);
    } else if (sortBy === "name") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "popular") {
      result.sort((a, b) => {
        if (a.isShowcase && !b.isShowcase) return -1;
        if (!a.isShowcase && b.isShowcase) return 1;
        return b.width * b.height - a.width * a.height;
      });
    }

    return result;
  }, [
    initialWallpapers,
    selectedDevice,
    selectedCategory,
    only4K,
    onlyAmoled,
    searchQuery,
    sortBy,
  ]);

  const visibleWallpapers = filteredWallpapers.slice(0, displayCount);
  const hasMore = displayCount < filteredWallpapers.length;

  const loadMore = () => {
    setDisplayCount((prev) => prev + 36);
  };

  // Modal Navigation
  const currentIndex = activeWallpaper
    ? filteredWallpapers.findIndex((w) => w.id === activeWallpaper.id)
    : -1;

  const handlePrev = () => {
    if (currentIndex > 0) {
      setActiveWallpaper(filteredWallpapers[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredWallpapers.length - 1) {
      setActiveWallpaper(filteredWallpapers[currentIndex + 1]);
    }
  };

  const resetFilters = () => {
    setSelectedDevice("all");
    setSelectedCategory("all");
    setSearchQuery("");
    setOnly4K(false);
    setOnlyAmoled(false);
    setSortBy("popular");
  };

  return (
    <div className="w-full">
      {/* Optional Title Section */}
      {(title || subtitle) && (
        <div className="mb-8">
          {title && (
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-sm text-gray-400 mt-2 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Control Bar */}
      <div className="space-y-4 mb-8">
        {/* Device Switcher Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 p-1.5 rounded-xl glass-panel border border-white/10 overflow-x-auto">
            <button
              onClick={() => {
                setSelectedDevice("all");
                setDisplayCount(36);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDevice === "all"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>All Collection ({initialWallpapers.length})</span>
            </button>

            <button
              onClick={() => {
                setSelectedDevice("Desktop");
                setDisplayCount(36);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDevice === "Desktop"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop (PC)</span>
            </button>

            <button
              onClick={() => {
                setSelectedDevice("Mobile");
                setDisplayCount(36);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDevice === "Mobile"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile (Phone)</span>
            </button>

            <button
              onClick={() => {
                setSelectedDevice("Square & Avatars");
                setDisplayCount(36);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDevice === "Square & Avatars"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Square & Avatars</span>
            </button>
          </div>

          {/* Toggle Folder Directory Sidebar */}
          <button
            onClick={() => setShowFolderSidebar(!showFolderSidebar)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors ${
              showFolderSidebar
                ? "bg-indigo-600/20 text-indigo-300 border-indigo-500/40"
                : "glass-panel text-gray-300 hover:text-white border-white/10"
            }`}
          >
            <FolderTreeIcon className="w-4 h-4 text-indigo-400" />
            <span>{showFolderSidebar ? "Hide Folder Tree" : "Folder Explorer"}</span>
          </button>
        </div>

        {/* Search & Filter Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by anime, car, nature, color, tags (e.g. Gojo, Porsche, Cyberpunk)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl glass-panel border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl glass-panel border border-white/10 text-xs text-gray-200 bg-[#0d1424] focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name} ({c.count})
              </option>
            ))}
          </select>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl glass-panel border border-white/10 text-xs text-gray-200 bg-[#0d1424] focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="popular">Popular & 4K</option>
              <option value="resolution">Highest Resolution</option>
              <option value="size">Largest File Size</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>

          {/* 4K and AMOLED Toggles */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnly4K(!only4K)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                only4K
                  ? "bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20"
                  : "glass-panel text-gray-400 hover:text-white border-white/10"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>4K UHD</span>
            </button>

            <button
              onClick={() => setOnlyAmoled(!onlyAmoled)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                onlyAmoled
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30"
                  : "glass-panel text-gray-400 hover:text-white border-white/10"
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>AMOLED</span>
            </button>
          </div>
        </div>

        {/* Category Pills Horizon */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === "all"
                ? "bg-white text-black font-semibold shadow-sm"
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5"
            }`}
          >
            All Themes
          </button>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.slug || selectedCategory === cat.name;
            return (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/25"
                    : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5"
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-60">({cat.count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Layout with optional Folder Tree Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Folder Explorer Sidebar */}
        {showFolderSidebar && (
          <div className="w-full lg:w-72 shrink-0 animate-in fade-in duration-200">
            <FolderTree
              selectedDevice={selectedDevice}
              selectedCategory={selectedCategory}
              onSelectFolder={(dev, cat) => {
                setSelectedDevice(dev);
                setSelectedCategory(cat);
              }}
            />
          </div>
        )}

        {/* Wallpaper Grid */}
        <div className="flex-1">
          {/* Active Filter Summary Bar */}
          <div className="flex items-center justify-between text-xs text-gray-400 mb-4 px-1">
            <p>
              Showing <span className="font-semibold text-white">{visibleWallpapers.length}</span> of{" "}
              <span className="font-semibold text-white">{filteredWallpapers.length}</span> wallpapers
              {selectedDevice !== "all" && ` in ${selectedDevice}`}
              {selectedCategory !== "all" && ` / ${selectedCategory}`}
            </p>

            {(selectedDevice !== "all" ||
              selectedCategory !== "all" ||
              searchQuery ||
              only4K ||
              onlyAmoled) && (
              <button
                onClick={resetFilters}
                className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Grid of Cards */}
          {filteredWallpapers.length === 0 ? (
            <div className="text-center py-20 rounded-2xl glass-panel border border-white/10 p-8">
              <Sparkles className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white">
                No wallpapers match your filters
              </h3>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                Try searching with different terms or reset your filters to explore all 4,800+ wallpapers.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                {visibleWallpapers.map((wp) => (
                  <WallpaperCard
                    key={wp.id}
                    wallpaper={wp}
                    onPreview={(w) => setActiveWallpaper(w)}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center mt-12 mb-6">
                  <button
                    onClick={loadMore}
                    className="px-8 py-3.5 rounded-xl font-semibold text-sm bg-white/5 hover:bg-white/10 text-white border border-white/10 shadow-lg hover:border-indigo-500/40 transition-all transform hover:scale-105"
                  >
                    Load More Wallpapers ({filteredWallpapers.length - displayCount} left)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      <WallpaperModal
        wallpaper={activeWallpaper}
        onClose={() => setActiveWallpaper(null)}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  );
}
