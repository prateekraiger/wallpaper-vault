"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Trash2, Sparkles, ArrowRight } from "lucide-react";
import { Wallpaper, CategoryInfo } from "@/types/wallpaper";
import WallpaperCard from "@/components/WallpaperCard";
import WallpaperModal from "@/components/WallpaperModal";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeWallpaper, setActiveWallpaper] = useState<Wallpaper | null>(null);

  useEffect(() => {
    async function loadFavorites() {
      try {
        const stored = localStorage.getItem("wallpaper_favorites");
        if (stored) {
          const ids: string[] = JSON.parse(stored);
          if (Array.isArray(ids) && ids.length > 0) {
            // Fetch wallpaper data from API
            const res = await fetch("/api/wallpapers?limit=5000");
            const data = await res.json();
            const allWps: Wallpaper[] = data.items || [];
            const favWps = allWps.filter((w) => ids.includes(w.id));
            setFavorites(favWps);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, []);

  const clearAllFavorites = () => {
    if (confirm("Are you sure you want to remove all wallpapers from favorites?")) {
      localStorage.removeItem("wallpaper_favorites");
      setFavorites([]);
      window.dispatchEvent(new Event("favorites-updated"));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-white/10 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-rose-600/30 border border-rose-500/40 flex items-center justify-center text-rose-300">
              <Heart className="w-4 h-4 fill-rose-400 text-rose-400" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Personal Collection
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Saved Wallpapers
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {favorites.length} wallpaper{favorites.length === 1 ? "" : "s"} bookmarked locally on this device.
          </p>
        </div>

        {favorites.length > 0 && (
          <button
            onClick={clearAllFavorites}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Favorites</span>
          </button>
        )}
      </div>

      {/* Grid or Empty State */}
      {loading ? (
        <div className="text-center py-24">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-gray-400">Loading your saved favorites...</p>
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-24 rounded-2xl glass-panel border border-white/10 p-8">
          <Heart className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white">No saved wallpapers yet</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            Click the heart icon on any wallpaper while browsing to save it here for quick access.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
          >
            <span>Explore Wallpapers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
          {favorites.map((wp) => (
            <WallpaperCard
              key={wp.id}
              wallpaper={wp}
              onPreview={(w) => setActiveWallpaper(w)}
            />
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <WallpaperModal
        wallpaper={activeWallpaper}
        onClose={() => setActiveWallpaper(null)}
      />
    </div>
  );
}
