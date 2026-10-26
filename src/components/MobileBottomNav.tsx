"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Compass, 
  Monitor, 
  Smartphone, 
  FolderTree, 
  Heart 
} from "lucide-react";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [favoriteCount, setFavoriteCount] = useState(0);

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

  const navItems = [
    { label: "Explore", href: "/", icon: Compass },
    { label: "Desktop", href: "/desktop", icon: Monitor },
    { label: "Mobile", href: "/mobile", icon: Smartphone },
    { label: "Folders", href: "/folders", icon: FolderTree },
    { label: "Favorites", href: "/favorites", icon: Heart, count: favoriteCount },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#fbfaf9]/95 backdrop-blur-xl border-t border-[#f2f0ed] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-[12px] min-w-[56px] transition-all relative ${
                isActive
                  ? "text-[#121212]"
                  : "text-[#7e7e7d] hover:text-[#121212]"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? "scale-110 text-[#ff3e00]" : ""}`} />
                {item.count !== undefined && item.count > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-[#ff2b3a] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                    {item.count > 99 ? "99+" : item.count}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight ${isActive ? "font-bold text-[#121212]" : "font-medium"}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#ff3e00] mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
