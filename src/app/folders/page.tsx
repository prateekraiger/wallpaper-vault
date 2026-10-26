import React from "react";
import Link from "next/link";
import { 
  FolderTree as FolderTreeIcon, 
  Folder, 
  Monitor, 
  Smartphone, 
  Layers, 
  ChevronRight, 
  HardDrive, 
  Tag 
} from "lucide-react";
import { getCategories, getDeviceCounts, getAllWallpapers } from "@/lib/wallpapers";
import FolderTree from "@/components/FolderTree";

export const metadata = {
  title: "Directory Explorer — Wallpaper Vault Folders",
  description:
    "Browse the complete categorized folder structure of 4,800+ wallpapers divided into Desktop, Mobile, and 10 visual category subdirectories with human-curated subcategories.",
};

export default function FoldersPage() {
  const categories = getCategories();
  const deviceCounts = getDeviceCounts();
  const allWallpapers = getAllWallpapers();

  const devices = [
    {
      name: "Desktop PC Wallpapers",
      desc: "Landscape 16:9 & Ultrawide aspect ratios for PC monitors, laptops & dual screens",
      path: "/desktop",
      count: deviceCounts.Desktop,
      icon: Monitor,
      accent: "text-[#0086fc]",
    },
    {
      name: "Mobile Phone Wallpapers",
      desc: "Vertical 9:16 portrait wallpapers for smartphones & high-contrast AMOLED displays",
      path: "/mobile",
      count: deviceCounts.Mobile,
      icon: Smartphone,
      accent: "text-[#ff58ae]",
    },
    {
      name: "Square & Avatars",
      desc: "Square 1:1 aspect ratio for avatars, profile photos, and aesthetic widgets",
      path: "/?device=square",
      count: deviceCounts["Square & Avatars"],
      icon: Layers,
      accent: "text-[#ffbb26]",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Header Banner - White with Inset Hairline Border */}
      <div className="rounded-[10px] bg-white p-6 sm:p-8 border border-[#f2f0ed] shadow-[inset_0_0_0_1px_#f2f0ed] relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-[10px] bg-[#00c978]/10 text-[#00c978] flex items-center justify-center">
            <FolderTreeIcon className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#00c978]">
            File System
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-[#121212] tracking-tight">
          Wallpaper Directory Explorer
        </h1>
        <p className="text-[14px] text-[#474645] mt-1.5 max-w-2xl leading-relaxed">
          The collection is cleanly organized on disk under <code>D:\My\wallpaper\categorized\</code>. Browse by hardware device form factor or thematic category subdirectories below.
        </p>
      </div>

      {/* Top Device Master Folders */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#121212]">
          <HardDrive className="w-4 h-4 text-[#0086fc]" />
          <span>Device Form Factor Directories</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {devices.map((dev) => {
            const Icon = dev.icon;
            return (
              <Link
                key={dev.name}
                href={dev.path}
                className="p-5 rounded-[10px] bg-white border border-[#f2f0ed] shadow-[inset_0_0_0_1px_#f2f0ed] hover:border-[#e5d5c3] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-[10px] bg-[#f6f4ef] flex items-center justify-center border border-[#e5d5c3]">
                      <Icon className={`w-5 h-5 ${dev.accent}`} />
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#f2f0ed] text-[#474645] font-semibold border border-[#e5d5c3]">
                      {dev.count.toLocaleString()} files
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#121212] group-hover:text-[#ff3e00] transition-colors">
                    {dev.name}
                  </h3>
                  <p className="text-xs text-[#7e7e7d] mt-1 leading-relaxed">
                    {dev.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#f2f0ed] flex items-center gap-1 text-xs text-[#ff3e00] font-semibold">
                  <span>Browse Folder</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Interactive Folder Tree View */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#121212]">
          <Folder className="w-4 h-4 text-[#00c978]" />
          <span>Interactive Directory Hierarchy</span>
        </div>

        <FolderTree />
      </div>

      {/* All 10 Category Subdirectories Grid with Subcategory Chips */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#121212]">
          <Layers className="w-4 h-4 text-[#ff58ae]" />
          <span>Thematic Categories & Subcategories</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat) => {
            const catWps = allWallpapers.filter((w) => w.categorySlug === cat.slug);
            const desktopCount = catWps.filter((w) => w.device === "Desktop").length;
            const mobileCount = catWps.filter((w) => w.device === "Mobile").length;

            return (
              <div
                key={cat.slug}
                className="p-5 rounded-[10px] bg-white border border-[#f2f0ed] shadow-[inset_0_0_0_1px_#f2f0ed] flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Link href={`/category/${cat.slug}`} className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-[8px] bg-[#f6f4ef] border border-[#e5d5c3] flex items-center justify-center text-[#ffbb26]">
                        <Folder className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#121212] group-hover:text-[#ff3e00] transition-colors">
                          {cat.name}
                        </h4>
                        <span className="text-[10px] text-[#7e7e7d] font-mono">
                          /categorized/{cat.name}
                        </span>
                      </div>
                    </Link>
                    <span className="text-xs font-mono font-bold text-[#121212] px-2 py-0.5 rounded-full bg-[#f2f0ed] border border-[#e5d5c3]">
                      {cat.count} files
                    </span>
                  </div>

                  <p className="text-xs text-[#474645] leading-relaxed">
                    {cat.description}
                  </p>

                  {/* Subcategories tags */}
                  {cat.subcategories && cat.subcategories.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#f2f0ed]">
                      <span className="text-[10px] font-bold text-[#7e7e7d] uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                        <Tag className="w-3 h-3 text-[#ff3e00]" /> Subcategories:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.subcategories.map((sub) => (
                          <span
                            key={sub.slug}
                            className="text-[11px] px-2 py-0.5 rounded-[4px] bg-[#f6f4ef] text-[#474645] border border-[#e5d5c3]"
                          >
                            {sub.name} <span className="text-[#ff3e00] font-mono text-[9px]">({sub.count})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#f2f0ed] flex items-center justify-between text-[11px] text-[#7e7e7d] font-mono">
                  <span>🖥️ Desktop: {desktopCount}</span>
                  <span>📱 Mobile: {mobileCount}</span>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="family-demo-link flex items-center gap-1 font-semibold"
                  >
                    <span>View all</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
