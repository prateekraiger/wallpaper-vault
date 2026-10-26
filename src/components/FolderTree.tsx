"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Folder, 
  FolderOpen, 
  ChevronRight, 
  ChevronDown, 
  Monitor, 
  Smartphone, 
  Layers, 
  HardDrive
} from "lucide-react";

interface FolderItem {
  name: string;
  count: number;
  slug: string;
}

interface DeviceFolder {
  name: string;
  icon: typeof Monitor;
  deviceType: "Desktop" | "Mobile" | "Square & Avatars";
  totalCount: number;
  categories: FolderItem[];
}

interface FolderTreeProps {
  onSelectFolder?: (device: string, category: string) => void;
  selectedDevice?: string;
  selectedCategory?: string;
}

export default function FolderTree({
  onSelectFolder,
  selectedDevice = "all",
  selectedCategory = "all",
}: FolderTreeProps) {
  // Pre-configured category counts per device
  const deviceFolders: DeviceFolder[] = [
    {
      name: "Desktop Wallpapers",
      icon: Monitor,
      deviceType: "Desktop",
      totalCount: 161,
      categories: [
        { name: "Anime & Manga", count: 59, slug: "anime-manga" },
        { name: "Abstract & 3D", count: 53, slug: "abstract-3d" },
        { name: "Nature & Landscapes", count: 18, slug: "nature-landscapes" },
        { name: "Cars & Automotive", count: 11, slug: "cars-automotive" },
        { name: "Dark & AMOLED", count: 7, slug: "dark-amoled" },
        { name: "Gaming & Superheroes", count: 7, slug: "gaming-superheroes" },
        { name: "Urban & Architecture", count: 3, slug: "urban-architecture" },
        { name: "Cyberpunk & Sci-Fi", count: 2, slug: "cyberpunk-sci-fi" },
        { name: "Animals & Wildlife", count: 1, slug: "animals-wildlife" },
      ],
    },
    {
      name: "Mobile Wallpapers",
      icon: Smartphone,
      deviceType: "Mobile",
      totalCount: 3916,
      categories: [
        { name: "Abstract & 3D", count: 1629, slug: "abstract-3d" },
        { name: "Anime & Manga", count: 887, slug: "anime-manga" },
        { name: "Dark & AMOLED", count: 647, slug: "dark-amoled" },
        { name: "Nature & Landscapes", count: 254, slug: "nature-landscapes" },
        { name: "Cars & Automotive", count: 236, slug: "cars-automotive" },
        { name: "Gaming & Superheroes", count: 104, slug: "gaming-superheroes" },
        { name: "Animals & Wildlife", count: 72, slug: "animals-wildlife" },
        { name: "Urban & Architecture", count: 48, slug: "urban-architecture" },
        { name: "Cyberpunk & Sci-Fi", count: 22, slug: "cyberpunk-sci-fi" },
        { name: "Space & Cosmos", count: 17, slug: "space-cosmos" },
      ],
    },
    {
      name: "Square & Avatars",
      icon: Layers,
      deviceType: "Square & Avatars",
      totalCount: 814,
      categories: [
        { name: "Abstract & 3D", count: 370, slug: "abstract-3d" },
        { name: "Anime & Manga", count: 126, slug: "anime-manga" },
        { name: "Dark & AMOLED", count: 99, slug: "dark-amoled" },
        { name: "Nature & Landscapes", count: 43, slug: "nature-landscapes" },
        { name: "Cars & Automotive", count: 40, slug: "cars-automotive" },
        { name: "Gaming & Superheroes", count: 30, slug: "gaming-superheroes" },
        { name: "Urban & Architecture", count: 28, slug: "urban-architecture" },
        { name: "Animals & Wildlife", count: 21, slug: "animals-wildlife" },
        { name: "Cyberpunk & Sci-Fi", count: 11, slug: "cyberpunk-sci-fi" },
        { name: "Space & Cosmos", count: 10, slug: "space-cosmos" },
      ],
    },
  ];

  const [expandedDevices, setExpandedDevices] = useState<Record<string, boolean>>({
    Desktop: true,
    Mobile: true,
    "Square & Avatars": false,
  });

  const toggleDevice = (dev: string) => {
    setExpandedDevices((prev) => ({
      ...prev,
      [dev]: !prev[dev],
    }));
  };

  return (
    <div className="w-full glass-card rounded-2xl p-4 sm:p-5 border border-white/10 select-none">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-gray-200 uppercase tracking-wider">
            Directory Explorer
          </span>
        </div>
        <span className="text-[11px] font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
          /categorized
        </span>
      </div>

      <div className="space-y-2">
        {deviceFolders.map((dev) => {
          const isExpanded = expandedDevices[dev.deviceType];
          const Icon = dev.icon;
          const isDeviceActive = selectedDevice === dev.deviceType;

          return (
            <div key={dev.name} className="rounded-xl overflow-hidden bg-white/[0.02] border border-white/5">
              {/* Device Folder Header */}
              <div
                onClick={() => {
                  toggleDevice(dev.deviceType);
                  if (onSelectFolder) onSelectFolder(dev.deviceType, "all");
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 cursor-pointer hover:bg-white/5 transition-colors ${
                  isDeviceActive && selectedCategory === "all"
                    ? "bg-indigo-600/15 border-l-2 border-indigo-500 text-indigo-200"
                    : "text-gray-300"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDevice(dev.deviceType);
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <Icon className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-semibold">{dev.name}</span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-gray-400">
                  {dev.totalCount.toLocaleString()} files
                </span>
              </div>

              {/* Category Subfolders */}
              {isExpanded && (
                <div className="pl-8 pr-3 pb-2 pt-1 space-y-1 border-t border-white/[0.03]">
                  {dev.categories.map((cat) => {
                    const isCatActive =
                      selectedDevice === dev.deviceType &&
                      (selectedCategory === cat.slug || selectedCategory === cat.name);

                    return (
                      <div
                        key={cat.slug}
                        onClick={() => {
                          if (onSelectFolder) {
                            onSelectFolder(dev.deviceType, cat.slug);
                          }
                        }}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-all ${
                          isCatActive
                            ? "bg-indigo-600/25 text-indigo-200 font-semibold"
                            : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {isCatActive ? (
                            <FolderOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          ) : (
                            <Folder className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                          )}
                          <span className="truncate">{cat.name}</span>
                        </div>
                        <span className="text-[10px] font-mono text-gray-500 ml-2 shrink-0">
                          {cat.count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
