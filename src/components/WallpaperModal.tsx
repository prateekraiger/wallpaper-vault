"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  X, 
  Download, 
  Heart, 
  Share2, 
  ChevronLeft, 
  ChevronRight, 
  Monitor, 
  Smartphone, 
  Sparkles, 
  Moon, 
  Info, 
  ExternalLink,
  Check,
  ZoomIn,
  ZoomOut,
  Loader2,
  Compass
} from "lucide-react";
import { Wallpaper } from "@/types/wallpaper";
import { showToast } from "@/components/Toast";

interface WallpaperModalProps {
  wallpaper: Wallpaper | null;
  allWallpapers?: Wallpaper[];
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  onSelectRelated?: (wallpaper: Wallpaper) => void;
}

export default function WallpaperModal({
  wallpaper,
  allWallpapers = [],
  onClose,
  onPrev,
  onNext,
  onSelectRelated,
}: WallpaperModalProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    if (!wallpaper) return;

    // Reset download status on slide change
    setIsDownloading(false);
    setDownloadSuccess(false);
    setIsZoomed(false);

    // Check favorite status
    try {
      const stored = localStorage.getItem("wallpaper_favorites");
      if (stored) {
        const arr = JSON.parse(stored);
        if (Array.isArray(arr) && arr.includes(wallpaper.id)) {
          setIsLiked(true);
        } else {
          setIsLiked(false);
        }
      }
    } catch (e) {
      // ignore
    }

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [wallpaper, onClose, onPrev, onNext]);

  if (!wallpaper) return null;

  // Filter related wallpapers from same category
  const relatedWallpapers = allWallpapers
    .filter((w) => w.category === wallpaper.category && w.id !== wallpaper.id)
    .slice(0, 6);

  const toggleLike = () => {
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

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    showToast(`Downloading "${wallpaper.title}" in full 4K resolution...`, "download");

    try {
      const downloadEndpoint = `/api/wallpaper/${wallpaper.id}?download=true`;
      const response = await fetch(downloadEndpoint);
      if (!response.ok) throw new Error("Download request failed");

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
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
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

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + wallpaper.url);
      setCopied(true);
      showToast("Wallpaper link copied to clipboard!", "success");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/92 backdrop-blur-2xl animate-in fade-in duration-200">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl max-h-[95vh] rounded-3xl glass-panel overflow-hidden flex flex-col md:flex-row shadow-2xl border border-white/10">
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/70 hover:bg-black text-gray-300 hover:text-white border border-white/15 backdrop-blur-md transition-colors"
          title="Close (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left / Center: Wallpaper Preview Display */}
        <div className="relative flex-1 bg-black/70 flex flex-col items-center justify-between min-h-[350px] md:min-h-[620px] overflow-hidden select-none">
          <div
            className={`relative w-full flex-1 flex items-center justify-center p-4 transition-all duration-300 ${
              isZoomed ? "cursor-zoom-out scale-125" : "cursor-zoom-in"
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <div className="relative w-full h-[55vh] md:h-[72vh] flex items-center justify-center">
              <Image
                src={wallpaper.url}
                alt={wallpaper.title}
                fill
                sizes="(max-width: 1024px) 100vw, 75vw"
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Bottom Bar inside image area */}
          <div className="w-full px-4 py-3 bg-black/60 border-t border-white/5 flex items-center justify-between z-20">
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="p-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white backdrop-blur-md border border-white/10 text-xs flex items-center gap-1.5 transition-colors"
            >
              {isZoomed ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
              <span>{isZoomed ? "Fit Screen" : "Zoom 100%"}</span>
            </button>

            <span className="text-[11px] text-gray-400 font-mono hidden sm:inline">
              Use ← and → arrow keys to navigate
            </span>
          </div>

          {/* Navigation Arrows */}
          {onPrev && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/10 transition-transform hover:scale-110 active:scale-95"
              title="Previous (Left Arrow)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {onNext && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/10 transition-transform hover:scale-110 active:scale-95"
              title="Next (Right Arrow)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Right: Metadata & Actions Panel */}
        <div className="w-full md:w-80 lg:w-96 bg-[#0a0f1d] border-t md:border-t-0 md:border-l border-white/10 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[85vh] p-6 space-y-6">
          <div className="space-y-6">
            {/* Header / Title */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  {wallpaper.device === "Desktop" ? (
                    <>
                      <Monitor className="w-3.5 h-3.5" /> Desktop
                    </>
                  ) : wallpaper.device === "Square & Avatars" ? (
                    <>
                      <span className="w-2 h-2 rounded-xs border border-amber-400" /> Square
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-3.5 h-3.5" /> Mobile
                    </>
                  )}
                </span>
                <Link
                  href={`/category/${wallpaper.categorySlug}`}
                  className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  {wallpaper.category}
                  <ExternalLink className="w-3 h-3 text-gray-500" />
                </Link>
              </div>

              <h2 className="text-xl font-bold text-white leading-snug">
                {wallpaper.title}
              </h2>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-xs">
              <div>
                <span className="text-gray-400 block text-[11px]">Resolution</span>
                <span className="font-bold text-gray-200">
                  {wallpaper.width} × {wallpaper.height}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">Aspect Ratio</span>
                <span className="font-bold text-gray-200 font-mono">
                  {wallpaper.aspectRatio}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">File Size</span>
                <span className="font-bold text-gray-200">
                  {formatFileSize(wallpaper.sizeBytes)}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">Format</span>
                <span className="font-bold text-gray-200 uppercase">
                  {wallpaper.format}
                </span>
              </div>
            </div>

            {/* Tags & Colors */}
            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                  Color Palette
                </span>
                <div className="flex items-center gap-2">
                  {wallpaper.colorPalette?.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10"
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: c }}
                      />
                      <span className="text-[11px] font-mono text-gray-300 uppercase">
                        {c}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {wallpaper.tags && wallpaper.tags.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                    Tags
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {wallpaper.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] px-2.5 py-0.5 rounded-md bg-white/5 text-gray-300 border border-white/5"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* How to set as wallpaper helper */}
            <div>
              <button
                onClick={() => setShowHowTo(!showHowTo)}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
              >
                <Info className="w-3.5 h-3.5" />
                <span>How to set as wallpaper?</span>
              </button>

              {showHowTo && (
                <div className="mt-2.5 p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-gray-300 space-y-1.5 animate-in fade-in duration-200">
                  <p>
                    <strong>Windows / Mac:</strong> Download the file, right-click the saved image, and select <em>&quot;Set as desktop background&quot;</em>.
                  </p>
                  <p>
                    <strong>iPhone / Android:</strong> Download to Photos, open Settings &gt; Wallpaper to set as Lock/Home Screen.
                  </p>
                </div>
              )}
            </div>

            {/* Related Wallpapers Row */}
            {relatedWallpapers.length > 0 && onSelectRelated && (
              <div className="pt-2 border-t border-white/5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-300 mb-2.5">
                  <Compass className="w-3.5 h-3.5 text-indigo-400" />
                  <span>More in {wallpaper.category}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {relatedWallpapers.map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => onSelectRelated(rel)}
                      className="relative aspect-video rounded-lg overflow-hidden border border-white/10 hover:border-indigo-500 cursor-pointer transition-all transform hover:scale-105"
                    >
                      <Image
                        src={rel.thumbUrl}
                        alt={rel.title}
                        fill
                        sizes="100px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons (Bottom) */}
          <div className="pt-6 space-y-2.5 border-t border-white/5">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl transform active:scale-98 transition-all ${
                downloadSuccess
                  ? "bg-green-600 text-white shadow-green-600/30"
                  : isDownloading
                  ? "bg-indigo-700 text-indigo-200 cursor-wait"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/40"
              }`}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Downloading Original Image...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Saved to Downloads!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Full Resolution ({wallpaper.width}×{wallpaper.height})</span>
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={toggleLike}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                  isLiked
                    ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                    : "bg-white/5 text-gray-300 hover:text-white border-white/10 hover:bg-white/10"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                <span>{isLiked ? "Saved" : "Favorite"}</span>
              </button>

              <button
                onClick={handleShare}
                className="py-2.5 px-3 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 flex items-center justify-center gap-2 transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-green-300">Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
