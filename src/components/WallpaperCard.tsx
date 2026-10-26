"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const [imgSrc, setImgSrc] = useState<string>(wallpaper.thumbUrl);
  const [hasError, setHasError] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

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

  // Check if image is already cached/complete on mount
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [imgSrc]);

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

  const handleImageError = () => {
    if (imgSrc !== `/api/wallpaper/${wallpaper.id}`) {
      // Fallback to API direct route
      setImgSrc(`/api/wallpaper/${wallpaper.id}`);
    } else {
      setHasError(true);
      setLoaded(true);
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
      className="group relative rounded-[10px] overflow-hidden bg-white cursor-pointer flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
      style={{
        boxShadow: "inset 0 0 0 1px #f2f0ed",
      }}
    >
      {/* Aspect Ratio Box with Warm Stone Background */}
      <div className={`w-full relative ${aspectClass} overflow-hidden bg-[#f2f0ed]`}>
        {/* Skeleton pulse behind image while loading */}
        {!loaded && !hasError && (
          <div className="absolute inset-0 bg-[#f2f0ed] flex flex-col items-center justify-center p-2 text-center select-none animate-pulse">
            <span className="text-[11px] font-mono text-[#7e7e7d]">
              {wallpaper.width}×{wallpaper.height}
            </span>
          </div>
        )}

        {/* Fallback state if image completely fails */}
        {hasError ? (
          <div className="absolute inset-0 bg-[#f6f4ef] flex flex-col items-center justify-center p-3 text-center">
            <span className="text-xl mb-1">🖼️</span>
            <span className="text-xs font-medium text-[#343433] truncate max-w-[90%]">
              {wallpaper.title}
            </span>
            <span className="text-[10px] text-[#7e7e7d] mt-1 font-mono">
              {wallpaper.width}×{wallpaper.height}
            </span>
          </div>
        ) : (
          /* Real Image */
          <Image
            ref={imgRef}
            src={imgSrc}
            alt={wallpaper.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
              loaded ? "opacity-100" : "opacity-90"
            }`}
            onLoad={() => setLoaded(true)}
            onError={handleImageError}
            loading="lazy"
            unoptimized
          />
        )}

        {/* Storybook Inset Hairline over Image */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-1 flex-wrap">
            {/* Device Pill */}
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-white/95 text-[#343433] shadow-sm border border-[#e5d5c3] backdrop-blur-xs">
              {isDesktop ? (
                <>
                  <Monitor className="w-3 h-3 text-[#0086fc]" />
                  <span>Desktop</span>
                </>
              ) : isSquare ? (
                <>
                  <span className="w-2 h-2 rounded-xs bg-[#ffcd6c] inline-block" />
                  <span>Square</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3 h-3 text-[#ff58ae]" />
                  <span>Mobile</span>
                </>
              )}
            </span>

            {/* 4K Honey Tag */}
            {wallpaper.is4K && (
              <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#ffbb26] text-[#121212] shadow-sm">
                <Sparkles className="w-2.5 h-2.5" /> 4K
              </span>
            )}

            {/* AMOLED Mint Tag */}
            {wallpaper.isAmoled && (
              <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#00ca48] text-white shadow-sm">
                <Moon className="w-2.5 h-2.5" /> AMOLED
              </span>
            )}
          </div>

          {/* Quick Like Action */}
          <button
            onClick={toggleLike}
            className={`pointer-events-auto w-7 h-7 rounded-full transition-all flex items-center justify-center shadow-sm border ${
              isLiked
                ? "bg-[#ff2b3a] text-white border-[#ff2b3a]"
                : "bg-white/90 text-[#474645] hover:text-[#ff2b3a] hover:bg-white border-[#e5d5c3]"
            }`}
            title={isLiked ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-white" : ""}`} />
          </button>
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-[#121212]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 pointer-events-none">
          <button
            onClick={() => onPreview(wallpaper)}
            className="pointer-events-auto p-2.5 rounded-full bg-white text-[#121212] shadow-md hover:scale-105 active:scale-95 transition-all"
            title="Expand Preview"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="pointer-events-auto p-2.5 rounded-full bg-[#121212] text-white shadow-md hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
            title="Download Wallpaper"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : downloadSuccess ? (
              <Check className="w-4 h-4 text-[#00c978]" />
            ) : (
              <Download className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Storybook Card Bottom Strip */}
      <div className="p-3 bg-white flex items-center justify-between gap-2 border-t border-[#f2f0ed]">
        <div className="truncate flex-1 min-w-0">
          <h3 className="text-xs font-semibold text-[#343433] truncate group-hover:text-[#ff3e00] transition-colors">
            {wallpaper.title}
          </h3>
          <div className="flex items-center gap-1.5 text-[11px] text-[#7e7e7d] mt-0.5 truncate">
            <span className="truncate text-[#474645]">
              {wallpaper.subcategory || wallpaper.category}
            </span>
            <span>•</span>
            <span className="font-mono text-[10px] shrink-0 text-[#7e7e7d]">
              {wallpaper.width}×{wallpaper.height}
            </span>
          </div>
        </div>

        {/* Signature Family Dark Pill / Action Button */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`shrink-0 flex items-center gap-1 px-3 py-1 rounded-[32px] text-xs font-medium transition-all shadow-sm active:scale-95 ${
            downloadSuccess
              ? "bg-[#00c978] text-white"
              : isDownloading
              ? "bg-[#f2f0ed] text-[#474645]"
              : "bg-[#121212] hover:bg-[#2c2c2c] text-white"
          }`}
          title="Download original wallpaper"
        >
          {isDownloading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : downloadSuccess ? (
            <>
              <Check className="w-3 h-3 text-white" />
              <span className="text-[11px]">Saved</span>
            </>
          ) : (
            <>
              <Download className="w-3 h-3" />
              <span className="text-[11px]">Get</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
