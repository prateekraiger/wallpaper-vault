"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  Laptop,
  Sparkles, 
  Moon, 
  Info, 
  ExternalLink,
  Check,
  ZoomIn,
  ZoomOut,
  Loader2,
  Compass,
  Copy,
  Keyboard,
  Eye
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
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [previewMode, setPreviewMode] = useState<"pure" | "phone" | "laptop">("pure");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  // Toggle favorite
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

  // Handle Download
  const handleDownload = useCallback(async () => {
    if (!wallpaper || isDownloading) return;
    setIsDownloading(true);
    showToast(`Downloading "${wallpaper.title}" in full original resolution...`, "download");

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

  // Cycle preview mode
  const cyclePreviewMode = useCallback(() => {
    setPreviewMode((prev) => {
      if (prev === "pure") return "phone";
      if (prev === "phone") return "laptop";
      return "pure";
    });
  }, []);

  useEffect(() => {
    if (!wallpaper) return;

    // Reset download status on slide change
    setIsDownloading(false);
    setDownloadSuccess(false);
    setIsZoomed(false);

    // Auto default preview based on wallpaper device
    if (wallpaper.device === "Mobile") {
      setPreviewMode("pure");
    } else {
      setPreviewMode("pure");
    }

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
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();
      if (e.key.toLowerCase() === "d") handleDownload();
      if (e.key.toLowerCase() === "f") toggleLike();
      if (e.key.toLowerCase() === "p") cyclePreviewMode();
      if (e.key === "?") setShowShortcuts((s) => !s);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [wallpaper, onClose, onPrev, onNext, handleDownload, toggleLike, cyclePreviewMode]);

  if (!wallpaper) return null;

  // Filter related wallpapers from same subcategory or category
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/94 backdrop-blur-2xl animate-in fade-in duration-200">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl max-h-[96vh] rounded-3xl glass-panel overflow-hidden flex flex-col md:flex-row shadow-2xl border border-white/10">
        {/* Top Controls Bar */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          {/* Keyboard shortcut icon */}
          <button
            onClick={() => setShowShortcuts(!showShortcuts)}
            className="p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-gray-300 hover:text-white border border-white/15 backdrop-blur-md transition-colors"
            title="Keyboard Shortcuts (?)"
          >
            <Keyboard className="w-4 h-4" />
          </button>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-black/60 hover:bg-black text-gray-300 hover:text-white border border-white/15 backdrop-blur-md transition-colors"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Keyboard Shortcuts Overlay Modal */}
        {showShortcuts && (
          <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="max-w-sm w-full bg-[#0e1424] border border-white/15 rounded-2xl p-6 text-gray-200 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Keyboard className="w-4 h-4 text-indigo-400" /> Keyboard Shortcuts
                </h3>
                <button onClick={() => setShowShortcuts(false)} className="text-gray-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 text-xs divide-y divide-white/10">
                <div className="flex justify-between py-1.5">
                  <span className="text-gray-400">Next / Previous Wallpaper</span>
                  <kbd className="px-2 py-0.5 rounded bg-white/10 font-mono text-white">← / →</kbd>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-gray-400">Download Original</span>
                  <kbd className="px-2 py-0.5 rounded bg-white/10 font-mono text-white">D</kbd>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-gray-400">Toggle Favorite</span>
                  <kbd className="px-2 py-0.5 rounded bg-white/10 font-mono text-white">F</kbd>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-gray-400">Toggle Device Mockup</span>
                  <kbd className="px-2 py-0.5 rounded bg-white/10 font-mono text-white">P</kbd>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-gray-400">Close Lightbox</span>
                  <kbd className="px-2 py-0.5 rounded bg-white/10 font-mono text-white">Esc</kbd>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Left / Center: Wallpaper Preview Display */}
        <div className="relative flex-1 bg-black/80 flex flex-col items-center justify-between min-h-[350px] md:min-h-[640px] overflow-hidden select-none">
          {/* Main Visual Frame */}
          <div className="relative w-full flex-1 flex items-center justify-center p-4 overflow-hidden">
            {previewMode === "phone" ? (
              /* Phone Mockup Frame (iPhone 16 Pro Style) */
              <div className="relative w-[280px] h-[580px] rounded-[52px] border-[8px] border-[#2d2d30] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden bg-black flex flex-col transition-all duration-300">
                {/* Dynamic Island */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20 flex items-center justify-between px-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#151515]" />
                  <span className="w-2 h-2 rounded-full bg-blue-900/60" />
                </div>
                {/* Status Bar Clock */}
                <div className="absolute top-9 left-0 right-0 z-20 flex flex-col items-center text-white pointer-events-none drop-shadow-md">
                  <span className="text-4xl font-extralight tracking-tight">9:41</span>
                  <span className="text-[11px] font-medium text-white/80 mt-0.5">Monday, October 26</span>
                </div>
                {/* Image */}
                <div className="relative w-full h-full">
                  <Image
                    src={wallpaper.url}
                    alt={wallpaper.title}
                    fill
                    sizes="280px"
                    className="object-cover"
                    priority
                  />
                </div>
                {/* Lockscreen Home Bar */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/60 rounded-full z-20 pointer-events-none" />
              </div>
            ) : previewMode === "laptop" ? (
              /* Laptop Mockup Frame (MacBook Pro Style) */
              <div className="relative w-[90%] max-w-[560px] aspect-[16/10] rounded-xl border-[6px] border-[#3a3a3c] shadow-[0_30px_70px_rgba(0,0,0,0.95)] overflow-hidden bg-black flex flex-col transition-all duration-300">
                {/* Top Notch / Menu Bar */}
                <div className="h-5 bg-black/60 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-3 z-20 text-[9px] text-white/80 pointer-events-none">
                  <span className="font-semibold"> Finder File Edit View Window</span>
                  <span>9:41 AM · Mon Oct 26</span>
                </div>
                {/* Image */}
                <div className="relative w-full h-full">
                  <Image
                    src={wallpaper.url}
                    alt={wallpaper.title}
                    fill
                    sizes="560px"
                    className="object-cover"
                    priority
                  />
                </div>
                {/* Subtle Dock */}
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-xl bg-white/15 backdrop-blur-xl border border-white/20 flex gap-2 z-20 pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-3.5 h-3.5 rounded-md bg-white/30" />
                  ))}
                </div>
              </div>
            ) : (
              /* Pure Canvas Fullscreen Preview */
              <div
                className={`relative w-full h-[55vh] md:h-[72vh] flex items-center justify-center transition-transform duration-300 ${
                  isZoomed ? "scale-125 cursor-zoom-out" : "scale-100 cursor-zoom-in"
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <Image
                  src={wallpaper.url}
                  alt={wallpaper.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 75vw"
                  className="object-contain"
                  priority
                />
              </div>
            )}
          </div>

          {/* Bottom Controls Bar inside image area */}
          <div className="w-full px-4 py-3 bg-black/70 border-t border-white/5 flex items-center justify-between z-20 flex-wrap gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPreviewMode("pure")}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                  previewMode === "pure"
                    ? "bg-indigo-600 text-white font-bold"
                    : "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                }`}
                title="Fit Image (Original Canvas)"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Canvas</span>
              </button>

              <button
                onClick={() => setPreviewMode("phone")}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                  previewMode === "phone"
                    ? "bg-indigo-600 text-white font-bold"
                    : "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                }`}
                title="Preview inside iPhone Frame"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Phone</span>
              </button>

              <button
                onClick={() => setPreviewMode("laptop")}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                  previewMode === "laptop"
                    ? "bg-indigo-600 text-white font-bold"
                    : "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                }`}
                title="Preview inside Laptop Frame"
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>Laptop</span>
              </button>
            </div>

            {/* Zoom / Info */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="p-1.5 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white backdrop-blur-md border border-white/10 text-xs flex items-center gap-1.5 transition-colors"
              >
                {isZoomed ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
                <span>{isZoomed ? "Fit" : "100%"}</span>
              </button>

              <span className="text-[11px] text-gray-400 font-mono hidden sm:inline">
                Press <kbd className="px-1.5 py-0.5 rounded bg-white/10">?</kbd> for keys
              </span>
            </div>
          </div>

          {/* Navigation Arrows */}
          {onPrev && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/10 transition-transform hover:scale-110 active:scale-95"
              title="Previous Wallpaper (←)"
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
              title="Next Wallpaper (→)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Right: Metadata & Actions Panel */}
        <div className="w-full md:w-84 lg:w-96 bg-[#0a0f1e] border-t md:border-t-0 md:border-l border-white/10 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[85vh] p-6 space-y-6">
          <div className="space-y-6">
            {/* Header / Title */}
            <div>
              {/* Category, Subcategory & Device Tags */}
              <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  {wallpaper.device === "Desktop" ? (
                    <>
                      <Monitor className="w-3 h-3" /> Desktop
                    </>
                  ) : wallpaper.device === "Square & Avatars" ? (
                    <>
                      <span className="w-2 h-2 rounded-xs border border-amber-400" /> Square
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-3 h-3" /> Mobile
                    </>
                  )}
                </span>

                <Link
                  href={`/category/${wallpaper.categorySlug}`}
                  className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors flex items-center gap-1"
                >
                  {wallpaper.category}
                </Link>

                {wallpaper.subcategory && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-violet-500/10 text-violet-300 border border-violet-500/20">
                    {wallpaper.subcategory}
                  </span>
                )}
              </div>

              <h2 className="text-xl font-bold text-white leading-snug tracking-tight">
                {wallpaper.title}
              </h2>

              {wallpaper.vibe && (
                <p className="mt-1.5 text-xs text-indigo-300/80 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Vibe: {wallpaper.vibe}</span>
                </p>
              )}
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-xs">
              <div>
                <span className="text-gray-400 block text-[11px]">Resolution</span>
                <span className="font-bold text-gray-200">
                  {wallpaper.width} × {wallpaper.height}
                  {wallpaper.is4K && (
                    <span className="ml-1 px-1.5 py-0.2 rounded text-[9px] bg-amber-500/20 text-amber-300 font-bold">
                      4K UHD
                    </span>
                  )}
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
                <span className="text-gray-400 block text-[11px]">OLED / Dark</span>
                <span className="font-bold text-gray-200 flex items-center gap-1">
                  {wallpaper.isAmoled ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Moon className="w-3 h-3" /> AMOLED
                    </span>
                  ) : (
                    "Standard"
                  )}
                </span>
              </div>
            </div>

            {/* Interactive Color Palette with One-Click Copy */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  Color Palette
                </span>
                <span className="text-[10px] text-gray-400 font-mono">Click to copy HEX</span>
              </div>
              <div className="flex items-center gap-2">
                {wallpaper.colorPalette?.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => copyColor(c)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 transition-all group"
                    title={`Click to copy ${c}`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-white/20 shadow-sm shrink-0"
                      style={{ backgroundColor: c }}
                    />
                    <span className="text-[10px] font-mono text-gray-300 uppercase group-hover:text-white">
                      {copiedColor === c ? "Copied!" : c}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            {wallpaper.tags && wallpaper.tags.length > 0 && (
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                  Keywords & Signals
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {wallpaper.tags.slice(0, 8).map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] px-2.5 py-0.5 rounded-md bg-white/5 text-gray-300 border border-white/5 hover:border-white/20 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

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
                    <strong>Windows / Mac:</strong> Download the full image, right-click the saved file, and select <em>&quot;Set as desktop background&quot;</em>.
                  </p>
                  <p>
                    <strong>iPhone / Android:</strong> Download to Photos, open Settings &gt; Wallpaper to set as Lock Screen or Home Screen.
                  </p>
                </div>
              )}
            </div>

            {/* Related Wallpapers Row */}
            {relatedWallpapers.length > 0 && onSelectRelated && (
              <div className="pt-2 border-t border-white/5">
                <div className="flex items-center justify-between text-xs font-bold text-gray-300 mb-2.5">
                  <span className="flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-indigo-400" />
                    <span>More in {wallpaper.subcategory || wallpaper.category}</span>
                  </span>
                  <span className="text-[10px] text-gray-400 font-normal">Related</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {relatedWallpapers.map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => onSelectRelated(rel)}
                      className="relative aspect-video rounded-lg overflow-hidden border border-white/10 hover:border-indigo-500 cursor-pointer transition-all transform hover:scale-105 group"
                      title={rel.title}
                    >
                      <Image
                        src={rel.thumbUrl}
                        alt={rel.title}
                        fill
                        sizes="100px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-[9px] text-white font-bold px-1 text-center truncate">
                          {rel.title}
                        </span>
                      </div>
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
                <span>{isLiked ? "Saved" : "Favorite (F)"}</span>
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
