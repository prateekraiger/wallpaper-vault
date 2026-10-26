"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Sparkles, 
  Monitor, 
  Smartphone, 
  FolderTree, 
  Heart, 
  Layers, 
  Github, 
  Menu, 
  X,
  Search
} from "lucide-react";

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
    { name: "Explore", href: "/", icon: Sparkles },
    { name: "Desktop", href: "/desktop", icon: Monitor, badge: "PC" },
    { name: "Mobile", href: "/mobile", icon: Smartphone, badge: "Phone" },
    { name: "Folders", href: "/folders", icon: FolderTree },
    { 
      name: "Favorites", 
      href: "/favorites", 
      icon: Heart, 
      count: favoriteCount 
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
                WALLPAPER
              </span>
              <span className="font-extrabold text-lg text-indigo-400">
                VAULT
              </span>
            </div>
            <p className="text-[10px] text-gray-400 -mt-1 font-medium tracking-wider uppercase">
              4,800+ 4K Collection
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-indigo-400" : "text-gray-400"}`} />
                <span>{item.name}</span>
                {item.badge && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-white/10 text-gray-300">
                    {item.badge}
                  </span>
                )}
                {item.count !== undefined && item.count > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/prateekraiger/wallpaper-vault"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0d121f] px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-gray-400" />
                  <span>{item.name}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30">
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
