import { NextRequest, NextResponse } from "next/server";
import { queryWallpapers, getCategories, getDeviceCounts } from "@/lib/wallpapers";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const category = searchParams.get("category") || "all";
  const device = searchParams.get("device") || "all";
  const search = searchParams.get("search") || "";
  const orientation = searchParams.get("orientation") || "all";
  const is4K = searchParams.get("is4K") === "true";
  const isAmoled = searchParams.get("isAmoled") === "true";
  const sortBy = (searchParams.get("sortBy") as any) || "popular";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "36", 10);

  const result = queryWallpapers({
    category,
    device,
    search,
    orientation,
    is4K,
    isAmoled,
    sortBy,
    page,
    limit,
  });

  return NextResponse.json({
    ...result,
    categories: getCategories(),
    deviceCounts: getDeviceCounts(),
  });
}
