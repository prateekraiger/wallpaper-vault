import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Folder, Sparkles, Layers, Tag } from "lucide-react";
import { getCategories, getAllWallpapers } from "@/lib/wallpapers";
import WallpaperGrid from "@/components/WallpaperGrid";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = getCategories();
  return categories.map((cat) => ({
    slug: cat.slug,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categories = getCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const allWallpapers = getAllWallpapers();
  const categoryWallpapers = allWallpapers.filter(
    (w) => w.categorySlug === slug
  );

  return (
    <div className="space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-gray-400">
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        <Link href="/folders" className="hover:text-white transition-colors">
          Folders
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        <span className="text-indigo-400 font-semibold">{category.name}</span>
      </nav>

      {/* Category Header Banner with Subcategory Badges */}
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
                <Folder className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Category Collection
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {category.name} Wallpapers
            </h1>
            <p className="text-sm text-gray-300 mt-2 max-w-2xl leading-relaxed">
              {category.description}. Featuring {categoryWallpapers.length.toLocaleString()} hand-classified wallpapers optimized for Desktop and Mobile screens.
            </p>
          </div>

          <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
            <span className="text-2xl font-black text-white">
              {categoryWallpapers.length.toLocaleString()}
            </span>
            <span className="text-xs text-gray-400">Total Wallpapers</span>
          </div>
        </div>

        {/* Human Subcategory Guide Strip */}
        {category.subcategories && category.subcategories.length > 0 && (
          <div className="pt-4 border-t border-white/5 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-indigo-400" /> Human-Curated Subcategories:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {category.subcategories.map((sub) => (
                <div
                  key={sub.slug}
                  className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition-all space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white truncate">{sub.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono">
                      {sub.count}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                    {sub.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filtered Wallpaper Grid */}
      <WallpaperGrid
        initialWallpapers={categoryWallpapers}
        categories={categories}
        defaultDevice="all"
        defaultCategory={category.slug}
      />
    </div>
  );
}
