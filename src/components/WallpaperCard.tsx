"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Download, Heart, Maximize2, Monitor, Smartphone, Sparkles, Moon, Check, Loader2 } from "lucide-react";
import { Wallpaper } from "@/types/wallpaper";
import { showToast } from "@/components/Toast";

interface WallpaperCardProps {
  wallpaper: Wallpaper;
  onPreview: (wallpaper: Wallpaper) => void;
}

export default function WallpaperCard({ wallpaper, onPreview }: WallpaperCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("wallpaper_favorites");
      if (stored) {
        const arr = JSON.parse(stored);
        if (Array.isArray(arr) && arr.includes(wallpaper.id)) {
          setIsLiked(true);
        }
      }
    } catch (e) {
      // ignore
    }
  }, [wallpaper.id]);

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const stored = localStorage.getItem("wallpaper_favorites");
      let arr: string[] = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(arr)) arr = [];

      if (isLiked) {
        arr = arr.filter((id) => id !== wallpaper.id);
        setIsLiked(false);
        showToast("Removed from Favorites", "info");
      } else {
        arr.push(wallpaper.id);
        setIsLiked(true);
        showToast(`Saved "${wallpaper.title}" to Favorites`, "heart");
      }
      localStorage.setItem("wallpaper_favorites", JSON.stringify(arr));
      window.dispatchEvent(new Event("favorites-updated"));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDownloading) return;

    setIsDownloading(true);
    showToast(`Downloading "${wallpaper.title}"...`, "download");

    try {
      const downloadEndpoint = `/api/wallpaper/${wallpaper.id}?download=true`;
      const response = await fetch(downloadEndpoint);
      if (!response.ok) throw new Error("Download failed");
      
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = wallpaper.filename || `wallpaper_${wallpaper.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      setDownloadSuccess(true);
      showToast(`Downloaded "${wallpaper.title}" successfully!`, "success");
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      // Direct link fallback
      const link = document.createElement("a");
      link.href = `/api/wallpaper/${wallpaper.id}?download=true`;
      link.download = wallpaper.filename || `wallpaper_${wallpaper.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsDownloading(false);
    }
  };

  const isDesktop = wallpaper.device === "Desktop";
  const isSquare = wallpaper.device === "Square & Avatars";
  const aspectClass = isDesktop
    ? "aspect-video"
    : isSquare
    ? "aspect-square"
    : "aspect-[9/16]";

  return (
    <div
      onClick={() => onPreview(wallpaper)}
      className="group relative rounded-2xl overflow-hidden glass-card cursor-pointer flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:border-indigo-500/40"
      style={{
        boxShadow: `0 8px 30px -10px rgba(0, 0, 0, 0.5)`,
      }}
    >
      {/* Aspect Ratio Box */}
      <div className={`w-full relative ${aspectClass} overflow-hidden bg-[#0d1424]`}>
        <Image
          src={wallpaper.thumbUrl}
          alt={wallpaper.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover transition-transform duration-700 ease-out group-hover:scale-108 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
          loading="lazy"
        />

        {/* Shimmer skeleton loader */}
        {!loaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 animate-pulse flex items-center justify-center">
            <span className="text-[11px] text-gray-400 font-mono">
              {wallpaper.width}×{wallpaper.height}
            </span>
          </div>
        )}

        {/* Dark Vignette Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Device Pill */}
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide bg-black/75 backdrop-blur-md text-gray-200 border border-white/10 shadow-sm">
              {isDesktop ? (
                <>
                  <Monitor className="w-3 h-3 text-indigo-400" />
                  <span>Desktop</span>
                </>
              ) : isSquare ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-xs border border-amber-400 inline-block" />
                  <span>Square</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3 h-3 text-purple-400" />
                  <span>Mobile</span>
                </>
              )}
            </span>

            {/* 4K or AMOLED Tag */}
            {wallpaper.is4K && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-gradient-to-r from-amber-400 to-amber-500 backdrop-blur-md text-black shadow-sm">
                <Sparkles className="w-2.5 h-2.5" /> 4K
              </span>
            )}
            {wallpaper.isAmoled && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-zinc-950/90 backdrop-blur-md text-indigo-300 border border-indigo-500/40 shadow-sm">
                <Moon className="w-2.5 h-2.5 text-indigo-400" /> AMOLED
              </span>
            )}
          </div>

          {/* Quick Like Action */}
          <button
            onClick={toggleLike}
            className={`pointer-events-auto min-w-[36px] min-h-[36px] p-2 rounded-full backdrop-blur-md transition-all flex items-center justify-center ${
              isLiked
                ? "bg-rose-500 text-white shadow-lg shadow-rose-500/40"
                : "bg-black/60 text-gray-300 hover:text-white hover:bg-black/90 border border-white/10"
            }`}
            title={isLiked ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-white" : ""}`} />
          </button>
        </div>

        {/* Hover Action Center Buttons (Desktop) */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <button
            onClick={() => onPreview(wallpaper)}
            className="pointer-events-auto p-3.5 rounded-full bg-indigo-600/90 hover:bg-indigo-600 text-white shadow-xl shadow-indigo-600/40 transform hover:scale-110 active:scale-95 transition-all"
            title="Expand Preview (Click to Zoom)"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="pointer-events-auto p-3.5 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/25 shadow-xl transform hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
            title="Quick Download"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin text-indigo-300" />
            ) : downloadSuccess ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Download className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Bottom Details (Visible on hover) */}
        <div className="absolute bottom-0 left-0 right-0 p-3.5 bg-gradient-to-t from-black/95 via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
          <p className="text-xs font-bold text-white truncate drop-shadow-md">
            {wallpaper.title}
          </p>
          <div className="flex items-center justify-between text-[11px] text-gray-300 mt-1">
            <span className="text-indigo-300 font-medium">{wallpaper.category}</span>
            <span className="font-mono text-gray-400 text-[10px]">
              {wallpaper.width} × {wallpaper.height}
            </span>
          </div>
        </div>
      </div>

      {/* Static Card Footer Bar: Always-Accessible Touch Download */}
      <div className="p-3 bg-[#0a0f1d]/95 flex items-center justify-between border-t border-white/5 gap-2">
        <div className="truncate flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-200 truncate group-hover:text-indigo-300 transition-colors">
            {wallpaper.title}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-0.5 truncate">
            <span className="truncate text-indigo-300/90 font-medium">
              {wallpaper.subcategory || wallpaper.category}
            </span>
            <span className="text-gray-600">•</span>
            <span className="font-mono text-gray-500 text-[10px] shrink-0">
              {wallpaper.aspectRatio}
            </span>
          </div>
        </div>

        {/* Dedicated High-Affordance Download Button */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`shrink-0 min-h-[36px] flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 ${
            downloadSuccess
              ? "bg-green-500/20 text-green-300 border border-green-500/40"
              : isDownloading
              ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/30"
              : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/25 border border-indigo-400/30"
          }`}
          title="Download original wallpaper"
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span className="hidden sm:inline text-[11px]">Saving</span>
            </>
          ) : downloadSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span className="hidden sm:inline text-[11px]">Saved!</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span className="text-[11px]">Get</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
