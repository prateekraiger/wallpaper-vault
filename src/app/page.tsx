import React from "react";
import Link from "next/link";
import { 
  Monitor, 
  Smartphone, 
  Layers, 
  FolderTree, 
  ArrowRight
} from "lucide-react";
import { getAllWallpapers, getCategories, getDeviceCounts } from "@/lib/wallpapers";
import WallpaperGrid from "@/components/WallpaperGrid";

export default function HomePage() {
  const allWallpapers = getAllWallpapers();
  const categories = getCategories();
  const deviceCounts = getDeviceCounts();

  return (
    <div className="space-y-12">
      {/* Storybook Hero Section with Flanking Mascot Clusters */}
      <section className="relative pt-6 pb-4 sm:pt-10 sm:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Storybook Mascot Cluster (Desktop) */}
          <div className="hidden lg:flex lg:col-span-3 flex-col items-center justify-center relative select-none">

            {/* Mascot 1: Orange Smiling Cloud */}
            <div className="w-40 h-28 rounded-[48px] bg-[#ff3e00] border-2 border-[#343433] relative flex items-center justify-center shadow-xs -rotate-3 transition-transform hover:rotate-0">
              {/* Cloud face */}
              <div className="flex flex-col items-center gap-1">
                <div className="flex gap-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#343433]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#343433]" />
                </div>
                <div className="w-4 h-2 border-b-2 border-[#343433] rounded-full" />
              </div>
              <span className="absolute -bottom-2 -left-2 text-xs font-mono px-2 py-0.5 rounded-full bg-white text-[#343433] border border-[#343433] font-bold">
                hi!
              </span>
            </div>

            {/* Mascot 2: Smiling Green Blob */}
            <div className="mt-4 -mr-8 w-24 h-24 rounded-[72px] bg-[#00c978] border-2 border-[#343433] flex items-center justify-center relative rotate-6 shadow-xs">
              <div className="flex flex-col items-center gap-1">
                <div className="flex gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#343433]" />
                  <span className="w-2 h-2 rounded-full bg-[#343433]" />
                </div>
                <div className="w-3.5 h-1.5 border-b-2 border-[#343433] rounded-full" />
              </div>
            </div>

            {/* Confetti: Yellow Sun Coin */}
            <div className="absolute bottom-2 left-6">
              <div className="w-7 h-7 rounded-full bg-[#ffcd6c] border-2 border-[#343433] flex items-center justify-center font-bold text-[10px] text-[#343433]">
                4K
              </div>
            </div>
          </div>

          {/* Centered Headline + Subtitle + Action Buttons */}
          <div className="lg:col-span-6 text-center space-y-6 max-w-xl mx-auto">
            {/* Top Tag Surface */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[32px] bg-[#f6f4ef] border border-[#e5d5c3] text-[#343433] text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-[#00c978]" />
              <span>4,891 Curated 4K Wallpapers Cataloged</span>
            </div>

            {/* Hero Heading in Family Character */}
            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-semibold text-[#121212] tracking-tight leading-[1.1]">
              A warm storybook vault for your screens.
            </h1>

            {/* Subtitle in Body Brown */}
            <p className="text-[16px] sm:text-[17px] text-[#474645] leading-relaxed max-w-md mx-auto">
              Systematically organized into dedicated directories for PC monitors, phones, and 10 human-classified themes. No ads, pure high-res paper aesthetics.
            </p>

            {/* Action Buttons: Dark Pill + Sand Pill */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href="#explorer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[32px] bg-[#121212] hover:bg-[#2c2c2c] text-[#fbfaf9] text-[14px] font-medium shadow-sm transition-all active:scale-95"
              >
                <span>Explore Wallpapers</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                href="/folders"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[32px] bg-[#f6f4ef] hover:bg-[#edeae2] text-[#121212] border border-[#e5d5c3] text-[14px] font-medium transition-all"
              >
                <FolderTree className="w-4 h-4 text-[#ff3e00]" />
                <span>Directory Tree</span>
              </Link>
            </div>
          </div>

          {/* Right Storybook Mascot Cluster (Desktop) */}
          <div className="hidden lg:flex lg:col-span-3 flex-col items-center justify-center relative select-none">
            {/* Confetti: Pink Heart */}
            <div className="absolute -top-3 right-8 animate-story-float">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="#ff58ae" stroke="#343433" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>

            {/* Mascot 3: Flower Character */}
            <div className="w-36 h-36 relative flex items-center justify-center">
              {/* Petals */}
              <div className="absolute inset-0 rounded-[40px] bg-[#ff58ae] border-2 border-[#343433] rotate-45" />
              <div className="absolute inset-0 rounded-[40px] bg-[#ff58ae] border-2 border-[#343433]" />
              {/* Flower Center with face */}
              <div className="relative z-10 w-20 h-20 rounded-[20px] bg-[#ffcd6c] border-2 border-[#343433] flex flex-col items-center justify-center shadow-inner">
                <div className="flex gap-3 mb-1">
                  <span className="w-2 h-2 rounded-full bg-[#343433]" />
                  <span className="w-2 h-2 rounded-full bg-[#343433]" />
                </div>
                <div className="w-3 h-1.5 border-b-2 border-[#343433] rounded-full" />
              </div>
            </div>

            {/* Mascot 4: Yellow Triangle Character */}
            <div className="mt-3 -ml-6 w-24 h-20 bg-[#ffcd6c] border-2 border-[#343433] rounded-[24px] relative flex items-center justify-center -rotate-6 shadow-xs">
              <div className="flex flex-col items-center">
                <div className="flex gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#343433]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#343433]" />
                </div>
                <div className="w-2.5 h-1 border-b-2 border-[#343433] rounded-full mt-0.5" />
              </div>
              {/* Little stick legs */}
              <span className="absolute -bottom-2 left-6 w-0.5 h-2.5 bg-[#343433]" />
              <span className="absolute -bottom-2 right-6 w-0.5 h-2.5 bg-[#343433]" />
            </div>

            {/* Confetti: Alt Blue Pill */}
            <div className="absolute bottom-1 right-4">
              <span className="px-2 py-0.5 rounded-full bg-[#64c6ff] border border-[#343433] text-[10px] font-bold text-[#343433]">
                HD
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid: White Cards with 1px Inset Border */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-10 max-w-4xl mx-auto">
          <Link
            href="/desktop"
            className="p-4 rounded-[10px] bg-white border border-[#f2f0ed] shadow-[inset_0_0_0_1px_#f2f0ed] hover:border-[#e5d5c3] transition-all text-center group"
          >
            <div className="w-8 h-8 rounded-full bg-[#0086fc]/10 text-[#0086fc] flex items-center justify-center mx-auto mb-2">
              <Monitor className="w-4 h-4" />
            </div>
            <div className="font-bold text-[#121212] text-lg">
              {deviceCounts.Desktop.toLocaleString()}
            </div>
            <div className="text-[12px] text-[#7e7e7d] mt-0.5">Desktop (PC)</div>
          </Link>

          <Link
            href="/mobile"
            className="p-4 rounded-[10px] bg-white border border-[#f2f0ed] shadow-[inset_0_0_0_1px_#f2f0ed] hover:border-[#e5d5c3] transition-all text-center group"
          >
            <div className="w-8 h-8 rounded-full bg-[#ff58ae]/10 text-[#ff58ae] flex items-center justify-center mx-auto mb-2">
              <Smartphone className="w-4 h-4" />
            </div>
            <div className="font-bold text-[#121212] text-lg">
              {deviceCounts.Mobile.toLocaleString()}
            </div>
            <div className="text-[12px] text-[#7e7e7d] mt-0.5">Mobile (Phone)</div>
          </Link>

          <div className="p-4 rounded-[10px] bg-white border border-[#f2f0ed] shadow-[inset_0_0_0_1px_#f2f0ed] text-center">
            <div className="w-8 h-8 rounded-full bg-[#ffbb26]/10 text-[#ffbb26] flex items-center justify-center mx-auto mb-2">
              <Layers className="w-4 h-4" />
            </div>
            <div className="font-bold text-[#121212] text-lg">
              {deviceCounts["Square & Avatars"].toLocaleString()}
            </div>
            <div className="text-[12px] text-[#7e7e7d] mt-0.5">Square & Avatars</div>
          </div>

          <Link
            href="/folders"
            className="p-4 rounded-[10px] bg-white border border-[#f2f0ed] shadow-[inset_0_0_0_1px_#f2f0ed] hover:border-[#e5d5c3] transition-all text-center group"
          >
            <div className="w-8 h-8 rounded-full bg-[#00c978]/10 text-[#00c978] flex items-center justify-center mx-auto mb-2">
              <FolderTree className="w-4 h-4" />
            </div>
            <div className="font-bold text-[#121212] text-lg">
              {categories.length} Folders
            </div>
            <div className="text-[12px] text-[#7e7e7d] mt-0.5">Thematic Structure</div>
          </Link>
        </div>
      </section>

      {/* Main Wallpaper Explorer Grid */}
      <section id="explorer" className="pt-2">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2.5 h-2.5 rounded-full bg-[#121212]" />
          <h2 className="text-xl font-bold text-[#121212] tracking-tight">
            Explore All Wallpapers
          </h2>
        </div>

        <WallpaperGrid
          initialWallpapers={allWallpapers}
          categories={categories}
          defaultDevice="all"
          defaultCategory="all"
          isHomePage={true}
        />
      </section>
    </div>
  );
}
