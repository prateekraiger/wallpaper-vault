"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Wallpaper } from "@/types/wallpaper";
import WallpaperCard from "@/components/WallpaperCard";

interface MasonryGridProps {
  wallpapers: Wallpaper[];
  density?: "standard" | "compact";
  onPreview: (wallpaper: Wallpaper) => void;
}

export default function MasonryGrid({
  wallpapers,
  density = "standard",
  onPreview,
}: MasonryGridProps) {
  // Default to 4 columns for desktop SSR
  const [columnCount, setColumnCount] = useState<number>(4);

  useEffect(() => {
    const computeColumns = () => {
      const width = window.innerWidth;
      if (width < 640) {
        return 2;
      }
      if (width < 900) {
        return density === "compact" ? 3 : 2;
      }
      if (width < 1250) {
        return density === "compact" ? 4 : 3;
      }
      if (width < 1600) {
        return density === "compact" ? 5 : 4;
      }
      return density === "compact" ? 6 : 5;
    };

    setColumnCount(computeColumns());

    const handleResize = () => {
      setColumnCount(computeColumns());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [density]);

  // Distribute items into columns using Pinterest-style shortest column balancing
  const columns = useMemo(() => {
    const cols: Wallpaper[][] = Array.from({ length: columnCount }, () => []);
    const heights: number[] = new Array(columnCount).fill(0);

    wallpapers.forEach((wp) => {
      // Find current shortest column
      let shortestIdx = 0;
      let minH = heights[0];
      for (let i = 1; i < columnCount; i++) {
        if (heights[i] < minH) {
          minH = heights[i];
          shortestIdx = i;
        }
      }

      cols[shortestIdx].push(wp);

      // Estimate aspect ratio height (height / width)
      const isDesktop = wp.device === "Desktop";
      const isSquare = wp.device === "Square & Avatars";
      const naturalRatio = wp.width && wp.height
        ? wp.width / wp.height
        : (isDesktop ? 16 / 9 : isSquare ? 1 : 9 / 16);
      const clampedRatio = Math.max(0.56, Math.min(2.35, naturalRatio));
      
      // Relative height: (1 / clampedRatio) represents image height relative to width
      // Add ~0.22 for card footer (title, resolution, button)
      const itemRelativeHeight = (1 / clampedRatio) + 0.22;
      heights[shortestIdx] += itemRelativeHeight;
    });

    return cols;
  }, [wallpapers, columnCount]);

  return (
    <div className="flex gap-4 items-start w-full">
      {columns.map((columnWallpapers, colIdx) => (
        <div key={colIdx} className="flex flex-col gap-4 flex-1 min-w-0">
          {columnWallpapers.map((wp) => (
            <WallpaperCard
              key={wp.id}
              wallpaper={wp}
              onPreview={onPreview}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
