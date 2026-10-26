import React from "react";
import Link from "next/link";
import { Monitor, Smartphone, Heart, Sparkles, Folder, ArrowUpRight } from "lucide-react";

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
    <footer className="w-full border-t border-[#f2f0ed] bg-[#fbfaf9] text-[#474645] mt-24">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[10px] bg-[#121212] flex items-center justify-center text-white shadow-xs">
                <span className="text-sm">✨</span>
              </div>
              <span className="font-bold text-[#121212] text-base tracking-tight">Family Vault</span>
            </div>
            <p className="text-[13px] leading-relaxed text-[#7e7e7d]">
              A warm storybook collection of 4,891 high-resolution wallpapers, carefully cataloged into desktop, phone, and 10 thematic folders on parchment canvas.
            </p>
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-[#f2f0ed] text-[#474645] border border-[#e5d5c3]">
                <Monitor className="w-3 h-3 text-[#0086fc]" /> Desktop
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-[#f2f0ed] text-[#474645] border border-[#e5d5c3]">
                <Smartphone className="w-3 h-3 text-[#ff58ae]" /> Mobile
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-[#ffbb26] text-[#121212] font-semibold">
                <Sparkles className="w-3 h-3" /> 4K UHD
              </span>
            </div>
          </div>

          {/* Col 2: Categories (1-5) */}
          <div>
            <h4 className="text-[12px] font-semibold text-[#121212] uppercase tracking-wider mb-3.5">
              Featured Themes
            </h4>
            <ul className="space-y-2 text-[13px]">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="hover:text-[#ff3e00] transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Categories (6-10) */}
          <div>
            <h4 className="text-[12px] font-semibold text-[#121212] uppercase tracking-wider mb-3.5">
              More Themes
            </h4>
            <ul className="space-y-2 text-[13px]">
              {categories.slice(5).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="hover:text-[#ff3e00] transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Directories & Collections */}
          <div>
            <h4 className="text-[12px] font-semibold text-[#121212] uppercase tracking-wider mb-3.5">
              Navigation
            </h4>
            <ul className="space-y-2 text-[13px]">
              <li>
                <Link href="/desktop" className="flex items-center gap-1.5 hover:text-[#ff3e00] transition-colors">
                  <Monitor className="w-3.5 h-3.5 text-[#0086fc]" />
                  <span>Desktop PC Wallpapers</span>
                </Link>
              </li>
              <li>
                <Link href="/mobile" className="flex items-center gap-1.5 hover:text-[#ff3e00] transition-colors">
                  <Smartphone className="w-3.5 h-3.5 text-[#ff58ae]" />
                  <span>Mobile Phone Wallpapers</span>
                </Link>
              </li>
              <li>
                <Link href="/folders" className="flex items-center gap-1.5 hover:text-[#ff3e00] transition-colors">
                  <Folder className="w-3.5 h-3.5 text-[#ffbb26]" />
                  <span>Folder Directory Tree</span>
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="flex items-center gap-1.5 hover:text-[#ff3e00] transition-colors">
                  <Heart className="w-3.5 h-3.5 text-[#ff2b3a]" />
                  <span>My Bookmarks</span>
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/prateekraiger/wallpaper-vault"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[#0086fc] hover:underline"
                >
                  <span>GitHub Repository</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Storybook Bottom Inset Bar */}
        <div className="pt-8 border-t border-[#f2f0ed] flex flex-col sm:flex-row items-center justify-between text-[12px] text-[#7e7e7d] gap-4">
          <p>© {new Date().getFullYear()} Wallpaper Vault · Handcrafted in Family design language.</p>
          <p className="flex items-center gap-1 text-[#474645]">
            Built with Next.js 15, TypeScript & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
