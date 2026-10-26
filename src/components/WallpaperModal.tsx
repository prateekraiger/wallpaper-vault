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
  ZoomOut
} from "lucide-react";
import { Wallpaper } from "@/types/wallpaper";

interface WallpaperModalProps {
  wallpaper: Wallpaper | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export default function WallpaperModal({
  wallpaper,
  onClose,
  onPrev,
  onNext,
}: WallpaperModalProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (!wallpaper) return;

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

  const toggleLike = () => {
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

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = wallpaper.url;
    link.download = wallpaper.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.origin + wallpaper.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl max-h-[95vh] rounded-2xl glass-panel overflow-hidden flex flex-col md:flex-row shadow-2xl border border-white/10">
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-gray-300 hover:text-white border border-white/10 backdrop-blur-md transition-colors"
          title="Close (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left / Center: Wallpaper Preview Display */}
        <div className="relative flex-1 bg-black/60 flex items-center justify-center min-h-[350px] md:min-h-[600px] overflow-hidden select-none">
          <div
            className={`relative w-full h-full flex items-center justify-center p-4 transition-all duration-300 ${
              isZoomed ? "cursor-zoom-out scale-125" : "cursor-zoom-in"
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
          >
            <div className="relative w-full h-[65vh] md:h-[80vh] flex items-center justify-center">
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

          {/* Zoom Toggle Pill */}
          <button
            onClick={() => setIsZoomed(!isZoomed)}
            className="absolute bottom-4 left-4 p-2 rounded-lg bg-black/60 text-gray-300 hover:text-white backdrop-blur-md border border-white/10 text-xs flex items-center gap-1.5 transition-colors"
          >
            {isZoomed ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
            <span>{isZoomed ? "Fit Screen" : "Zoom"}</span>
          </button>

          {/* Navigation Arrows */}
          {onPrev && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/10 transition-transform hover:scale-110"
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
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/10 transition-transform hover:scale-110"
              title="Next (Right Arrow)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Right: Metadata & Actions Panel */}
        <div className="w-full md:w-80 lg:w-96 bg-[#0c1322] border-t md:border-t-0 md:border-l border-white/10 flex flex-col justify-between overflow-y-auto max-h-[45vh] md:max-h-[85vh] p-6">
          <div className="space-y-6">
            {/* Header / Title */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
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

              <h2 className="text-lg font-bold text-white leading-snug">
                {wallpaper.title}
              </h2>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 gap-2.5 p-3.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs">
              <div>
                <span className="text-gray-400 block text-[11px]">Resolution</span>
                <span className="font-semibold text-gray-200">
                  {wallpaper.width} × {wallpaper.height}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">Aspect Ratio</span>
                <span className="font-semibold text-gray-200 font-mono">
                  {wallpaper.aspectRatio}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">File Size</span>
                <span className="font-semibold text-gray-200">
                  {formatFileSize(wallpaper.sizeBytes)}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-[11px]">Format</span>
                <span className="font-semibold text-gray-200 uppercase">
                  {wallpaper.format}
                </span>
              </div>
            </div>

            {/* Tags & Colors */}
            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                  Color Palette
                </span>
                <div className="flex items-center gap-2">
                  {wallpaper.colorPalette?.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10"
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
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                    Tags
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {wallpaper.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 text-gray-300 border border-white/5"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* How to set as wallpaper helper toggle */}
            <div>
              <button
                onClick={() => setShowHowTo(!showHowTo)}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <Info className="w-3.5 h-3.5" />
                <span>How to set as wallpaper?</span>
              </button>

              {showHowTo && (
                <div className="mt-2.5 p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-xs text-gray-300 space-y-1.5 animate-in fade-in duration-200">
                  <p>
                    <strong>Windows / Mac:</strong> Download the image, right-click the saved file, and select <em>&quot;Set as desktop background&quot;</em>.
                  </p>
                  <p>
                    <strong>iPhone / Android:</strong> Download or long-press the image to save to Photos, then open Settings &gt; Wallpaper to set as Lock/Home screen.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons (Bottom) */}
          <div className="pt-6 space-y-2.5">
            <button
              onClick={handleDownload}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transform active:scale-98 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Original {wallpaper.width}×{wallpaper.height}</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={toggleLike}
                className={`py-2.5 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-2 border transition-all ${
                  isLiked
                    ? "bg-red-500/15 text-red-300 border-red-500/30"
                    : "bg-white/5 text-gray-300 hover:text-white border-white/10 hover:bg-white/10"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                <span>{isLiked ? "Saved" : "Favorite"}</span>
              </button>

              <button
                onClick={handleShare}
                className="py-2.5 px-3 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 flex items-center justify-center gap-2 transition-all"
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
