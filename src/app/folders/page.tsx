import React from "react";
import Link from "next/link";
import { 
  FolderTree as FolderTreeIcon, 
  Folder, 
  Monitor, 
  Smartphone, 
  Layers, 
  ExternalLink,
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
      name: "Desktop Wallpapers",
      desc: "Landscape 16:9 & Ultrawide aspect ratios for PC, laptops & monitors",
      path: "/desktop",
      count: deviceCounts.Desktop,
      icon: Monitor,
      color: "from-indigo-600/30 to-blue-600/20",
      border: "border-indigo-500/30",
    },
    {
      name: "Mobile Wallpapers",
      desc: "Vertical 9:16 portrait wallpapers for smartphones & AMOLED displays",
      path: "/mobile",
      count: deviceCounts.Mobile,
      icon: Smartphone,
      color: "from-purple-600/30 to-pink-600/20",
      border: "border-purple-500/30",
    },
    {
      name: "Square & Avatars",
      desc: "Square 1:1 format for profile pictures, widgets, and aesthetics",
      path: "/?device=square",
      count: deviceCounts["Square & Avatars"],
      icon: Layers,
      color: "from-amber-600/30 to-orange-600/20",
      border: "border-amber-500/30",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Header Banner */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
            <FolderTreeIcon className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            System File Structure
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Wallpaper Directory Explorer
        </h1>
        <p className="text-sm text-gray-300 mt-2 max-w-2xl leading-relaxed">
          The collection has been organized into clear, dedicated folders on disk under <code>D:\My\wallpaper\categorized\</code>. Browse by hardware device form factor, thematic category, or subcategory below.
        </p>
      </div>

      {/* Top Device Master Folders */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-200">
          <HardDrive className="w-4 h-4 text-indigo-400" />
          <span>Device Form Factor Directories</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {devices.map((dev) => {
            const Icon = dev.icon;
            return (
              <Link
                key={dev.name}
                href={dev.path}
                className={`p-6 rounded-2xl glass-card border ${dev.border} relative overflow-hidden group`}
              >
                <div
                  className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${dev.color} rounded-full blur-2xl pointer-events-none -z-10`}
                />
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-white/10 text-gray-200 font-bold">
                    {dev.count.toLocaleString()} files
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {dev.name}
                </h3>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                  {dev.desc}
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform">
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
        <div className="flex items-center gap-2 text-sm font-bold text-gray-200">
          <Folder className="w-4 h-4 text-emerald-400" />
          <span>Interactive Directory Hierarchy</span>
        </div>

        <FolderTree />
      </div>

      {/* All 10 Category Subdirectories Grid with Subcategory Chips */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-200">
          <Layers className="w-4 h-4 text-purple-400" />
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
                className="p-5 rounded-2xl glass-card border border-white/5 hover:border-indigo-500/30 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Link href={`/category/${cat.slug}`} className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Folder className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {cat.name}
                        </h4>
                        <span className="text-[10px] text-gray-500 font-mono">
                          /categorized/{cat.name}
                        </span>
                      </div>
                    </Link>
                    <span className="text-xs font-mono font-bold text-indigo-300 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                      {cat.count} files
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed">
                    {cat.description}
                  </p>

                  {/* Subcategories tags */}
                  {cat.subcategories && cat.subcategories.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                        <Tag className="w-3 h-3 text-indigo-400" /> Subcategories:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.subcategories.map((sub) => (
                          <span
                            key={sub.slug}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.04] text-gray-300 border border-white/5"
                          >
                            {sub.name} <span className="text-indigo-400 font-mono text-[9px]">({sub.count})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400 font-mono">
                  <span>🖥️ Desktop: {desktopCount}</span>
                  <span>📱 Mobile: {mobileCount}</span>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
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
