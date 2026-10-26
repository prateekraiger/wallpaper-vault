import React from "react";
import Link from "next/link";
import { Layers, Monitor, Smartphone, Heart, Sparkles, Folder } from "lucide-react";

export default function Footer() {
  const categories = [
    { name: "Anime & Manga", slug: "anime-manga" },
    { name: "Cars & Automotive", slug: "cars-automotive" },
    { name: "Nature & Landscapes", slug: "nature-landscapes" },
    { name: "Cyberpunk & Sci-Fi", slug: "cyberpunk-sci-fi" },
    { name: "Dark & AMOLED", slug: "dark-amoled" },
    { name: "Abstract & 3D", slug: "abstract-3d" },
    { name: "Gaming & Superheroes", slug: "gaming-superheroes" },
    { name: "Space & Cosmos", slug: "space-cosmos" },
    { name: "Urban & Architecture", slug: "urban-architecture" },
    { name: "Animals & Wildlife", slug: "animals-wildlife" },
  ];

  return (
    <footer className="w-full border-t border-white/10 bg-[#06090e] text-gray-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Layers className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-base">WALLPAPER VAULT</span>
            </div>
            <p className="text-xs leading-relaxed text-gray-400">
              An exquisitely curated collection of 4,800+ ultra-high resolution 4K wallpapers, meticulously categorized across Desktop, Mobile, and 10 visual themes.
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-500 pt-2">
              <span className="flex items-center gap-1">
                <Monitor className="w-3.5 h-3.5 text-indigo-400" /> Desktop
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-purple-400" /> Mobile
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> 4K UHD
              </span>
            </div>
          </div>

          {/* Col 2: Categories (1-5) */}
          <div>
            <h4 className="text-xs font-semibold text-gray-200 uppercase tracking-wider mb-3">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="hover:text-indigo-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Categories (6-10) */}
          <div>
            <h4 className="text-xs font-semibold text-gray-200 uppercase tracking-wider mb-3">
              More Themes
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(5).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="hover:text-indigo-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Folder Structure & Organization */}
          <div>
            <h4 className="text-xs font-semibold text-gray-200 uppercase tracking-wider mb-3">
              Organization
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/desktop" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <Monitor className="w-3.5 h-3.5 text-indigo-400" /> Desktop Wallpapers (160+)
                </Link>
              </li>
              <li>
                <Link href="/mobile" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <Smartphone className="w-3.5 h-3.5 text-purple-400" /> Mobile Wallpapers (3,900+)
                </Link>
              </li>
              <li>
                <Link href="/folders" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <Folder className="w-3.5 h-3.5 text-amber-400" /> Folder Explorer
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <Heart className="w-3.5 h-3.5 text-rose-400" /> My Saved Favorites
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Wallpaper Vault. Open source wallpaper library.</p>
          <p className="flex items-center gap-1">
            Built with Next.js 15, TypeScript & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
