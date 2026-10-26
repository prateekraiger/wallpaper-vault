import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Folder, Tag } from "lucide-react";
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
      <nav className="flex items-center gap-1.5 text-xs text-[#7e7e7d]">
        <Link href="/" className="hover:text-[#121212] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-[#e5d5c3]" />
        <Link href="/folders" className="hover:text-[#121212] transition-colors">
          Folders
        </Link>
        <ChevronRight className="w-3 h-3 text-[#e5d5c3]" />
        <span className="text-[#121212] font-semibold">{category.name}</span>
      </nav>

      {/* Category Header Banner with Subcategory Badges */}
      <div className="rounded-[10px] bg-white p-6 sm:p-8 border border-[#f2f0ed] shadow-[inset_0_0_0_1px_#f2f0ed] relative overflow-hidden space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-[10px] bg-[#0086fc]/10 text-[#0086fc] flex items-center justify-center">
                <Folder className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0086fc]">
                Thematic Directory
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#121212] tracking-tight">
              {category.name} Wallpapers
            </h1>
            <p className="text-[14px] text-[#474645] mt-1 max-w-2xl leading-relaxed">
              {category.description}. Featuring {categoryWallpapers.length.toLocaleString()} categorized wallpapers optimized for PC monitors and mobile phones.
            </p>
          </div>

          <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center p-3.5 rounded-[10px] bg-[#f6f4ef] border border-[#e5d5c3]">
            <span className="text-xl font-bold text-[#121212]">
              {categoryWallpapers.length.toLocaleString()}
            </span>
            <span className="text-[11px] text-[#7e7e7d]">Wallpapers</span>
          </div>
        </div>

        {/* Human Subcategory Guide Strip */}
        {category.subcategories && category.subcategories.length > 0 && (
          <div className="pt-4 border-t border-[#f2f0ed] space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7e7e7d] flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#ff3e00]" /> Human-Curated Subcategories:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {category.subcategories.map((sub) => (
                <div
                  key={sub.slug}
                  className="p-3 rounded-[8px] bg-[#fbfaf9] hover:bg-[#f6f4ef] border border-[#f2f0ed] transition-all space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#121212] truncate">{sub.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#f2f0ed] text-[#474645] font-mono border border-[#e5d5c3]">
                      {sub.count}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7e7e7d] line-clamp-2 leading-relaxed">
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
