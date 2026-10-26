import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Folder } from "lucide-react";
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
          Categories
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        <span className="text-indigo-400 font-semibold">{category.name}</span>
      </nav>

      {/* Category Header Banner */}
      <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-white/10 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
            <Folder className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Directory / {category.name}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          {category.name} Wallpapers
        </h1>
        <p className="text-sm text-gray-300 mt-2 max-w-2xl leading-relaxed">
          {category.description}. Featuring {categoryWallpapers.length.toLocaleString()} categorized wallpapers available in Desktop landscape and Mobile portrait orientations.
        </p>
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
