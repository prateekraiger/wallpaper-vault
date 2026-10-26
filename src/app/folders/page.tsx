import React from "react";
import { getCategories, getDeviceCounts, getAllWallpapers } from "@/lib/wallpapers";
import CategoryExplorer from "@/components/CategoryExplorer";

export const metadata = {
  title: "Categories & Curated Themes · LUMINA",
  description:
    "Explore 4,800+ 4K wallpapers curated across 10 signature thematic collections, 40+ specific subgenres, and 3 device form factors.",
};

export default function FoldersPage() {
  const categories = getCategories();
  const deviceCounts = getDeviceCounts();
  const allWallpapers = getAllWallpapers();

  return (
    <CategoryExplorer
      categories={categories}
      allWallpapers={allWallpapers}
      deviceCounts={deviceCounts}
    />
  );
}
