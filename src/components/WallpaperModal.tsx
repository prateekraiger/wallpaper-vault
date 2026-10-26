"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  X, 
  Download, 
  Heart, 
  Share2, 
  Check, 
  Monitor, 
  Smartphone, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  Maximize2,
  Minimize2,
  Info,
  Layers,
  Compass,
  Palette,
  Eye,
  Loader2,
  Keyboard,
  Moon
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
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewMode, setPreviewMode] = useState<"pure" | "phone" | "laptop">("pure");
  const [isZoomed, setIsZoomed] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [modalImgSrc, setModalImgSrc] = useState<string>("");

  useEffect(() => {
    if (wallpaper) {
      setModalImgSrc(wallpaper.url);
      setImageLoaded(false);
      try {
        const stored = localStorage.getItem("wallpaper_favorites");
        if (stored) {
          const arr = JSON.parse(stored);
          setIsLiked(Array.isArray(arr) && arr.includes(wallpaper.id));
        }
      } catch (e) {
        // ignore
      }
    }
  }, [wallpaper]);

  const toggleLike = useCallback(() => {
    if (!wallpaper) return;
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
  }, [wallpaper, isLiked]);

  const handleDownload = useCallback(async () => {
    if (!wallpaper || isDownloading) return;
    setIsDownloading(true);
    showToast(`Downloading "${wallpaper.title}" in full resolution...`, "download");

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
  }, [wallpaper, isDownloading]);

  const cyclePreviewMode = useCallback(() => {
    setPreviewMode((prev) => {
      if (prev === "pure") return "phone";
      if (prev === "phone") return "laptop";
      return "pure";
    });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!wallpaper) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();
      if (e.key === "d" || e.key === "D") handleDownload();
      if (e.key === "f" || e.key === "F") toggleLike();
      if (e.key === "p" || e.key === "P") cyclePreviewMode();
      if (e.key === "?") setShowShortcuts((prev) => !prev);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [wallpaper, onClose, onPrev, onNext, handleDownload, toggleLike, cyclePreviewMode]);

  if (!wallpaper) return null;

  const relatedWallpapers = allWallpapers
    .filter((w) => (w.subcategorySlug === wallpaper.subcategorySlug || w.category === wallpaper.category) && w.id !== wallpaper.id)
    .slice(0, 6);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + wallpaper.url);
      setCopied(true);
      showToast("Wallpaper link copied to clipboard!", "success");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyColor = (hex: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(hex);
      setCopiedColor(hex);
      showToast(`Copied color ${hex} to clipboard!`, "success");
      setTimeout(() => setCopiedColor(null), 2000);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-[#121212]/85 backdrop-blur-md animate-in fade-in duration-150">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl max-h-[96vh] rounded-[10px] bg-white overflow-hidden flex flex-col md:flex-row shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-[#e5d5c3]">
        {/* Top Controls Bar */}
        <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5">
          <button
            onClick={() => setShowShortcuts(!showShortcuts)}
            className="p-2 rounded-full bg-white/90 hover:bg-white text-[#343433] border border-[#e5d5c3] shadow-xs transition-colors"
            title="Keyboard Shortcuts (?)"
          >
            <Keyboard className="w-4 h-4" />
          </button>
          
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/90 hover:bg-white text-[#343433] border border-[#e5d5c3] shadow-xs transition-colors"
            title="Close (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Keyboard Shortcuts Overlay Modal */}
        {showShortcuts && (
          <div className="absolute inset-0 z-40 bg-[#121212]/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="max-w-sm w-full bg-white border border-[#e5d5c3] rounded-[10px] p-6 text-[#343433] space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#121212] text-sm flex items-center gap-2">
                  <Keyboard className="w-4 h-4 text-[#ff3e00]" /> Keyboard Shortcuts
                </h3>
                <button onClick={() => setShowShortcuts(false)} className="text-[#7e7e7d] hover:text-[#121212]">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 text-xs divide-y divide-[#f2f0ed]">
                <div className="flex justify-between py-1.5">
                  <span className="text-[#7e7e7d]">Next / Previous</span>
                  <kbd className="px-2 py-0.5 rounded bg-[#f2f0ed] font-mono text-[#121212]">← / →</kbd>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#7e7e7d]">Download Original</span>
                  <kbd className="px-2 py-0.5 rounded bg-[#f2f0ed] font-mono text-[#121212]">D</kbd>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#7e7e7d]">Toggle Favorite</span>
                  <kbd className="px-2 py-0.5 rounded bg-[#f2f0ed] font-mono text-[#121212]">F</kbd>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#7e7e7d]">Toggle Mockup Mode</span>
                  <kbd className="px-2 py-0.5 rounded bg-[#f2f0ed] font-mono text-[#121212]">P</kbd>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#7e7e7d]">Close Lightbox</span>
                  <kbd className="px-2 py-0.5 rounded bg-[#f2f0ed] font-mono text-[#121212]">Esc</kbd>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Left / Center: Wallpaper Preview Canvas */}
        <div className="relative flex-1 bg-[#121212] flex flex-col items-center justify-between min-h-[350px] md:min-h-[640px] overflow-hidden select-none">
          {/* Main Visual Frame */}
          <div className="relative w-full flex-1 flex items-center justify-center p-4 overflow-hidden">
            {previewMode === "phone" ? (
              /* Phone Mockup Frame */
              <div className="relative w-[280px] h-[560px] rounded-[48px] border-[8px] border-[#2d2d30] shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden bg-black flex flex-col transition-all duration-200">
                {/* Dynamic Island */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20 flex items-center justify-between px-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#1e1e1e]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-900/60" />
                </div>
                {/* Status Bar Clock */}
                <div className="absolute top-9 left-0 right-0 z-20 flex flex-col items-center text-white pointer-events-none drop-shadow-md">
                  <span className="text-3xl font-light tracking-tight">9:41</span>
                  <span className="text-[10px] font-medium text-white/80 mt-0.5">Monday, October 26</span>
                </div>
                {/* Image */}
                <div className="relative w-full h-full">
                  <Image
                    src={modalImgSrc || wallpaper.url}
                    alt={wallpaper.title}
                    fill
                    sizes="280px"
                    className="object-cover"
                    priority
                    unoptimized
                    onError={() => setModalImgSrc(`/api/wallpaper/${wallpaper.id}`)}
                  />
                </div>
                {/* Lockscreen Home Bar */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/70 rounded-full z-20 pointer-events-none" />
              </div>
            ) : previewMode === "laptop" ? (
              /* Laptop Mockup Frame */
              <div className="relative w-[90%] max-w-[560px] aspect-[16/10] rounded-xl border-[6px] border-[#3a3a3c] shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden bg-black flex flex-col transition-all duration-200">
                {/* Top Notch / Menu Bar */}
                <div className="h-5 bg-black/60 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-3 z-20 text-[9px] text-white/80 pointer-events-none">
                  <span className="font-semibold"> Finder File Edit View Window</span>
                  <span>9:41 AM · Mon Oct 26</span>
                </div>
                {/* Image */}
                <div className="relative w-full h-full">
                  <Image
                    src={modalImgSrc || wallpaper.url}
                    alt={wallpaper.title}
                    fill
                    sizes="560px"
                    className="object-cover"
                    priority
                    unoptimized
                    onError={() => setModalImgSrc(`/api/wallpaper/${wallpaper.id}`)}
                  />
                </div>
                {/* Subtle Dock */}
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex gap-2 z-20 pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-3.5 h-3.5 rounded-md bg-white/30" />
                  ))}
                </div>
              </div>
            ) : (
              /* Pure Canvas Fullscreen Preview */
              <div
                className={`relative w-full h-[55vh] md:h-[72vh] flex items-center justify-center transition-transform duration-200 ${
                  isZoomed ? "scale-120 cursor-zoom-out" : "scale-100 cursor-zoom-in"
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <Image
                  src={modalImgSrc || wallpaper.url}
                  alt={wallpaper.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 75vw"
                  className="object-contain"
                  priority
                  unoptimized
                  onError={() => setModalImgSrc(`/api/wallpaper/${wallpaper.id}`)}
                />
              </div>
            )}
          </div>

          {/* Bottom Switcher Bar inside Image Stage */}
          <div className="w-full px-4 py-2.5 bg-[#000000]/80 border-t border-white/10 flex items-center justify-between z-20 flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPreviewMode("pure")}
                className={`px-2.5 py-1 rounded-[32px] text-xs font-medium flex items-center gap-1 transition-all ${
                  previewMode === "pure"
                    ? "bg-white text-[#121212] font-semibold"
                    : "bg-white/10 hover:bg-white/20 text-white/80"
                }`}
                title="Fit Image (Original Canvas)"
              >
                <Eye className="w-3 h-3" />
                <span>Canvas</span>
              </button>

              <button
                onClick={() => setPreviewMode("phone")}
                className={`px-2.5 py-1 rounded-[32px] text-xs font-medium flex items-center gap-1 transition-all ${
                  previewMode === "phone"
                    ? "bg-white text-[#121212] font-semibold"
                    : "bg-white/10 hover:bg-white/20 text-white/80"
                }`}
                title="Preview in Phone Frame"
              >
                <Smartphone className="w-3 h-3" />
                <span>Phone</span>
              </button>

              <button
                onClick={() => setPreviewMode("laptop")}
                className={`px-2.5 py-1 rounded-[32px] text-xs font-medium flex items-center gap-1 transition-all ${
                  previewMode === "laptop"
                    ? "bg-white text-[#121212] font-semibold"
                    : "bg-white/10 hover:bg-white/20 text-white/80"
                }`}
                title="Preview in Laptop Frame"
              >
                <Monitor className="w-3 h-3" />
                <span>Laptop</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title={isZoomed ? "Reset Zoom" : "Zoom In"}
              >
                {isZoomed ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Navigation Arrows */}
          {onPrev && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 hover:bg-white text-[#121212] shadow-md transition-transform hover:scale-105 active:scale-95"
              title="Previous Wallpaper (←)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {onNext && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 hover:bg-white text-[#121212] shadow-md transition-transform hover:scale-105 active:scale-95"
              title="Next Wallpaper (→)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right: Family Parchment Metadata & Actions Panel */}
        <div className="w-full md:w-80 lg:w-96 bg-[#fbfaf9] border-t md:border-t-0 md:border-l border-[#f2f0ed] flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[85vh] p-6 space-y-5">
          <div className="space-y-5">
            {/* Title & Category Tags */}
            <div>
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#f2f0ed] text-[#343433] border border-[#e5d5c3]">
                  {wallpaper.device === "Desktop" ? (
                    <>
                      <Monitor className="w-3 h-3 text-[#0086fc]" /> Desktop
                    </>
                  ) : wallpaper.device === "Square & Avatars" ? (
                    <>
                      <span className="w-2 h-2 rounded-xs bg-[#ffcd6c]" /> Square
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-3 h-3 text-[#ff58ae]" /> Mobile
                    </>
                  )}
                </span>

                <Link
                  href={`/category/${wallpaper.categorySlug}`}
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-white hover:bg-[#f6f4ef] text-[#474645] border border-[#f2f0ed] transition-colors"
                >
                  {wallpaper.category}
                </Link>

                {wallpaper.subcategory && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#f6f4ef] text-[#7e7e7d] border border-[#e5d5c3]">
                    {wallpaper.subcategory}
                  </span>
                )}
              </div>

              <h2 className="text-lg font-bold text-[#121212] leading-snug tracking-tight">
                {wallpaper.title}
              </h2>

              {wallpaper.vibe && (
                <p className="mt-1 text-xs text-[#7e7e7d] font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#ffbb26]" />
                  <span>Vibe: {wallpaper.vibe}</span>
                </p>
              )}
            </div>

            {/* Quick Specs Grid - White Card with Inset Border */}
            <div className="grid grid-cols-2 gap-2 p-3 rounded-[10px] bg-white border border-[#f2f0ed] shadow-[inset_0_0_0_1px_#f2f0ed] text-xs">
              <div>
                <span className="text-[#7e7e7d] block text-[11px]">Resolution</span>
                <span className="font-semibold text-[#121212]">
                  {wallpaper.width}×{wallpaper.height}
                  {wallpaper.is4K && (
                    <span className="ml-1 px-1.5 py-0.2 rounded text-[9px] bg-[#ffbb26] text-[#121212] font-bold">
                      4K
                    </span>
                  )}
                </span>
              </div>
              <div>
                <span className="text-[#7e7e7d] block text-[11px]">Aspect Ratio</span>
                <span className="font-semibold text-[#121212] font-mono">
                  {wallpaper.aspectRatio}
                </span>
              </div>
              <div>
                <span className="text-[#7e7e7d] block text-[11px]">File Size</span>
                <span className="font-semibold text-[#121212]">
                  {formatFileSize(wallpaper.sizeBytes)}
                </span>
              </div>
              <div>
                <span className="text-[#7e7e7d] block text-[11px]">Format / Mode</span>
                <span className="font-semibold text-[#121212] flex items-center gap-1">
                  {wallpaper.isAmoled ? (
                    <span className="text-[#00ca48] font-semibold flex items-center gap-0.5">
                      <Moon className="w-3 h-3" /> AMOLED
                    </span>
                  ) : (
                    wallpaper.format.toUpperCase()
                  )}
                </span>
              </div>
            </div>

            {/* Interactive Color Palette */}
            {wallpaper.colorPalette && wallpaper.colorPalette.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#7e7e7d] uppercase tracking-wider block">
                    Extracted Palette
                  </span>
                  <span className="text-[10px] text-[#7e7e7d] font-mono">Click to copy</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {wallpaper.colorPalette.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => copyColor(c)}
                      className="flex-1 flex items-center justify-center gap-1 py-1 px-1.5 rounded-[6px] bg-white hover:bg-[#f6f4ef] border border-[#f2f0ed] transition-all"
                      title={`Copy ${c}`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: c }}
                      />
                      <span className="text-[10px] font-mono text-[#343433] uppercase truncate">
                        {copiedColor === c ? "✓" : c}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Related Wallpapers */}
            {relatedWallpapers.length > 0 && onSelectRelated && (
              <div className="pt-2 border-t border-[#f2f0ed]">
                <div className="flex items-center justify-between text-xs font-semibold text-[#343433] mb-2">
                  <span>More in {wallpaper.subcategory || wallpaper.category}</span>
                  <span className="text-[10px] text-[#7e7e7d]">Related</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {relatedWallpapers.map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => onSelectRelated(rel)}
                      className="relative aspect-video rounded-[6px] overflow-hidden border border-[#f2f0ed] hover:border-[#121212] cursor-pointer transition-all hover:scale-102 group bg-[#f2f0ed]"
                      title={rel.title}
                    >
                      <Image
                        src={rel.thumbUrl}
                        alt={rel.title}
                        fill
                        sizes="100px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons - Dark Pill & Sand Pill */}
          <div className="pt-4 space-y-2 border-t border-[#f2f0ed]">
            {/* Primary Action Button (Dark Pill) */}
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className={`w-full py-2.5 px-4 rounded-[32px] font-medium text-xs flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all ${
                downloadSuccess
                  ? "bg-[#00c978] text-white"
                  : isDownloading
                  ? "bg-[#f2f0ed] text-[#474645] cursor-wait"
                  : "bg-[#121212] hover:bg-[#2c2c2c] text-white"
              }`}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Downloading Original Image...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Saved to Downloads!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Full Resolution ({wallpaper.width}×{wallpaper.height})</span>
                </>
              )}
            </button>

            {/* Secondary Actions (Sand Pill) */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={toggleLike}
                className={`py-2 px-3 rounded-[32px] text-xs font-medium flex items-center justify-center gap-1.5 border transition-all ${
                  isLiked
                    ? "bg-[#ff2b3a] text-white border-[#ff2b3a]"
                    : "bg-[#f6f4ef] hover:bg-[#edeae2] text-[#343433] border-[#e5d5c3]"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-white" : ""}`} />
                <span>{isLiked ? "Saved" : "Favorite (F)"}</span>
              </button>

              <button
                onClick={handleShare}
                className="py-2 px-3 rounded-[32px] text-xs font-medium bg-[#f6f4ef] hover:bg-[#edeae2] text-[#343433] border border-[#e5d5c3] flex items-center justify-center gap-1.5 transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#00c978]" />
                    <span className="text-[#00c978]">Copied!</span>
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
