"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, Trash2, ArrowRight } from "lucide-react";
import { Wallpaper } from "@/types/wallpaper";
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
      {/* Header Banner - White with Inset Hairline Border */}
      <div className="rounded-[10px] bg-white p-6 sm:p-8 border border-[#f2f0ed] shadow-[inset_0_0_0_1px_#f2f0ed] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-[10px] bg-[#ff2b3a]/10 text-[#ff2b3a] flex items-center justify-center">
              <Heart className="w-4 h-4 fill-[#ff2b3a]" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff2b3a]">
              Saved Bookmarks
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#121212] tracking-tight">
            My Saved Wallpapers
          </h1>
          <p className="text-[14px] text-[#474645] mt-1">
            {favorites.length} wallpaper{favorites.length === 1 ? "" : "s"} bookmarked in your local collection.
          </p>
        </div>

        {favorites.length > 0 && (
          <button
            onClick={clearAllFavorites}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[32px] text-xs font-medium bg-[#f6f4ef] hover:bg-[#edeae2] text-[#ff2b3a] border border-[#e5d5c3] transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Collection</span>
          </button>
        )}
      </div>

      {/* Grid or Empty State */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-6 h-6 border-2 border-[#121212] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-[#7e7e7d]">Loading saved wallpapers...</p>
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-20 rounded-[10px] bg-white border border-[#f2f0ed] shadow-[inset_0_0_0_1px_#f2f0ed] p-8 space-y-3">
          <span className="text-4xl block">🤍</span>
          <h3 className="text-base font-bold text-[#121212]">No saved wallpapers yet</h3>
          <p className="text-xs text-[#7e7e7d] max-w-sm mx-auto">
            Click the heart icon on any wallpaper card while browsing to pin it here.
          </p>
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 mt-3 px-5 py-2.5 rounded-[32px] text-xs font-semibold bg-[#121212] hover:bg-[#2c2c2c] text-white transition-all shadow-sm"
            >
              <span>Explore Wallpapers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
