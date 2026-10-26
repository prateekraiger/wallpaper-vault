export interface Wallpaper {
  id: string;
  title: string;
  category: string;
  categorySlug: string;
  device: "Desktop" | "Mobile" | "Square & Avatars";
  deviceSlug: string;
  filename: string;
  originalFolder: string;
  originalFilename: string;
  path: string;
  width: number;
  height: number;
  orientation: "portrait" | "landscape" | "square";
  aspectRatio: string;
  is4K: boolean;
  isAmoled: boolean;
  dominantColor: string;
  colorPalette: string[];
  tags: string[];
  sizeBytes: number;
  format: string;
  isShowcase: boolean;
  thumbUrl: string;
  url: string;
}

export interface CategoryInfo {
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface WallpapersData {
  generatedAt: string;
  totalWallpapers: number;
  deviceCounts: {
    Desktop: number;
    Mobile: number;
    "Square & Avatars": number;
  };
  categories: CategoryInfo[];
  wallpapers: Wallpaper[];
}
