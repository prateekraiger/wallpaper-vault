import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Wallpaper Vault — 4,800+ 4K Wallpapers for Desktop & Mobile",
  description:
    "Explore a curated vault of over 4,800 ultra-high definition 4K wallpapers categorized into Desktop, Mobile, and 10 visual themes including Anime, Cars, Nature, AMOLED, Cyberpunk, and 3D Art.",
  keywords: [
    "wallpapers",
    "4k wallpapers",
    "desktop wallpapers",
    "mobile wallpapers",
    "anime wallpapers",
    "amoled wallpapers",
    "car wallpapers",
    "cyberpunk wallpapers",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} min-h-screen flex flex-col bg-[#070a10] text-gray-100 antialiased`}>
        <Header />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
