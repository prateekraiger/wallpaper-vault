"use client";

import React, { useState, useMemo, useTransition } from "react";
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
  Check,
  Palette,
  SlidersHorizontal,
  LayoutGrid,
  Dices,
  Flame,
  Heart,
  Smile
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
  defaultSubcategory?: string;
  title?: string;
  subtitle?: string;
}

export default function WallpaperGrid({
  initialWallpapers,
  categories,
  defaultDevice = "all",
  defaultCategory = "all",
  defaultSubcategory = "all",
  title,
  subtitle,
}: WallpaperGridProps) {
  // Filter States
  const [selectedDevice, setSelectedDevice] = useState<string>(defaultDevice);
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(defaultSubcategory);
  const [selectedVibe, setSelectedVibe] = useState<string>("all");
  const [selectedColor, setSelectedColor] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [only4K, setOnly4K] = useState<boolean>(false);
  const [onlyAmoled, setOnlyAmoled] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("popular");
  const [displayCount, setDisplayCount] = useState<number>(36);
  const [showFolderSidebar, setShowFolderSidebar] = useState<boolean>(false);
  const [gridDensity, setGridDensity] = useState<"standard" | "compact">("standard");
  const [isPending, startTransition] = useTransition();

  // Modal State
  const [activeWallpaper, setActiveWallpaper] = useState<Wallpaper | null>(null);

  // Available Color Palette Tones
  const colorTones = [
    { name: "All Colors", id: "all", bg: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" },
    { name: "OLED Pitch Black", id: "dark", bg: "bg-black border border-white/20" },
    { name: "Deep Blue", id: "blue", bg: "bg-blue-600" },
    { name: "Cosmic Purple", id: "purple", bg: "bg-purple-600" },
    { name: "Crimson Red", id: "red", bg: "bg-rose-600" },
    { name: "Emerald Green", id: "green", bg: "bg-emerald-600" },
    { name: "Solar Amber", id: "amber", bg: "bg-amber-500" },
  ];

  // Human Emotional Vibes
  const humanVibes = [
    { name: "All Vibes", id: "all", icon: "✨" },
    { name: "Late Night Focus", id: "Late Night Focus", icon: "🌙" },
    { name: "High Energy & Adrenaline", id: "High Energy & Adrenaline", icon: "⚡" },
    { name: "Zen & Serenity", id: "Zen & Serenity", icon: "🌿" },
    { name: "Cozy & Lo-Fi", id: "Cozy & Lo-Fi", icon: "☕" },
    { name: "Futuristic & Cyber", id: "Futuristic & Cyber", icon: "🔮" },
    { name: "Creative Spark & Aesthetics", id: "Creative Spark & Aesthetics", icon: "🎨" },
    { name: "Cosmic Wonder", id: "Cosmic Wonder", icon: "🚀" },
  ];

  // Find active category object to display subcategories
  const activeCategoryObj = useMemo(() => {
    if (selectedCategory === "all") return null;
    return categories.find(
      (c) => c.slug === selectedCategory || c.name.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [selectedCategory, categories]);

  // Handle Search Input with non-blocking Transition
  const handleSearchChange = (val: string) => {
    startTransition(() => {
      setSearchQuery(val);
      setDisplayCount(36);
    });
  };

  // Trigger "Surprise Me" Random Wallpaper
  const handleSurpriseMe = () => {
    if (filteredWallpapers.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredWallpapers.length);
    setActiveWallpaper(filteredWallpapers[randomIndex]);
  };

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

    // Subcategory filter
    if (selectedSubcategory !== "all") {
      result = result.filter(
        (w) => w.subcategorySlug === selectedSubcategory || w.subcategory === selectedSubcategory
      );
    }

    // Vibe filter
    if (selectedVibe !== "all") {
      result = result.filter((w) => w.vibe === selectedVibe);
    }

    // Color tone filter
    if (selectedColor !== "all") {
      result = result.filter((w) => {
        const hex = (w.dominantColor || "").toLowerCase();
        if (selectedColor === "dark") return w.isAmoled || hex.startsWith("#0") || hex.startsWith("#1");
        if (selectedColor === "blue") return hex.includes("3") || hex.includes("4") || hex.includes("blue");
        if (selectedColor === "purple") return hex.includes("7") || hex.includes("8") || hex.includes("a");
        if (selectedColor === "red") return hex.includes("f") || hex.includes("c") || hex.includes("red");
        if (selectedColor === "green") return hex.includes("2") || hex.includes("5") || hex.includes("green");
        if (selectedColor === "amber") return hex.includes("e") || hex.includes("d");
        return true;
      });
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
          (w.subcategory && w.subcategory.toLowerCase().includes(q)) ||
          (w.vibe && w.vibe.toLowerCase().includes(q)) ||
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
    selectedSubcategory,
    selectedVibe,
    selectedColor,
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
    setSelectedSubcategory("all");
    setSelectedVibe("all");
    setSelectedColor("all");
    setSearchQuery("");
    setOnly4K(false);
    setOnlyAmoled(false);
    setSortBy("popular");
  };

  return (
    <div className="w-full">
      {/* Title Section */}
      {(title || subtitle) && (
        <div className="mb-8">
          {title && (
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <span>{title}</span>
            </h1>
          )}
          {subtitle && (
            <p className="text-sm text-gray-300 mt-2 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Control Bar */}
      <div className="space-y-4 mb-8">
        {/* Device Switcher & Quick Action Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl glass-panel border border-white/10 overflow-x-auto shadow-sm">
            <button
              onClick={() => {
                setSelectedDevice("all");
                setDisplayCount(36);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedDevice === "all"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
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
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedDevice === "Desktop"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
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
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedDevice === "Mobile"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
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
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedDevice === "Square & Avatars"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Square & Avatars</span>
            </button>
          </div>

          {/* Action buttons (Surprise Me, Folder toggle & Density) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Surprise Me Button */}
            <button
              onClick={handleSurpriseMe}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-amber-500/20 to-purple-500/20 hover:from-amber-500/30 hover:to-purple-500/30 text-amber-300 border border-amber-500/30 shadow-md shadow-amber-500/10 transition-all transform active:scale-95"
              title="Pick a random wallpaper for me!"
            >
              <Dices className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>Surprise Me</span>
            </button>

            {/* Density toggle */}
            <button
              onClick={() => setGridDensity(gridDensity === "standard" ? "compact" : "standard")}
              className="p-2.5 rounded-xl glass-panel text-gray-300 hover:text-white border border-white/10 hidden md:flex items-center justify-center transition-colors"
              title={gridDensity === "standard" ? "Switch to Compact 5-col Grid" : "Switch to Standard Grid"}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>

            {/* Folder directory toggle */}
            <button
              onClick={() => setShowFolderSidebar(!showFolderSidebar)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold border transition-colors ${
                showFolderSidebar
                  ? "bg-indigo-600/20 text-indigo-300 border-indigo-500/40"
                  : "glass-panel text-gray-300 hover:text-white border-white/10"
              }`}
            >
              <FolderTreeIcon className="w-4 h-4 text-indigo-400" />
              <span>{showFolderSidebar ? "Hide Folders" : "Folders"}</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by keywords, subcategory, mood, car, anime, color (e.g. Porsche, Neon Tokyo, Alpine, Cyberpunk)..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-2xl glass-panel border border-white/10 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSubcategory("all");
              setDisplayCount(36);
            }}
            className="px-4 py-3 rounded-2xl glass-panel border border-white/10 text-xs font-medium text-gray-200 bg-[#0a0f1d] focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name} ({c.count})
              </option>
            ))}
          </select>

          {/* Sort By Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 rounded-2xl glass-panel border border-white/10 text-xs font-medium text-gray-200 bg-[#0a0f1d] focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="popular">Curated Popular & 4K</option>
            <option value="resolution">Highest Resolution</option>
            <option value="size">Largest File Size</option>
            <option value="name">Name A-Z</option>
          </select>

          {/* 4K and AMOLED Toggles */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnly4K(!only4K)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold border transition-all ${
                only4K
                  ? "bg-gradient-to-r from-amber-400 to-amber-500 text-black border-amber-300 shadow-lg shadow-amber-500/25"
                  : "glass-panel text-gray-300 hover:text-white border-white/10"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>4K UHD</span>
            </button>

            <button
              onClick={() => setOnlyAmoled(!onlyAmoled)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold border transition-all ${
                onlyAmoled
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30"
                  : "glass-panel text-gray-300 hover:text-white border-white/10"
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>AMOLED</span>
            </button>
          </div>
        </div>

        {/* Human Emotional Mood / Vibe Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-indigo-300 flex items-center gap-1 pr-1 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Mood:
          </span>
          {humanVibes.map((vibe) => {
            const isVibeActive = selectedVibe === vibe.id;
            return (
              <button
                key={vibe.id}
                onClick={() => {
                  setSelectedVibe(vibe.id);
                  setDisplayCount(36);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap border transition-all ${
                  isVibeActive
                    ? "bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30 font-bold"
                    : "bg-white/5 border-white/5 text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <span>{vibe.icon}</span>
                <span>{vibe.name}</span>
              </button>
            );
          })}
        </div>

        {/* Color Tones Quick Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1 pr-1 shrink-0">
            <Palette className="w-3.5 h-3.5 text-indigo-400" /> Palette:
          </span>
          {colorTones.map((tone) => {
            const isToneActive = selectedColor === tone.id;
            return (
              <button
                key={tone.id}
                onClick={() => {
                  setSelectedColor(tone.id);
                  setDisplayCount(36);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap border transition-all ${
                  isToneActive
                    ? "bg-white/15 border-white text-white font-bold"
                    : "bg-white/5 border-white/5 text-gray-400 hover:text-white"
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${tone.bg}`} />
                <span>{tone.name}</span>
              </button>
            );
          })}
        </div>

        {/* Top-Level Category Horizon Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSelectedSubcategory("all");
              setDisplayCount(36);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === "all"
                ? "bg-white text-black font-bold shadow-md"
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
                onClick={() => {
                  setSelectedCategory(cat.slug);
                  setSelectedSubcategory("all");
                  setDisplayCount(36);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/30"
                    : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5"
                }`}
              >
                <span>{cat.name}</span>
                <span className="text-[10px] opacity-60">({cat.count})</span>
              </button>
            );
          })}
        </div>

        {/* Subcategory Pills Row (When a category is active) */}
        {activeCategoryObj && activeCategoryObj.subcategories && activeCategoryObj.subcategories.length > 0 && (
          <div className="p-3 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 flex items-center gap-2 overflow-x-auto scrollbar-none animate-in fade-in duration-200">
            <span className="text-[11px] font-bold text-indigo-300 shrink-0 uppercase tracking-wider pr-1">
              Subcategories:
            </span>
            <button
              onClick={() => {
                setSelectedSubcategory("all");
                setDisplayCount(36);
              }}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedSubcategory === "all"
                  ? "bg-indigo-600 text-white font-bold shadow-sm"
                  : "bg-white/5 text-gray-400 hover:text-white border border-white/5"
              }`}
            >
              All {activeCategoryObj.name}
            </button>
            {activeCategoryObj.subcategories.map((sub) => {
              const isSubActive = selectedSubcategory === sub.slug;
              return (
                <button
                  key={sub.slug}
                  onClick={() => {
                    setSelectedSubcategory(sub.slug);
                    setDisplayCount(36);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSubActive
                      ? "bg-indigo-600 text-white font-bold shadow-sm"
                      : "bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border border-white/5"
                  }`}
                >
                  <span>{sub.name}</span>
                  <span className="text-[10px] font-mono opacity-70">({sub.count})</span>
                </button>
              );
            })}
          </div>
        )}
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
                setSelectedSubcategory("all");
              }}
            />
          </div>
        )}

        {/* Wallpaper Grid */}
        <div className="flex-1">
          {/* Active Filter Summary Bar */}
          <div className="flex items-center justify-between text-xs text-gray-400 mb-4 px-1">
            <p>
              Showing <span className="font-bold text-white">{visibleWallpapers.length}</span> of{" "}
              <span className="font-bold text-white">{filteredWallpapers.length}</span> wallpapers
              {selectedDevice !== "all" && ` in ${selectedDevice}`}
              {selectedCategory !== "all" && ` / ${selectedCategory}`}
              {selectedSubcategory !== "all" && ` (${selectedSubcategory})`}
              {selectedVibe !== "all" && ` • Vibe: ${selectedVibe}`}
              {selectedColor !== "all" && ` • ${selectedColor} palette`}
            </p>

            {(selectedDevice !== "all" ||
              selectedCategory !== "all" ||
              selectedSubcategory !== "all" ||
              selectedVibe !== "all" ||
              selectedColor !== "all" ||
              searchQuery ||
              only4K ||
              onlyAmoled) && (
              <button
                onClick={resetFilters}
                className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Grid of Cards */}
          {filteredWallpapers.length === 0 ? (
            <div className="text-center py-20 rounded-3xl glass-panel border border-white/10 p-8 space-y-4">
              <Sparkles className="w-10 h-10 text-indigo-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">
                No wallpapers matched that exact combination
              </h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                Try loosening your filters or search for something popular like:
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-1">
                {["Neon Tokyo", "Alpine Peak", "McLaren", "OLED Deep Black", "Cyberpunk", "Ocean Wave"].map((k) => (
                  <button
                    key={k}
                    onClick={() => {
                      resetFilters();
                      handleSearchChange(k);
                    }}
                    className="px-3 py-1 rounded-full text-xs bg-white/5 hover:bg-white/10 text-indigo-300 border border-white/10 transition-colors"
                  >
                    #{k}
                  </button>
                ))}
              </div>
              <div>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-lg shadow-indigo-600/30"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          ) : (
            <>
              <div
                className={`grid gap-4 sm:gap-5 ${
                  gridDensity === "compact"
                    ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                    : "grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4"
                }`}
              >
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
                <div className="text-center mt-12 mb-8">
                  <button
                    onClick={loadMore}
                    className="px-8 py-3.5 rounded-2xl font-bold text-sm bg-indigo-600/15 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 shadow-xl transition-all transform hover:scale-105"
                  >
                    Load More Wallpapers ({filteredWallpapers.length - displayCount} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Lightbox Modal with Related Wallpapers */}
      <WallpaperModal
        wallpaper={activeWallpaper}
        allWallpapers={initialWallpapers}
        onClose={() => setActiveWallpaper(null)}
        onPrev={handlePrev}
        onNext={handleNext}
        onSelectRelated={(w) => setActiveWallpaper(w)}
      />
    </div>
  );
}
