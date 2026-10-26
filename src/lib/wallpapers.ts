import fs from "fs";
import path from "path";
import { Wallpaper, WallpapersData, CategoryInfo } from "@/types/wallpaper";

let cachedData: WallpapersData | null = null;

export function getWallpapersData(): WallpapersData {
  if (cachedData) return cachedData;
  const filePath = path.join(process.cwd(), "data", "wallpapers.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  cachedData = JSON.parse(raw);
  return cachedData!;
}

export function getAllWallpapers(): Wallpaper[] {
  return getWallpapersData().wallpapers;
}

export function getCategories(): CategoryInfo[] {
  return getWallpapersData().categories;
}

export function getDeviceCounts() {
  return getWallpapersData().deviceCounts;
}

export function getWallpaperById(id: string): Wallpaper | undefined {
  return getAllWallpapers().find((w) => w.id === id);
}

export function getWallpapersByCategory(slug: string): Wallpaper[] {
  return getAllWallpapers().filter((w) => w.categorySlug === slug);
}

export function getWallpapersByDevice(device: string): Wallpaper[] {
  const norm = device.toLowerCase();
  return getAllWallpapers().filter((w) => {
    if (norm === "desktop") return w.device === "Desktop";
    if (norm === "mobile") return w.device === "Mobile";
    if (norm === "square" || norm === "square-avatars") return w.device === "Square & Avatars";
    return true;
  });
}

export interface FilterOptions {
  category?: string;
  device?: string;
  search?: string;
  orientation?: string;
  is4K?: boolean;
  isAmoled?: boolean;
  sortBy?: "newest" | "popular" | "resolution" | "size" | "name";
  page?: number;
  limit?: number;
}

export function queryWallpapers(options: FilterOptions) {
  const {
    category,
    device,
    search,
    orientation,
    is4K,
    isAmoled,
    sortBy = "popular",
    page = 1,
    limit = 30,
  } = options;

  let results = getAllWallpapers();

  // Filter by Device (Desktop vs Mobile vs Square)
  if (device && device !== "all") {
    const devLower = device.toLowerCase();
    results = results.filter((w) => {
      if (devLower === "desktop") return w.device === "Desktop";
      if (devLower === "mobile") return w.device === "Mobile";
      if (devLower === "square" || devLower === "square-avatars")
        return w.device === "Square & Avatars";
      return true;
    });
  }

  // Filter by Category
  if (category && category !== "all") {
    results = results.filter(
      (w) => w.categorySlug === category || w.category === category
    );
  }

  // Filter by Orientation
  if (orientation && orientation !== "all") {
    results = results.filter((w) => w.orientation === orientation);
  }

  // Filter by 4K
  if (is4K) {
    results = results.filter((w) => w.is4K);
  }

  // Filter by AMOLED
  if (isAmoled) {
    results = results.filter((w) => w.isAmoled);
  }

  // Search keyword across title, tags, and category
  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    results = results.filter((w) => {
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
    results.sort((a, b) => b.width * b.height - a.width * a.height);
  } else if (sortBy === "size") {
    results.sort((a, b) => b.sizeBytes - a.sizeBytes);
  } else if (sortBy === "name") {
    results.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === "popular") {
    // Showcases & 4K first
    results.sort((a, b) => {
      if (a.isShowcase && !b.isShowcase) return -1;
      if (!a.isShowcase && b.isShowcase) return 1;
      return b.width * b.height - a.width * a.height;
    });
  }

  const total = results.length;
  const startIndex = (page - 1) * limit;
  const items = results.slice(startIndex, startIndex + limit);

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
