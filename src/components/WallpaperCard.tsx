"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Download, Heart, Maximize2, Monitor, Smartphone, Sparkles, Moon, Check, Loader2 } from "lucide-react";
import { Wallpaper } from "@/types/wallpaper";

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
      } else {
        arr.push(wallpaper.id);
        setIsLiked(true);
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
    try {
      const downloadEndpoint = `/api/wallpaper/${wallpaper.id}?download=true`;
      const response = await fetch(downloadEndpoint);
      if (!response.ok) throw new Error("Network response was not ok");
      
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
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      // Fallback direct download
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

  // Determine card aspect ratio classes
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
      className="group relative rounded-2xl overflow-hidden glass-card cursor-pointer flex flex-col justify-between"
      style={{ backgroundColor: wallpaper.dominantColor || "#111827" }}
    >
      {/* Aspect Ratio Box */}
      <div className={`w-full relative ${aspectClass} overflow-hidden bg-black/40`}>
        <Image
          src={wallpaper.thumbUrl}
          alt={wallpaper.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
          loading="lazy"
        />

        {/* Loading placeholder skeleton */}
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 animate-pulse">
            <span className="text-[11px] text-gray-400 font-mono">
              {wallpaper.width}×{wallpaper.height}
            </span>
          </div>
        )}

        {/* Dark Vignette Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Device Pill */}
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-black/60 backdrop-blur-md text-gray-200 border border-white/10">
              {isDesktop ? (
                <>
                  <Monitor className="w-3 h-3 text-indigo-400" />
                  <span>Desktop</span>
                </>
              ) : isSquare ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-sm border border-amber-400 inline-block" />
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
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-500/80 backdrop-blur-md text-black">
                <Sparkles className="w-2.5 h-2.5" /> 4K UHD
              </span>
            )}
            {wallpaper.isAmoled && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-zinc-900/90 backdrop-blur-md text-indigo-300 border border-indigo-500/40">
                <Moon className="w-2.5 h-2.5 text-indigo-400" /> AMOLED
              </span>
            )}
          </div>

          {/* Quick Like Action */}
          <button
            onClick={toggleLike}
            className={`pointer-events-auto p-2 rounded-full backdrop-blur-md transition-all ${
              isLiked
                ? "bg-red-500 text-white shadow-lg shadow-red-500/40"
                : "bg-black/50 text-gray-300 hover:text-white hover:bg-black/80"
            }`}
            title={isLiked ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-white" : ""}`} />
          </button>
        </div>

        {/* Hover Action Center Buttons (Desktop) */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <button
            onClick={() => onPreview(wallpaper)}
            className="pointer-events-auto p-3 rounded-full bg-indigo-600/90 hover:bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 transform hover:scale-110 transition-all"
            title="Expand Preview"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="pointer-events-auto p-3 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/20 transform hover:scale-110 transition-all flex items-center justify-center"
            title="Download Wallpaper"
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
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/95 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
          <p className="text-xs font-semibold text-white truncate drop-shadow-sm">
            {wallpaper.title}
          </p>
          <div className="flex items-center justify-between text-[10px] text-gray-300 mt-1">
            <span className="text-indigo-300">{wallpaper.category}</span>
            <span className="font-mono text-gray-400">
              {wallpaper.width} × {wallpaper.height}
            </span>
          </div>
        </div>
      </div>

      {/* Static Footer Bar with Always-Available Direct Download Button */}
      <div className="p-2.5 sm:p-3 bg-[#0c121e]/95 flex items-center justify-between border-t border-white/5">
        <div className="truncate mr-2 flex-1">
          <p className="text-xs font-medium text-gray-200 truncate">
            {wallpaper.title}
          </p>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-0.5">
            <span className="truncate">{wallpaper.category}</span>
            <span>•</span>
            <span className="font-mono text-gray-500 shrink-0">
              {wallpaper.width}×{wallpaper.height}
            </span>
          </div>
        </div>

        {/* Dedicated Always-Available Download Button */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            downloadSuccess
              ? "bg-green-500/20 text-green-300 border border-green-500/40"
              : isDownloading
              ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/30"
              : "bg-indigo-600/20 hover:bg-indigo-600 text-indigo-200 hover:text-white border border-indigo-500/30 shadow-sm"
          }`}
          title="Download full resolution wallpaper"
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span className="hidden sm:inline text-[11px]">Saving...</span>
            </>
          ) : downloadSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span className="hidden sm:inline text-[11px]">Saved!</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Download</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
