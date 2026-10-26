"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Layers, 
  Monitor, 
  Smartphone, 
  FolderTree, 
  Heart, 
  Github, 
  Menu, 
  X, 
  Compass 
} from "lucide-react";

import LuminaLogo from "@/components/LuminaLogo";

export default function Header() {
  const pathname = usePathname();
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateFavs = () => {
      try {
        const stored = localStorage.getItem("wallpaper_favorites");
        if (stored) {
          const arr = JSON.parse(stored);
          setFavoriteCount(Array.isArray(arr) ? arr.length : 0);
        }
      } catch (e) {
        // ignore
      }
    };

    updateFavs();
    window.addEventListener("favorites-updated", updateFavs);
    window.addEventListener("storage", updateFavs);
    return () => {
      window.removeEventListener("favorites-updated", updateFavs);
      window.removeEventListener("storage", updateFavs);
    };
  }, []);

  const navLinks = [
    { name: "Explore", href: "/", icon: Compass },
    { name: "Desktop", href: "/desktop", icon: Monitor, badge: "4K" },
    { name: "Mobile", href: "/mobile", icon: Smartphone, badge: "AMOLED" },
    { name: "Categories", href: "/folders", icon: FolderTree },
    { 
      name: "Favorites", 
      href: "/favorites", 
      icon: Heart, 
      count: favoriteCount 
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#fbfaf9]/95 backdrop-blur-md border-b border-[#f2f0ed]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Lumina Brand Logo */}
        <Link href="/" className="group" aria-label="Lumina Wallpapers Home">
          <LuminaLogo size="md" className="hidden sm:flex" />
          <LuminaLogo size="sm" showTagline={false} className="sm:hidden" />
        </Link>

        {/* Center Desktop Navigation - Ghost Buttons */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-[32px] text-[14px] transition-all ${
                  isActive
                    ? "bg-[#f2f0ed] text-[#121212] font-semibold shadow-[inset_0_0_0_1px_#e5d5c3]"
                    : "text-[#474645] hover:text-[#121212] hover:bg-[#f6f4ef]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#ff3e00]" : "text-[#7e7e7d]"}`} />
                <span>{item.name}</span>
                {item.badge && (
                  <span className="text-[10px] font-medium px-1.5 py-0.2 rounded-full bg-[#e5d5c3]/50 text-[#474645]">
                    {item.badge}
                  </span>
                )}
                {item.count !== undefined && item.count > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#ff58ae] text-white">
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Actions - Sand Pill + Dark Pill */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/folders"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[32px] text-[13px] font-medium text-[#343433] bg-[#f6f4ef] hover:bg-[#edeae2] border border-[#e5d5c3] transition-all"
          >
            <FolderTree className="w-3.5 h-3.5 text-[#ff3e00]" />
            <span>Categories</span>
          </Link>

          <a
            href="https://github.com/prateekraiger/wallpaper-vault"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-[32px] text-[13px] font-medium bg-[#121212] hover:bg-[#2c2c2c] text-[#fbfaf9] shadow-sm transition-all"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-[10px] text-[#343433] hover:bg-[#f2f0ed] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#f2f0ed] bg-[#fbfaf9] px-4 pt-2 pb-4 space-y-1 shadow-sm">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-[10px] text-sm font-medium ${
                  isActive
                    ? "bg-[#f2f0ed] text-[#121212] font-semibold"
                    : "text-[#474645] hover:text-[#121212] hover:bg-[#f6f4ef]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-[#7e7e7d]" />
                  <span>{item.name}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ff58ae] text-white">
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
