import { NextResponse } from "next/server";
import { getRandomWallpaper } from "@/lib/wallpapers";

export async function GET() {
  const wallpaper = getRandomWallpaper();
  return NextResponse.json(wallpaper);
}
