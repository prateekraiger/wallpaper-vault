import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToastContainer from "@/components/Toast";

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
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} min-h-screen flex flex-col bg-[#fbfaf9] text-[#343433] antialiased selection:bg-[#ff3e00] selection:text-white`}>
        <Header />
        <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          {children}
        </main>
        <Footer />
        <ToastContainer />
      </body>
    </html>
  );
}
