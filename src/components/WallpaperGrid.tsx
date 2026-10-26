"use client";

import React, { useState, useMemo, useTransition } from "react";
import { 
  Search, 
  Monitor, 
  Smartphone, 
  Layers, 
  Moon, 
  X,
  FolderTree as FolderTreeIcon,
  Grid,
  Palette,
  LayoutGrid,
  Dices,
  RotateCcw
} from "lucide-react";
import { Wallpaper, CategoryInfo } from "@/types/wallpaper";
import WallpaperCard from "@/components/WallpaperCard";
import WallpaperModal from "@/components/WallpaperModal";
import FolderTree from "@/components/FolderTree";
import MasonryGrid from "@/components/MasonryGrid";

interface WallpaperGridProps {
  initialWallpapers: Wallpaper[];
  categories: CategoryInfo[];
  defaultDevice?: "all" | "Desktop" | "Mobile" | "Square & Avatars";
  defaultCategory?: string;
  defaultSubcategory?: string;
  title?: string;
  subtitle?: string;
  isHomePage?: boolean;
}

export default function WallpaperGrid({
  initialWallpapers,
  categories,
  defaultDevice = "all",
  defaultCategory = "all",
  defaultSubcategory = "all",
  title,
  subtitle,
  isHomePage = false,
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
    { name: "All Colors", id: "all", bg: "bg-[#121212]" },
    { name: "OLED Pitch Black", id: "dark", bg: "bg-[#000000] border border-[#e5d5c3]" },
    { name: "Sky Blue", id: "blue", bg: "bg-[#0086fc]" },
    { name: "Plum Violet", id: "purple", bg: "bg-[#9f4fff]" },
    { name: "Ember Red", id: "red", bg: "bg-[#ff3e00]" },
    { name: "Grass Green", id: "green", bg: "bg-[#00c978]" },
    { name: "Sun Yellow", id: "amber", bg: "bg-[#ffbb26]" },
  ];

  // Human Emotional Vibes from Family Tone
  const humanVibes = [
    { name: "All Vibes", id: "all", icon: "•" },
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
    } else if (filteredWallpapers.length > 0) {
      setActiveWallpaper(filteredWallpapers[filteredWallpapers.length - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredWallpapers.length - 1) {
      setActiveWallpaper(filteredWallpapers[currentIndex + 1]);
    } else if (filteredWallpapers.length > 0) {
      setActiveWallpaper(filteredWallpapers[0]);
    }
  };

  const resetFilters = () => {
    setSelectedDevice(defaultDevice);
    setSelectedCategory(defaultCategory);
    setSelectedSubcategory(defaultSubcategory);
    setSelectedVibe("all");
    setSelectedColor("all");
    setSearchQuery("");
    setOnly4K(false);
    setOnlyAmoled(false);
    setSortBy("popular");
  };

  return (
    <div className="w-full">
      {/* Title Section (Optional) */}
      {(title || subtitle) && (
        <div className="mb-8">
          {title && (
            <h1 className="text-3xl sm:text-4xl font-semibold text-[#121212] tracking-tight">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-[15px] text-[#474645] mt-1.5 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Control Area */}
      <div className="space-y-4 mb-8">
        {/* Device Switcher & Top Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Device Tabs Bar */}
          <div className="flex items-center gap-1.5 p-1 rounded-[10px] bg-white border border-[#f2f0ed] shadow-[inset_0_0_0_1px_#f2f0ed] overflow-x-auto">
            <button
              onClick={() => {
                setSelectedDevice("all");
                setDisplayCount(36);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-[32px] text-xs whitespace-nowrap transition-all ${
                selectedDevice === "all"
                  ? "bg-[#121212] text-white font-medium"
                  : "text-[#474645] hover:text-[#121212] hover:bg-[#f6f4ef]"
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
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-[32px] text-xs whitespace-nowrap transition-all ${
                selectedDevice === "Desktop"
                  ? "bg-[#121212] text-white font-medium"
                  : "text-[#474645] hover:text-[#121212] hover:bg-[#f6f4ef]"
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
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-[32px] text-xs whitespace-nowrap transition-all ${
                selectedDevice === "Mobile"
                  ? "bg-[#121212] text-white font-medium"
                  : "text-[#474645] hover:text-[#121212] hover:bg-[#f6f4ef]"
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
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-[32px] text-xs whitespace-nowrap transition-all ${
                selectedDevice === "Square & Avatars"
                  ? "bg-[#121212] text-white font-medium"
                  : "text-[#474645] hover:text-[#121212] hover:bg-[#f6f4ef]"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Square & Avatars</span>
            </button>
          </div>

          {/* Action buttons (Surprise Me, Density & Folders) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Surprise Me - Sand Pill with Honey/Yellow Accent */}
            <button
              onClick={handleSurpriseMe}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[32px] text-xs font-semibold bg-[#f6f4ef] hover:bg-[#edeae2] text-[#121212] border border-[#e5d5c3] shadow-xs transition-all active:scale-95"
              title="Pick a random wallpaper for me!"
            >
              <Dices className="w-3.5 h-3.5 text-[#ffbb26]" />
              <span>Surprise Me</span>
            </button>

            {/* Density toggle */}
            <button
              onClick={() => setGridDensity(gridDensity === "standard" ? "compact" : "standard")}
              className="p-2 rounded-[10px] bg-white border border-[#f2f0ed] text-[#474645] hover:text-[#121212] hover:bg-[#f6f4ef] hidden md:flex items-center justify-center transition-colors shadow-xs"
              title={gridDensity === "standard" ? "Switch to Compact Grid" : "Switch to Standard Grid"}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>

            {/* Folder directory toggle */}
            {!isHomePage && (
              <button
                onClick={() => setShowFolderSidebar(!showFolderSidebar)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-[32px] text-xs font-medium border transition-colors shadow-xs ${
                  showFolderSidebar
                    ? "bg-[#121212] text-white border-[#121212]"
                    : "bg-white text-[#474645] hover:text-[#121212] hover:bg-[#f6f4ef] border-[#f2f0ed]"
                }`}
              >
                <FolderTreeIcon className="w-3.5 h-3.5 text-[#0086fc]" />
                <span>{showFolderSidebar ? "Hide Folders" : "Folders"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Search & Filter Row */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
          {/* Search Box - White with Hairline Inset Border */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7e7e7d]" />
            <input
              type="text"
              placeholder="Search by keywords, subcategory, mood, car, anime, color (e.g. Porsche, Neon Tokyo, Alpine)..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-[10px] bg-white border border-[#f2f0ed] shadow-[inset_0_0_0_1px_#f2f0ed] text-xs text-[#343433] placeholder-[#7e7e7d] focus:outline-none focus:border-[#e5d5c3] focus:shadow-[inset_0_0_0_1px_#e5d5c3] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7e7e7d] hover:text-[#121212] p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Dropdown (for non-home pages) */}
          {!isHomePage && (
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubcategory("all");
                setDisplayCount(36);
              }}
              className="px-3.5 py-2.5 rounded-[10px] bg-white border border-[#f2f0ed] shadow-[inset_0_0_0_1px_#f2f0ed] text-xs font-medium text-[#343433] focus:outline-none focus:border-[#e5d5c3] cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name} ({c.count})
                </option>
              ))}
            </select>
          )}

          {/* Sort By Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3.5 py-2.5 rounded-[10px] bg-white border border-[#f2f0ed] shadow-[inset_0_0_0_1px_#f2f0ed] text-xs font-medium text-[#343433] focus:outline-none focus:border-[#e5d5c3] cursor-pointer"
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
              className={`flex items-center gap-1.5 px-3 py-2 rounded-[32px] text-xs font-semibold border transition-all ${
                only4K
                  ? "bg-[#ffbb26] text-[#121212] border-[#ffbb26] shadow-xs"
                  : "bg-white text-[#474645] hover:text-[#121212] border-[#f2f0ed]"
              }`}
            >
              <span>4K UHD</span>
            </button>

            <button
              onClick={() => setOnlyAmoled(!onlyAmoled)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-[32px] text-xs font-semibold border transition-all ${
                onlyAmoled
                  ? "bg-[#00ca48] text-white border-[#00ca48] shadow-xs"
                  : "bg-white text-[#474645] hover:text-[#121212] border-[#f2f0ed]"
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-[#00ca48]" />
              <span>AMOLED</span>
            </button>
          </div>
        </div>

        {/* Human Emotional Mood / Vibe Filter Pills (hidden on clean home page) */}
        {!isHomePage && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-semibold text-[#474645] flex items-center gap-1 pr-1 shrink-0">
              Mood:
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
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[32px] text-[11px] whitespace-nowrap border transition-all ${
                    isVibeActive
                      ? "bg-[#121212] text-white border-[#121212] font-semibold"
                      : "bg-white border-[#f2f0ed] text-[#474645] hover:text-[#121212] hover:bg-[#f6f4ef]"
                  }`}
                >
                  <span>{vibe.icon}</span>
                  <span>{vibe.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Color Tones Quick Bar (hidden on clean home page) */}
        {!isHomePage && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-semibold text-[#474645] flex items-center gap-1 pr-1 shrink-0">
              <Palette className="w-3 h-3 text-[#0086fc]" /> Palette:
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
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[32px] text-[11px] whitespace-nowrap border transition-all ${
                    isToneActive
                      ? "bg-[#f2f0ed] border-[#e5d5c3] text-[#121212] font-semibold"
                      : "bg-white border-[#f2f0ed] text-[#7e7e7d] hover:text-[#121212]"
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${tone.bg}`} />
                  <span>{tone.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Top-Level Category Horizon Tabs (hidden on clean home page) */}
        {!isHomePage && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedSubcategory("all");
                setDisplayCount(36);
              }}
              className={`px-3 py-1 rounded-[32px] text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === "all"
                  ? "bg-[#121212] text-white font-medium"
                  : "bg-white text-[#474645] hover:text-[#121212] hover:bg-[#f6f4ef] border border-[#f2f0ed]"
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
                  className={`px-3 py-1 rounded-[32px] text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-[#121212] text-white font-semibold"
                      : "bg-white text-[#474645] hover:text-[#121212] hover:bg-[#f6f4ef] border border-[#f2f0ed]"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] opacity-70">({cat.count})</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Subcategory Pills Row (When a category is active, hidden on home page) */}
        {!isHomePage && activeCategoryObj && activeCategoryObj.subcategories && activeCategoryObj.subcategories.length > 0 && (
          <div className="p-3 rounded-[10px] bg-[#f2f0ed] border border-[#e5d5c3] flex items-center gap-1.5 overflow-x-auto scrollbar-none animate-in fade-in duration-150">
            <span className="text-[11px] font-bold text-[#121212] shrink-0 uppercase tracking-wider pr-1">
              Subcategories:
            </span>
            <button
              onClick={() => {
                setSelectedSubcategory("all");
                setDisplayCount(36);
              }}
              className={`px-3 py-1 rounded-[32px] text-xs font-medium whitespace-nowrap transition-all ${
                selectedSubcategory === "all"
                  ? "bg-[#121212] text-white font-bold"
                  : "bg-white text-[#474645] hover:text-[#121212] border border-[#e5d5c3]"
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
                  className={`px-3 py-1 rounded-[32px] text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSubActive
                      ? "bg-[#121212] text-white font-bold"
                      : "bg-white text-[#474645] hover:text-[#121212] hover:bg-[#f6f4ef] border border-[#e5d5c3]"
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
          <div className="flex items-center justify-between text-xs text-[#7e7e7d] mb-4 px-1">
            <p>
              Showing <span className="font-bold text-[#121212]">{visibleWallpapers.length}</span> of{" "}
              <span className="font-bold text-[#121212]">{filteredWallpapers.length}</span> wallpapers
              {selectedDevice !== "all" && ` in ${selectedDevice}`}
              {selectedCategory !== "all" && ` / ${selectedCategory}`}
              {selectedSubcategory !== "all" && ` (${selectedSubcategory})`}
              {selectedVibe !== "all" && ` • ${selectedVibe}`}
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
                className="text-[#ff3e00] hover:underline flex items-center gap-1 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Grid of Cards */}
          {filteredWallpapers.length === 0 ? (
            <div className="text-center py-16 rounded-[10px] bg-white border border-[#f2f0ed] shadow-[inset_0_0_0_1px_#f2f0ed] p-8 space-y-4">
              <span className="text-4xl block">🎨</span>
              <h3 className="text-base font-bold text-[#121212]">
                No wallpapers matched that exact search
              </h3>
              <p className="text-xs text-[#7e7e7d] max-w-sm mx-auto leading-relaxed">
                Try loosening your filters or explore one of these popular collections:
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-1">
                {["Neon Tokyo", "Alpine Peak", "McLaren", "OLED Deep Black", "Cyberpunk", "Ocean Wave"].map((k) => (
                  <button
                    key={k}
                    onClick={() => {
                      resetFilters();
                      handleSearchChange(k);
                    }}
                    className="px-3 py-1 rounded-[32px] text-xs bg-[#f6f4ef] hover:bg-[#edeae2] text-[#343433] border border-[#e5d5c3] transition-colors"
                  >
                    #{k}
                  </button>
                ))}
              </div>
              <div>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-5 py-2 rounded-[32px] text-xs font-semibold bg-[#121212] hover:bg-[#2c2c2c] text-white transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          ) : (
            <>
              <MasonryGrid
                wallpapers={visibleWallpapers}
                density={gridDensity}
                onPreview={(w) => setActiveWallpaper(w)}
              />

              {/* Load More Button - Family Sand Pill / Dark Pill */}
              {hasMore && (
                <div className="text-center mt-12 mb-8">
                  <button
                    onClick={loadMore}
                    className="px-6 py-2.5 rounded-[32px] font-semibold text-xs bg-[#121212] hover:bg-[#2c2c2c] text-[#fbfaf9] shadow-sm transition-all transform hover:scale-102"
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
